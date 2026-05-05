import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { SpeechSession } from '@/types/firestore';

export const speechSessionsRepository = {
  create: (data: Omit<SpeechSession, 'id'> & { id?: string }) =>
    createDocument('speechSessions', data),
  getById: (id: string) => getDocumentById('speechSessions', id),
  listByUser: (userId: string) =>
    listDocuments('speechSessions', {
      field: 'userId',
      value: userId,
      orderBy: 'createdAt',
    }),
  update: (id: string, data: Partial<Omit<SpeechSession, 'id' | 'createdAt'>>) =>
    updateDocument('speechSessions', id, data),
  remove: (id: string) => deleteDocument('speechSessions', id),
};
