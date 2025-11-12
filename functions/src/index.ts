import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();
const db = admin.firestore();

// WhatsApp Cloud API helpers
const WA_TOKEN = (functions.config() as any)?.wa?.token || process.env.WHATSAPP_TOKEN;
const WA_PHONE_NUMBER_ID = (functions.config() as any)?.wa?.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID;
const WA_VERIFY_TOKEN = (functions.config() as any)?.wa?.verify_token || process.env.WA_VERIFY_TOKEN || 'verify_token';
const WA_MANAGERS = ((functions.config() as any)?.wa?.managers || process.env.WA_MANAGERS || '').split(',').map((s: string) => s.trim()).filter(Boolean);

async function sendWhatsAppText(to: string, body: string) {
  if (!WA_TOKEN || !WA_PHONE_NUMBER_ID) {
    console.warn('WhatsApp config is missing. Skipping send.');
    return;
  }
  const url = `https://graph.facebook.com/v19.0/${WA_PHONE_NUMBER_ID}/messages`;
  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    },
    { headers: { Authorization: `Bearer ${WA_TOKEN}` } }
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ticketSummaryText(d: admin.firestore.DocumentData) {
  return [
    `Ticket: ${d.ticketNumber}`,
    `Incident: ${d.incidentName}`,
    `Subcategory: ${d.subcategory}`,
    d.priority ? `Priority: ${d.priority}` : undefined,
  ].filter(Boolean).join('\n');
}

// 1) Firestore trigger: on ticket create -> notify EHS managers or resolver group
export const onTicketCreated = functions.firestore
  .document('tickets/{ticketId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const summary = ticketSummaryText(data);

    const message =
      `${summary}\n\n` +
      `Reply commands (WhatsApp):\n` +
      `ACCEPT ${data.ticketNumber}\n` +
      `ASSIGN ${data.ticketNumber} <phone>\n` +
      `RESOLVE ${data.ticketNumber}\n` +
      `CLOSE ${data.ticketNumber}\n` +
      `STATUS ${data.ticketNumber}`;

    let recipients: string[] | undefined = data.assignedGroupPhones as string[] | undefined;
    if (!recipients || recipients.length === 0) {
      if (data.assignedGroup) {
        const groupDoc = await db.collection('resolverGroups').doc(slugify(String(data.assignedGroup))).get();
        const phones = (groupDoc.exists ? (groupDoc.data()?.phones as string[] | undefined) : undefined) || [];
        if (phones.length > 0) recipients = phones;
      }
    }
    if (!recipients || recipients.length === 0) recipients = WA_MANAGERS;

    await Promise.all(recipients.map((to) => sendWhatsAppText(to, `New Incident Reported\n${message}`)));

    await snap.ref.update({ status: 'queue_generic', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  });

// 2) WhatsApp webhook: receive replies and update ticket state
export const waWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === WA_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }

  try {
    const body = req.body;
    const entries = body?.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const messages = change?.value?.messages || [];
        for (const msg of messages) {
          const from = msg.from as string; // sender phone
          const textBody = msg.text?.body as string | undefined;
          if (!textBody) continue;

          await handleCommand(from, textBody);
        }
      }
    }
    return res.sendStatus(200);
  } catch (e) {
    console.error('waWebhook error', e);
    return res.sendStatus(500);
  }
});

async function handleCommand(from: string, text: string) {
  const t = text.trim();
  const accept = /^ACCEPT\s+(TKT-\d+)/i.exec(t);
  const assign = /^ASSIGN\s+(TKT-\d+)\s+(\+?\d{8,15})/i.exec(t);
  const resolve = /^RESOLVE\s+(TKT-\d+)/i.exec(t);
  const close = /^CLOSE\s+(TKT-\d+)/i.exec(t);
  const status = /^STATUS\s+(TKT-\d+)/i.exec(t);

  if (accept) {
    const ticket = accept[1];
    const ok = await updateByNumber(ticket, {
      status: 'assigned',
      assignedTo: from,
    });
    if (ok) await sendWhatsAppText(from, `Accepted ${ticket}. You are assigned.`);
    return;
  }

  if (assign) {
    const ticket = assign[1];
    const assignee = assign[2];
    const ok = await updateByNumber(ticket, {
      status: 'assigned',
      assignedTo: assignee,
    });
    if (ok) await sendWhatsAppText(assignee, `You have been assigned ${ticket}. Reply RESOLVE ${ticket} when done.`);
    return;
  }

  if (resolve) {
    const ticket = resolve[1];
    const ok = await updateByNumber(ticket, { status: 'resolved' });
    if (ok) await sendWhatsAppText(from, `Marked ${ticket} resolved. Waiting for requester to review.`);
    return;
  }

  if (close) {
    const ticket = close[1];
    const ok = await updateByNumber(ticket, { status: 'closed' });
    if (ok) await sendWhatsAppText(from, `Closed ${ticket}. Thank you.`);
    return;
  }

  if (status) {
    const ticket = status[1];
    const d = await getByNumber(ticket);
    if (d) await sendWhatsAppText(from, `Status for ${ticket}: ${d.status}`);
    return;
  }

  // Unknown
  await sendWhatsAppText(from, 'Unknown command. Use ACCEPT/ASSIGN/RESOLVE/CLOSE/STATUS <TKT-XXXXXX>');
}

async function updateByNumber(ticketNumber: string, update: admin.firestore.UpdateData) {
  const snap = await db.collection('tickets').where('ticketNumber', '==', ticketNumber).limit(1).get();
  if (snap.empty) return false;
  await snap.docs[0].ref.update({ ...update, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  return true;
}

async function getByNumber(ticketNumber: string) {
  const snap = await db.collection('tickets').where('ticketNumber', '==', ticketNumber).limit(1).get();
  return snap.empty ? null : (snap.docs[0].data() as any);
}

// 3) SLA monitor: escalate overdue tickets
export const slaMonitor = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  const now = new Date().toISOString();
  const snap = await db.collection('tickets')
    .where('status', 'in', ['open', 'queue_generic', 'assigned', 'escalated'])
    .get();

  const overdue = snap.docs.filter(d => {
    const data = d.data() as any;
    return data.slaDeadlineAt && data.slaDeadlineAt < now;
  });

  await Promise.all(overdue.map(async (doc) => {
    const data = doc.data() as any;
    const summary = ticketSummaryText(data);
    await doc.ref.update({ status: 'escalated', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    await Promise.all(WA_MANAGERS.map((to) => sendWhatsAppText(to, `SLA expired\n${summary}`)));
  }));

  return null;
});
