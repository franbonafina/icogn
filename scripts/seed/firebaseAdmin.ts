import { config as loadEnv } from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

loadEnv({ path: '.env.seeds' });
loadEnv({ path: '.env.seeds.local', override: true });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    'Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.seeds or .env.seeds.local.',
  );
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    projectId,
  });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const seedProjectId = projectId;

export function getSeedUserId() {
  return process.env.SEED_USER_ID || 'demo-user';
}

export function getSeedAccessCode() {
  return process.env.SEED_ACCESS_CODE || 'CIVIC-DEMO-001';
}
