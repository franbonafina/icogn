import { getFirebaseAuth } from '@/lib/firebase/auth';

const demoUserId = 'demo-user';

export async function getCurrentAppUser() {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser ?? null;

  if (!user) {
    return {
      userId: demoUserId,
      token: null,
      displayName: 'Operator',
    };
  }

  return {
    userId: user.uid,
    token: await user.getIdToken(),
    displayName: user.displayName || user.email?.split('@')[0] || 'Operator',
  };
}
