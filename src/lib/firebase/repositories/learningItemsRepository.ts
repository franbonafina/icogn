import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { LearningItem } from '@/types/firestore';

export const learningItemsRepository = {
  create: (data: Omit<LearningItem, 'id'> & { id?: string }) =>
    createDocument('learningItems', data),
  getById: (id: string) => getDocumentById('learningItems', id),
  listByUser: (userId: string) =>
    listDocuments('learningItems', {
      field: 'userId',
      value: userId,
      orderBy: 'nextReviewAt',
      direction: 'asc',
    }),
  listByTag: (tag: string) =>
    listDocuments('learningItems', {
      field: 'tags',
      op: 'array-contains',
      value: tag,
    }),
  update: (id: string, data: Partial<Omit<LearningItem, 'id' | 'createdAt'>>) =>
    updateDocument('learningItems', id, data),
  remove: (id: string) => deleteDocument('learningItems', id),
};
