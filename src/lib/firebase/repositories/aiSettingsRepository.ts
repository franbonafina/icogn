import {
  createDocument,
  deleteDocument,
  getDocumentById,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { AiSettings } from '@/types/firestore';

export const aiSettingsRepository = {
  create: (data: Omit<AiSettings, 'id'> & { id?: string }) =>
    createDocument('aiSettings', data),
  getById: (id: string) => getDocumentById('aiSettings', id),
  getByUserId: (userId: string) => getDocumentById('aiSettings', userId),
  upsert: async (userId: string, data: Omit<AiSettings, 'id'>) => {
    const existing = await getDocumentById('aiSettings', userId);

    if (existing) {
      await updateDocument('aiSettings', userId, data);
      return getDocumentById('aiSettings', userId);
    }

    return createDocument('aiSettings', {
      ...data,
      id: userId,
    });
  },
  update: (id: string, data: Partial<Omit<AiSettings, 'id' | 'createdAt'>>) =>
    updateDocument('aiSettings', id, data),
  remove: (id: string) => deleteDocument('aiSettings', id),
};
