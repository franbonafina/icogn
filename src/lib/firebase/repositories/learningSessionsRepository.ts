import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { LearningSession } from '@/types/firestore';

export const learningSessionsRepository = {
  create: (data: Omit<LearningSession, 'id'> & { id?: string }) =>
    createDocument('learningSessions', data),
  getById: (id: string) => getDocumentById('learningSessions', id),
  listByUser: (userId: string) =>
    listDocuments('learningSessions', {
      field: 'userId',
      value: userId,
      orderBy: 'createdAt',
    }),
  listByLearningItem: (learningItemId: string) =>
    listDocuments('learningSessions', {
      field: 'learningItemId',
      value: learningItemId,
      orderBy: 'createdAt',
    }),
  update: (id: string, data: Partial<Omit<LearningSession, 'id' | 'createdAt'>>) =>
    updateDocument('learningSessions', id, data),
  remove: (id: string) => deleteDocument('learningSessions', id),
};
