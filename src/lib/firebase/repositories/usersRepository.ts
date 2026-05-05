import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { User } from '@/types/firestore';

export const usersRepository = {
  create: (data: Omit<User, 'id'> & { id?: string }) => createDocument('users', data),
  getById: (id: string) => getDocumentById('users', id),
  list: () => listDocuments('users', { orderBy: 'updatedAt' }),
  listByCohort: (cohortId: string) =>
    listDocuments('users', { field: 'cohortIds', op: 'array-contains', value: cohortId }),
  update: (id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>) =>
    updateDocument('users', id, data),
  remove: (id: string) => deleteDocument('users', id),
};
