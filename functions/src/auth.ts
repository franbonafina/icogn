import type { Request } from 'firebase-functions/v2/https';

import { adminAuth } from './firebase.js';

export async function requireAuthenticatedUser(request: Request) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    throw new Error('Missing Bearer token.');
  }

  const idToken = authorization.slice('Bearer '.length);
  const decodedToken = await adminAuth.verifyIdToken(idToken);

  return {
    userId: decodedToken.uid,
    email: decodedToken.email ?? null,
  };
}
