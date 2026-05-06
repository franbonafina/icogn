import { FieldValue } from 'firebase-admin/firestore';

import { adminDb } from './firebase.js';
import type { AiEvaluationRecord } from './types.js';

export async function storeAiEvaluation(record: AiEvaluationRecord) {
  await adminDb.collection('aiEvaluations').add({
    ...record,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}
