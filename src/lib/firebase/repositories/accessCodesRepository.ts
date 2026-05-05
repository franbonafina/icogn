import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type { AccessCode } from '@/types/firestore';

export const accessCodesRepository = {
  create: (data: Omit<AccessCode, 'id'> & { id?: string }) =>
    createDocument('accessCodes', data),
  getById: (id: string) => getDocumentById('accessCodes', id),
  list: () => listDocuments('accessCodes', { orderBy: 'updatedAt' }),
  listActive: () =>
    listDocuments('accessCodes', {
      field: 'status',
      value: 'active',
      orderBy: 'updatedAt',
    }),
  update: (id: string, data: Partial<Omit<AccessCode, 'id' | 'createdAt'>>) =>
    updateDocument('accessCodes', id, data),
  remove: (id: string) => deleteDocument('accessCodes', id),
};
