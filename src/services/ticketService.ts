import { firestore } from './firebase';

export type CreateTicketInput = {
  incidentName: string;
  subcategory: string;
  priority?: 'low' | 'medium' | 'high';
  hasResolverGroup?: boolean;
  categoryId?: string;
  assignedGroup?: string; // e.g. "maintenance" (slug will be applied server-side)
  assignedGroupPhones?: string[]; // e.g. ['+9198...', '+1415...']
  createdBy?: string;
  location?: { lat: number; lng: number } | null;
};

export type CreateTicketResult = {
  ticketId: string; // human-friendly ticket number, e.g. TKT-XXXXXXXX
  docId: string; // Firestore document id
};

function generateTicketNumber() {
  const ts = Date.now().toString();
  return `TKT-${ts.slice(-8)}`; // last 8 digits of epoch millis
}

function sanitizeId(s: string) {
  return s.replace(/\//g, '-');
}

export async function createTicket(input: CreateTicketInput): Promise<CreateTicketResult> {
  try {
    console.log('Creating ticket with input:', input);
    try {
      const app = firestore().app as any;
      console.log('Firebase projectId:', app?.options?.projectId);
    } catch (e) {
      console.log('Unable to read firebase app options');
    }
    const ticketNumber = generateTicketNumber();

    const now = new Date();
    const payload = {
      ticketNumber,
      incidentName: input.incidentName,
      subcategory: input.subcategory,
      categoryId: input.categoryId ?? null,
      priority: input.priority ?? 'medium',
      status: 'open',
      createdAt: firestore.FieldValue.serverTimestamp(),
      createdAtClient: now.toISOString(),
      createdBy: input.createdBy ?? 'anonymous',
      location: input.location ? new firestore.GeoPoint(input.location.lat, input.location.lng) : null,
      hasResolverGroup: Boolean(input.hasResolverGroup ?? true),
      assignedGroup: input.assignedGroup ?? null,
      assignedGroupPhones: Array.isArray(input.assignedGroupPhones) ? input.assignedGroupPhones : [],
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    const categoryId = sanitizeId(input.incidentName);
    const subId = sanitizeId(input.subcategory);

    

    try {
      await firestore().collection('tickets').doc(categoryId).set(
        {
          title: input.incidentName,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      await firestore()
        .collection('tickets')
        .doc(categoryId)
        .collection('subcategories')
        .doc(subId)
        .set(
          {
            name: input.subcategory,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      await firestore()
        .collection('tickets')
        .doc(categoryId)
        .collection('subcategories')
        .doc(subId)
        .collection('tickets')
        .doc(ticketNumber)
        .set({
          ...payload,
          categoryTitle: input.incidentName,
          categorySlug: categoryId,
          subcategorySlug: subId,
        });
    } catch (e) {
      console.log('Tickets hierarchical write failed (non-blocking):', e);
    }

    

    return { ticketId: ticketNumber, docId: ticketNumber };
  } catch (error) {
    console.error('Error in createTicket:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

export type TicketUpdate = Partial<{
  status: 'open' | 'assigned' | 'queue_generic' | 'resolved' | 'closed' | 'escalated';
  assignedTo: string | null;
  assignedGroup: string | null;
  updatedAt: any;
}>;

export async function updateTicketByNumber(_ticketNumber: string, _update: TicketUpdate) { return false; }

export async function updateTicketByPath(
  categoryTitle: string,
  subcategoryName: string,
  ticketNumber: string,
  update: TicketUpdate
) {
  const serverUpdate = { ...update, updatedAt: firestore.FieldValue.serverTimestamp() } as any;
  await firestore()
    .collection('tickets')
    .doc(sanitizeId(categoryTitle))
    .collection('subcategories')
    .doc(sanitizeId(subcategoryName))
    .collection('tickets')
    .doc(ticketNumber)
    .set(serverUpdate, { merge: true });
  return true;
}

export async function getTicketsByCategoryAndSubcategory(categoryTitle: string, subcategoryName: string) {
  const snap = await firestore()
    .collection('tickets')
    .doc(sanitizeId(categoryTitle))
    .collection('subcategories')
    .doc(sanitizeId(subcategoryName))
    .collection('tickets')
    .orderBy('timestamp', 'desc')
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function getTicketFromHierarchy(
  categoryTitle: string,
  subcategoryName: string,
  ticketNumber: string
) {
  const ref = firestore()
    .collection('tickets')
    .doc(sanitizeId(categoryTitle))
    .collection('subcategories')
    .doc(sanitizeId(subcategoryName))
    .collection('tickets')
    .doc(ticketNumber);
  const snap = await ref.get();
  return snap.exists ? { id: snap.id, ...(snap.data() as any) } : null;
}

export async function purgeObsoleteCollections() {
  const db = firestore();
  async function deleteCollection(collPath: string, chunk = 300) {
    for (;;) {
      const snap = await db.collection(collPath).limit(chunk).get();
      if (snap.empty) break;
      const batch = db.batch();
      snap.docs.forEach((d: any) => batch.delete(d.ref));
      await batch.commit();
    }
  }
  await deleteCollection('categories');
  await deleteCollection('subcategories');
  const catSnap = await db.collection('resolve_tickets').get();
  for (const cat of catSnap.docs) {
    const subSnap = await cat.ref.collection('subcategories').get();
    for (const sub of subSnap.docs) {
      for (;;) {
        const tSnap = await sub.ref.collection('tickets').limit(300).get();
        if (tSnap.empty) break;
        const batch = db.batch();
        tSnap.docs.forEach((t: any) => batch.delete(t.ref));
        await batch.commit();
      }
      await sub.ref.delete();
    }
    await cat.ref.delete();
  }
}

export async function purgeTopLevelTicketDocs() {
  const db = firestore();
  for (;;) {
    const snap = await db.collection('tickets').where('ticketNumber', '>=', '').limit(300).get();
    if (snap.empty) break;
    const batch = db.batch();
    snap.docs.forEach((d: any) => batch.delete(d.ref));
    await batch.commit();
  }
}
