import { FieldValue } from 'firebase-admin/firestore';

import { seedDecisionScenarios } from './data.js';
import { adminDb } from './firebaseAdmin.js';

export async function seedDecisionScenariosData() {
  for (const scenario of seedDecisionScenarios) {
    const ref = adminDb.collection('decisionScenarios').doc();

    await ref.set({
      ...scenario,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  console.log(`Seeded ${seedDecisionScenarios.length} decision scenarios`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void seedDecisionScenariosData().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
