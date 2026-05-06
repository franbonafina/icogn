import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from '@/lib/firebase/repositories/helpers';
import type {
  Author,
  Badge,
  DailyTask,
  ExecutiveFormationUserProgress,
  FormationLesson,
  FormationModule,
  MonthlyMilestone,
  WeeklyReview,
  XPEvent,
} from '@/types/firestore';

export const executiveFormationUserProgressRepository = {
  create: (data: Omit<ExecutiveFormationUserProgress, 'id'> & { id?: string }) =>
    createDocument('executiveFormationUserProgress', data),
  getById: (id: string) => getDocumentById('executiveFormationUserProgress', id),
  getByUserId: (userId: string) => getDocumentById('executiveFormationUserProgress', userId),
  upsert: async (userId: string, data: Omit<ExecutiveFormationUserProgress, 'id'>) => {
    const existing = await getDocumentById('executiveFormationUserProgress', userId);

    if (existing) {
      await updateDocument('executiveFormationUserProgress', userId, data);
      return getDocumentById('executiveFormationUserProgress', userId);
    }

    return createDocument('executiveFormationUserProgress', {
      ...data,
      id: userId,
    });
  },
  update: (id: string, data: Partial<Omit<ExecutiveFormationUserProgress, 'id' | 'createdAt'>>) =>
    updateDocument('executiveFormationUserProgress', id, data),
};

export const formationModulesRepository = {
  create: (data: Omit<FormationModule, 'id'> & { id?: string }) =>
    createDocument('formationModules', data),
  getById: (id: string) => getDocumentById('formationModules', id),
  list: () => listDocuments('formationModules', { orderBy: 'monthIndex', direction: 'asc' }),
  update: (id: string, data: Partial<Omit<FormationModule, 'id' | 'createdAt'>>) =>
    updateDocument('formationModules', id, data),
};

export const formationLessonsRepository = {
  create: (data: Omit<FormationLesson, 'id'> & { id?: string }) =>
    createDocument('formationLessons', data),
  getById: (id: string) => getDocumentById('formationLessons', id),
  listByModule: (moduleId: string) =>
    listDocuments('formationLessons', {
      field: 'moduleId',
      value: moduleId,
      orderBy: 'dayNumber',
      direction: 'asc',
    }),
  list: () => listDocuments('formationLessons', { orderBy: 'dayNumber', direction: 'asc' }),
  update: (id: string, data: Partial<Omit<FormationLesson, 'id' | 'createdAt'>>) =>
    updateDocument('formationLessons', id, data),
};

export const formationAuthorsRepository = {
  create: (data: Omit<Author, 'id'> & { id?: string }) =>
    createDocument('formationAuthors', data),
  getById: (id: string) => getDocumentById('formationAuthors', id),
  list: () => listDocuments('formationAuthors', { orderBy: 'name', direction: 'asc' }),
  update: (id: string, data: Partial<Omit<Author, 'id' | 'createdAt'>>) =>
    updateDocument('formationAuthors', id, data),
};

export const formationDailyTasksRepository = {
  create: (data: Omit<DailyTask, 'id'> & { id?: string }) =>
    createDocument('formationDailyTasks', data),
  getById: (id: string) => getDocumentById('formationDailyTasks', id),
  listByUser: (userId: string) =>
    listDocuments('formationDailyTasks', {
      field: 'userId',
      value: userId,
      orderBy: 'createdAt',
      direction: 'asc',
    }),
  listByLesson: (lessonId: string) =>
    listDocuments('formationDailyTasks', {
      field: 'lessonId',
      value: lessonId,
      orderBy: 'createdAt',
      direction: 'asc',
    }),
  update: (id: string, data: Partial<Omit<DailyTask, 'id' | 'createdAt'>>) =>
    updateDocument('formationDailyTasks', id, data),
  remove: (id: string) => deleteDocument('formationDailyTasks', id),
};

export const formationXPEventsRepository = {
  create: (data: Omit<XPEvent, 'id'> & { id?: string }) =>
    createDocument('formationXPEvents', data),
  getById: (id: string) => getDocumentById('formationXPEvents', id),
  listByUser: (userId: string) =>
    listDocuments('formationXPEvents', {
      field: 'userId',
      value: userId,
      orderBy: 'createdAt',
      direction: 'desc',
      limit: 50,
    }),
};

export const formationWeeklyReviewsRepository = {
  create: (data: Omit<WeeklyReview, 'id'> & { id?: string }) =>
    createDocument('formationWeeklyReviews', data),
  getById: (id: string) => getDocumentById('formationWeeklyReviews', id),
  listByUser: (userId: string) =>
    listDocuments('formationWeeklyReviews', {
      field: 'userId',
      value: userId,
      orderBy: 'createdAt',
      direction: 'desc',
    }),
  update: (id: string, data: Partial<Omit<WeeklyReview, 'id' | 'createdAt'>>) =>
    updateDocument('formationWeeklyReviews', id, data),
};

export const formationMonthlyMilestonesRepository = {
  create: (data: Omit<MonthlyMilestone, 'id'> & { id?: string }) =>
    createDocument('formationMonthlyMilestones', data),
  getById: (id: string) => getDocumentById('formationMonthlyMilestones', id),
  listByUser: (userId: string) =>
    listDocuments('formationMonthlyMilestones', {
      field: 'userId',
      value: userId,
      orderBy: 'createdAt',
      direction: 'desc',
    }),
  update: (id: string, data: Partial<Omit<MonthlyMilestone, 'id' | 'createdAt'>>) =>
    updateDocument('formationMonthlyMilestones', id, data),
};

export const formationBadgesRepository = {
  create: (data: Omit<Badge, 'id'> & { id?: string }) =>
    createDocument('formationBadges', data),
  getById: (id: string) => getDocumentById('formationBadges', id),
  list: () => listDocuments('formationBadges', { orderBy: 'title', direction: 'asc' }),
};

