import { initializeApp, getApps } from 'firebase/app';

import { firebaseConfig, isFirebaseConfigured } from '@/lib/firebase/config';

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  return getApps()[0] ?? initializeApp(firebaseConfig);
}
