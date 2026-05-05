import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { AiEvaluation } from '@/types/firestore';

export const aiEvaluationsRepository = {
  create: (data: Omit<AiEvaluation, 'id'> & { id?: string }) =>
    createDocument('aiEvaluations', data),
  getById: (id: string) => getDocumentById('aiEvaluations', id),
  listByUser: (userId: string) =>
    listDocuments('aiEvaluations', {
      field: 'userId',
      value: userId,
      orderBy: 'createdAt',
    }),
  listByTarget: (targetId: string) =>
    listDocuments('aiEvaluations', {
      field: 'targetId',
      value: targetId,
      orderBy: 'createdAt',
    }),
  update: (id: string, data: Partial<Omit<AiEvaluation, 'id' | 'createdAt'>>) =>
    updateDocument('aiEvaluations', id, data),
  remove: (id: string) => deleteDocument('aiEvaluations', id),
};
