import { FieldValue } from 'firebase-admin/firestore';

import { seedLearningItems } from './data.js';
import { adminDb, getSeedUserId } from './firebaseAdmin.js';

export async function seedLearningItemsData() {
  const userId = getSeedUserId();

  for (const item of seedLearningItems) {
    const ref = adminDb.collection('learningItems').doc();

    await ref.set({
      userId,
      ...item,
      nextReviewAt: null,
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lastScore: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  console.log(`Seeded ${seedLearningItems.length} learning items for user ${userId}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void seedLearningItemsData().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
