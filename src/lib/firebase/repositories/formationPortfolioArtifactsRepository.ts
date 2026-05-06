import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { PortfolioArtifact } from '@/types/firestore';

export const formationPortfolioArtifactsRepository = {
  create: (data: Omit<PortfolioArtifact, 'id'> & { id?: string }) =>
    createDocument('formationPortfolioArtifacts', data),
  getById: (id: string) => getDocumentById('formationPortfolioArtifacts', id),
  listByUser: (userId: string) =>
    listDocuments('formationPortfolioArtifacts', {
      field: 'userId',
      value: userId,
      orderBy: 'updatedAt',
    }),
  update: (id: string, data: Partial<Omit<PortfolioArtifact, 'id' | 'createdAt'>>) =>
    updateDocument('formationPortfolioArtifacts', id, data),
  remove: (id: string) => deleteDocument('formationPortfolioArtifacts', id),
};

