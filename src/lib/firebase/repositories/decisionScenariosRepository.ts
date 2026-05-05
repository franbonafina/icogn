import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { DecisionScenario } from '@/types/firestore';

export const decisionScenariosRepository = {
  create: (data: Omit<DecisionScenario, 'id'> & { id?: string }) =>
    createDocument('decisionScenarios', data),
  getById: (id: string) => getDocumentById('decisionScenarios', id),
  list: () => listDocuments('decisionScenarios', { orderBy: 'updatedAt' }),
  listByTag: (tag: string) =>
    listDocuments('decisionScenarios', {
      field: 'tags',
      op: 'array-contains',
      value: tag,
    }),
  update: (id: string, data: Partial<Omit<DecisionScenario, 'id' | 'createdAt'>>) =>
    updateDocument('decisionScenarios', id, data),
  remove: (id: string) => deleteDocument('decisionScenarios', id),
};
