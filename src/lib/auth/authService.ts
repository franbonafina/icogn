import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { createUserFromAccessCode, findUserByAccessCode, type UserSeed } from '@/lib/seeds/users';
import { getFirebaseAuth } from '@/lib/firebase/auth';
import { getFirebaseApp } from '@/lib/firebase/client';
import { getFirestore } from 'firebase/firestore';
import { getAuthErrorMessage, getErrorType } from './errorHandler';

export interface AuthUser {
  uid: string;
  displayName: string;
  email: string;
  accessCode: string;
}

export async function signInWithAccessCode(accessCode: string): Promise<AuthUser> {
  const normalizedCode = accessCode.toUpperCase().trim();
  
  if (normalizedCode.length < 6) {
    throw new Error('Access code must be at least 6 characters');
  }
  
  let userSeed = findUserByAccessCode(normalizedCode);
  
  if (!userSeed) {
    if (normalizedCode.startsWith('CIVIC-')) {
      // Create new user for CIVIC codes
      const newUser = createUserFromAccessCode(normalizedCode);
      if (!newUser) {
        throw new Error('Failed to create user from access code');
      }
      userSeed = newUser;
    } else {
      throw new Error('Invalid access code. Codes must start with CIVIC-');
    }
  }
  
  const auth = getFirebaseAuth();
  const app = getFirebaseApp();
  
  if (!auth || !app) {
    throw new Error('Firebase not initialized');
  }
  
  // Create or sign in user with email/password
  const email = userSeed.email;
  const password = `CivicMind_${userSeed.accessCode}`;
  
  try {
    // Try to sign in first
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user data in Firestore
    await storeUserInFirestore(user.uid, userSeed);
    
    return {
      uid: user.uid,
      displayName: userSeed.displayName,
      email: userSeed.email,
      accessCode: userSeed.accessCode,
    };
  } catch (error: any) {
    // If user doesn't exist, create it
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Store user data in Firestore
        await storeUserInFirestore(user.uid, userSeed);
        
        return {
          uid: user.uid,
          displayName: userSeed.displayName,
          email: userSeed.email,
          accessCode: userSeed.accessCode,
        };
      } catch (createError: any) {
        // If user creation fails, throw a user-friendly error
        throw new Error(getAuthErrorMessage(createError, 'es'));
      }
    }
    // For other errors, throw a user-friendly error
    throw new Error(getAuthErrorMessage(error, 'es'));
  }
}

async function storeUserInFirestore(uid: string, userSeed: UserSeed): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return;
  
  const db = getFirestore(app);
  const userDoc = doc(db, 'users', uid);
  
  await setDoc(userDoc, {
    displayName: userSeed.displayName,
    email: userSeed.email,
    accessCode: userSeed.accessCode,
    createdAt: userSeed.createdAt,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      resolve(null);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      
      if (!firebaseUser) {
        resolve(null);
        return;
      }
      
      // Get user data from Firestore
      try {
        const app = getFirebaseApp();
        if (!app) {
          resolve(null);
          return;
        }
        
        const db = getFirestore(app);
        const userDoc = doc(db, 'users', firebaseUser.uid);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          resolve({
            uid: firebaseUser.uid,
            displayName: userData.displayName || firebaseUser.displayName || 'User',
            email: userData.email || firebaseUser.email || '',
            accessCode: userData.accessCode || '',
          });
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        resolve(null);
      }
    });
  });
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await firebaseSignOut(auth);
  }
}

export function isValidAccessCode(accessCode: string): boolean {
  const normalizedCode = accessCode.toUpperCase().trim();
  return normalizedCode.length >= 6 && normalizedCode.startsWith('CIVIC-');
}
