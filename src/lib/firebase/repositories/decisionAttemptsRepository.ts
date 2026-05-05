import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { DecisionAttempt } from '@/types/firestore';

export const decisionAttemptsRepository = {
  create: (data: Omit<DecisionAttempt, 'id'> & { id?: string }) =>
    createDocument('decisionAttempts', data),
  getById: (id: string) => getDocumentById('decisionAttempts', id),
  listByUser: (userId: string) =>
    listDocuments('decisionAttempts', {
      field: 'userId',
      value: userId,
      orderBy: 'createdAt',
    }),
  listByScenario: (scenarioId: string) =>
    listDocuments('decisionAttempts', {
      field: 'scenarioId',
      value: scenarioId,
      orderBy: 'createdAt',
    }),
  update: (id: string, data: Partial<Omit<DecisionAttempt, 'id' | 'createdAt'>>) =>
    updateDocument('decisionAttempts', id, data),
  remove: (id: string) => deleteDocument('decisionAttempts', id),
};
