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
  getByUserId: (userId: string) => getDocumentById('profileMemory', userId),
  listByUser: (userId: string) =>
    listDocuments('profileMemory', {
      field: 'userId',
      value: userId,
      orderBy: 'updatedAt',
      limit: 10,
    }),
  upsert: async (userId: string, data: Omit<ProfileMemory, 'id'>) => {
    const existing = await getDocumentById('profileMemory', userId);

    if (existing) {
      await updateDocument('profileMemory', userId, data);
      return getDocumentById('profileMemory', userId);
    }

    return createDocument('profileMemory', {
      ...data,
      id: userId,
    });
  },
  update: (id: string, data: Partial<Omit<ProfileMemory, 'id' | 'createdAt'>>) =>
    updateDocument('profileMemory', id, data),
  remove: (id: string) => deleteDocument('profileMemory', id),
};
