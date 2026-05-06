import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { DecisionMemo } from '@/types/firestore';

export const formationDecisionMemosRepository = {
  create: (data: Omit<DecisionMemo, 'id'> & { id?: string }) =>
    createDocument('formationDecisionMemos', data),
  getById: (id: string) => getDocumentById('formationDecisionMemos', id),
  listByUser: (userId: string) =>
    listDocuments('formationDecisionMemos', {
      field: 'userId',
      value: userId,
      orderBy: 'updatedAt',
    }),
  listByModule: (moduleId: string) =>
    listDocuments('formationDecisionMemos', {
      field: 'moduleId',
      value: moduleId,
      orderBy: 'updatedAt',
    }),
  update: (id: string, data: Partial<Omit<DecisionMemo, 'id' | 'createdAt'>>) =>
    updateDocument('formationDecisionMemos', id, data),
  remove: (id: string) => deleteDocument('formationDecisionMemos', id),
};

