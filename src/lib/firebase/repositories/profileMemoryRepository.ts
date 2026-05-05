import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { ProfileMemory } from '@/types/firestore';

export const profileMemoryRepository = {
  create: (data: Omit<ProfileMemory, 'id'> & { id?: string }) =>
    createDocument('profileMemory', data),
  getById: (id: string) => getDocumentById('profileMemory', id),
  listByUser: (userId: string) =>
    listDocuments('profileMemory', {
      field: 'userId',
      value: userId,
      orderBy: 'updatedAt',
      limit: 10,
    }),
  update: (id: string, data: Partial<Omit<ProfileMemory, 'id' | 'createdAt'>>) =>
    updateDocument('profileMemory', id, data),
  remove: (id: string) => deleteDocument('profileMemory', id),
};
