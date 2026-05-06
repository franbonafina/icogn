import { FieldValue } from 'firebase-admin/firestore';

import { seedProfileMemory } from './data.js';
import { adminAuth, adminDb, getSeedUserId } from './firebaseAdmin.js';

async function ensureDemoUser(userId: string) {
  try {
    await adminAuth.getUser(userId);
  } catch {
    await adminAuth.createUser({
      uid: userId,
      email: `${userId}@example.local`,
      displayName: 'Demo User',
    });
  }
}

export async function seedDemoProfile() {
  const userId = getSeedUserId();

  await ensureDemoUser(userId);

  await adminDb.collection('profileMemory').doc(userId).set(
    {
      userId,
      ...seedProfileMemory,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`Seeded demo profile memory for user ${userId}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void seedDemoProfile().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
