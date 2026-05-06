import { FieldValue, type Transaction } from 'firebase-admin/firestore';

import { adminDb } from './firebase.js';

const RATE_LIMITS: Record<string, { windowMs: number; maxRequests: number }> = {
  extractLearningItems: { windowMs: 60_000, maxRequests: 8 },
  evaluateRecallAnswer: { windowMs: 60_000, maxRequests: 20 },
  evaluateSpeechTranscript: { windowMs: 60_000, maxRequests: 8 },
  evaluateDecisionAttempt: { windowMs: 60_000, maxRequests: 10 },
  generateDecisionScenario: { windowMs: 60_000, maxRequests: 8 },
  evaluateFormationReflection: { windowMs: 60_000, maxRequests: 10 },
  evaluateStructureAnalysis: { windowMs: 60_000, maxRequests: 10 },
  evaluateDecisionMemo: { windowMs: 60_000, maxRequests: 8 },
  evaluateExecutiveCommunication: { windowMs: 60_000, maxRequests: 10 },
  generateDailyFormationTask: { windowMs: 60_000, maxRequests: 8 },
  generateWeeklyFormationReview: { windowMs: 60_000, maxRequests: 6 },
};

export async function enforceRateLimit(userId: string, action: keyof typeof RATE_LIMITS) {
  const config = RATE_LIMITS[action];
  const bucket = Math.floor(Date.now() / config.windowMs);
  const ref = adminDb.collection('aiRateLimits').doc(`${userId}:${action}:${bucket}`);

  await adminDb.runTransaction(async (transaction: Transaction) => {
    const snapshot = await transaction.get(ref);
    const count = snapshot.exists ? (snapshot.data()?.count as number | undefined) ?? 0 : 0;

    if (count >= config.maxRequests) {
      throw new Error(`Rate limit exceeded for ${action}.`);
    }

    transaction.set(
      ref,
      {
        userId,
        action,
        bucket,
        count: count + 1,
        createdAt: snapshot.exists ? snapshot.data()?.createdAt : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
}
