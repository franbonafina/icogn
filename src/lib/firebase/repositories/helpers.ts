import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as applyLimit,
  orderBy as applyOrderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore';

import { getFirebaseDb } from '@/lib/firebase/db';
import type {
  BaseEntity,
  CollectionMap,
  CollectionName,
  FirestoreDateValue,
} from '@/types/firestore';

type CreateInput<T extends { id: string }> = Omit<T, 'id'> & { id?: string };
type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt'>> & {
  updatedAt?: FirestoreDateValue;
};

export type ListOptions<T> = {
  field?: keyof T & string;
  op?:
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'array-contains'
    | 'array-contains-any'
    | 'in'
    | 'not-in';
  value?: unknown;
  orderBy?: keyof T & string;
  direction?: 'asc' | 'desc';
  limit?: number;
};

function mapSnapshot<T extends { id: string }>(
  snapshot: DocumentSnapshot<DocumentData>,
): T | null {
  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<T, 'id'>),
  } as T;
}

function withWriteTimestamps<T extends Partial<BaseEntity>>(data: T, isCreate: boolean) {
  return {
    ...data,
    ...(isCreate ? { createdAt: data.createdAt ?? serverTimestamp() } : {}),
    updatedAt: data.updatedAt ?? serverTimestamp(),
  };
}

export async function createDocument<K extends CollectionName>(
  collectionName: K,
  data: CreateInput<CollectionMap[K]>,
): Promise<CollectionMap[K]> {
  const db = getFirebaseDb();
  const { id, ...rest } = data;
  const payload = withWriteTimestamps(rest as Partial<BaseEntity>, true);

  if (id) {
    await setDoc(doc(db, collectionName, id), payload);
    return getDocumentById(collectionName, id).then((document) => {
      if (!document) {
        throw new Error(`Failed to create document in ${collectionName}.`);
      }

      return document;
    });
  }

  const createdRef = await addDoc(collection(db, collectionName), payload);
  return getDocumentById(collectionName, createdRef.id).then((document) => {
    if (!document) {
      throw new Error(`Failed to create document in ${collectionName}.`);
    }

    return document;
  });
}

export async function getDocumentById<K extends CollectionName>(
  collectionName: K,
  id: string,
): Promise<CollectionMap[K] | null> {
  const db = getFirebaseDb();
  const snapshot = await getDoc(doc(db, collectionName, id));
  return mapSnapshot<CollectionMap[K]>(snapshot);
}

export async function listDocuments<K extends CollectionName>(
  collectionName: K,
  options: ListOptions<CollectionMap[K]> = {},
): Promise<Array<CollectionMap[K]>> {
  const db = getFirebaseDb();
  const constraints: QueryConstraint[] = [];

  if (options.field && typeof options.value !== 'undefined') {
    constraints.push(where(options.field, options.op ?? '==', options.value));
  }

  if (options.orderBy) {
    constraints.push(applyOrderBy(options.orderBy, options.direction ?? 'desc'));
  }

  if (options.limit) {
    constraints.push(applyLimit(options.limit));
  }

  const collectionRef = collection(db, collectionName);
  const snapshot = constraints.length
    ? await getDocs(query(collectionRef, ...constraints))
    : await getDocs(collectionRef);

  return snapshot.docs.map(
    (document) =>
      ({
        id: document.id,
        ...(document.data() as Omit<CollectionMap[K], 'id'>),
      }) as CollectionMap[K],
  );
}

export async function updateDocument<K extends CollectionName>(
  collectionName: K,
  id: string,
  data: UpdateInput<CollectionMap[K]>,
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, collectionName, id), withWriteTimestamps(data, false));
}

export async function deleteDocument<K extends CollectionName>(
  collectionName: K,
  id: string,
): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, collectionName, id));
}
