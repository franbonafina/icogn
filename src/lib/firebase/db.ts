import { getFirestore } from 'firebase/firestore';

import { getFirebaseApp } from '@/lib/firebase/client';

export function getFirebaseDb() {
  const app = getFirebaseApp();

  if (!app) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* variables.');
  }

  return getFirestore(app);
}
