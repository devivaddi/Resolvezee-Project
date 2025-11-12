import { firestore } from './firebase';

const resolverBySubcategory: Record<string, { groupId: string; name: string }> = {
  'Electric Shock': { groupId: 'elec', name: 'Electrical Safety Team' },
  'Arc Flash/Blast': { groupId: 'elec', name: 'Electrical Safety Team' },
  'Entanglement': { groupId: 'ehs-mach', name: 'EHS Machinery' },
  'Crushing': { groupId: 'ehs-mach', name: 'EHS Machinery' },
  'Shearing': { groupId: 'ehs-mach', name: 'EHS Machinery' },
  'Chemical Burns': { groupId: 'chem', name: 'Chemical Safety' },
  'Chemical Spills': { groupId: 'chem', name: 'Chemical Safety' },
};

export async function startWorkflowForTicket(args: { docId: string; subcategory: string }) {
  const group = resolverBySubcategory[args.subcategory] ?? { groupId: 'triage', name: 'EHS Triage Queue' };
  const status = group.groupId === 'triage' ? 'queue_generic' : 'assigned';

  await firestore()
    .collection('tickets')
    .doc(args.docId)
    .set(
      {
        assignedGroup: group.name,
        status,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}
