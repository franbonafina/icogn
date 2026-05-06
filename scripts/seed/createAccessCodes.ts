import { FieldValue } from 'firebase-admin/firestore';

import { adminDb, getSeedAccessCode } from './firebaseAdmin.js';

export async function createAccessCodesSeed() {
  const code = getSeedAccessCode();
  const ref = adminDb.collection('accessCodes').doc(code);

  await ref.set(
    {
      code,
      label: 'Demo access code',
      cohortId: 'demo-cohort',
      maxUses: 250,
      usesCount: 0,
      status: 'active',
      expiresAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`Seeded access code: ${code}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void createAccessCodesSeed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
