import {
  executiveFormationUserProgressRepository,
  formationDecisionMemosRepository,
  formationAuthorsRepository,
  formationDailyTasksRepository,
  formationLessonsRepository,
  formationModulesRepository,
  formationMonthlyMilestonesRepository,
  formationPortfolioArtifactsRepository,
  formationWeeklyReviewsRepository,
  formationXPEventsRepository,
} from '@/lib/firebase/repositories';
import { getCurrentAppUser } from '@/lib/firebase/currentUser';
import { month1ClassicalPoliticalEconomyLessons } from '@/features/formation/month1ClassicalPoliticalEconomy';
import { authorSeedProfiles, matchesAuthorFilters, type AuthorLibraryFilterState } from '@/features/formation/authorLibrary';
import { formationLevelThresholds, formationXpRules, getFormationLevelForXp, isQualifiedStreakDay } from '@/features/formation/gamification';
import { progressionMapBlueprints, type ProgressionMapMonthCardData } from '@/features/formation/progressionMap';
import type {
  Author,
  AiFeedbackSummary,
  Badge,
  DailyTask,
  ExecutiveFormationUserProgress,
  FormationLesson,
  FormationModule,
  MonthlyMilestone,
  PortfolioArtifact,
  ReadingAssignment,
  WeeklyReview,
  XPEvent,
} from '@/types/firestore';

const FORMATION_TRACK_SLUG = 'executive-formation-path';
const MONTH_1_MODULE_ID = 'formation-module-month-1';

export type FormationOverview = {
  progress: ExecutiveFormationUserProgress;
  currentModule: FormationModule;
  currentTask: DailyTask | null;
  recentXpEvents: XPEvent[];
  milestone: MonthlyMilestone | null;
};

export type FormationProgressionMapData = {
  months: ProgressionMapMonthCardData[];
  totalXp: number;
  currentLevel: number;
  streakDays: number;
};

function createMonthOneModule(): Omit<FormationModule, 'id'> & { id: string } {
  return {
    id: MONTH_1_MODULE_ID,
    title: 'Month 1: Classical Political Economy',
    slug: 'month-1-classical-political-economy',
    description:
      'Build the first structural lens through Smith, Ricardo, Marx, and the logic of value, productivity, distribution, and conflict.',
    status: 'active',
    monthIndex: 1,
    quarterIndex: 1,
    moduleId: MONTH_1_MODULE_ID,
    theme: 'Classical Political Economy',
    objective:
      'Train the user to read productive structures, distribution, value, and conflict in markets and organizations.',
    primaryStructures: ['economic_structure', 'organizational_structure'],
    secondaryStructures: ['political_structure', 'operational_structure', 'symbolic_structure'],
    relatedAuthors: ['Adam Smith', 'David Ricardo', 'Karl Marx'],
    relatedConcepts: ['division of labor', 'productivity', 'value', 'distribution', 'rent'],
    lessonIds: month1ClassicalPoliticalEconomyLessons.map((lesson) => lesson.id),
    milestoneId: 'formation-milestone-month-1',
    difficulty: 2,
    unlockCondition: null,
    score: null,
    xpAwarded: 0,
    aiFeedback: null,
    userReflection: '',
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  };
}

function createReadingAssignment(
  lesson: (typeof month1ClassicalPoliticalEconomyLessons)[number],
): ReadingAssignment {
  return {
    title: lesson.reading.title,
    sourceType:
      lesson.authorReference.type === 'book'
        ? 'book'
        : lesson.authorReference.type === 'author'
          ? 'author_note'
          : 'excerpt',
    sourceId: lesson.authorReference.workTitle ?? lesson.authorReference.name,
    excerpt: lesson.reading.excerpt,
    guidingQuestion: lesson.reading.guidingQuestion,
    estimatedMinutes: lesson.reading.estimatedMinutes,
  };
}

function toFormationLessonRecord(lesson: (typeof month1ClassicalPoliticalEconomyLessons)[number]): Omit<FormationLesson, 'id'> & { id: string } {
  return {
    id: lesson.id,
    title: lesson.title,
    status: 'active',
    moduleId: lesson.moduleId,
    weekNumber: Math.ceil(lesson.dayIndex / 5),
    dayNumber: lesson.dayIndex,
    sequenceIndex: lesson.dayIndex,
    objective: lesson.coreIdea,
    summary: lesson.openingFrame,
    readingAssignments: [createReadingAssignment(lesson)],
    primaryStructure: lesson.primaryStructure,
    secondaryStructures: lesson.secondaryStructures,
    relatedAuthors: [lesson.authorReference.name],
    relatedConcepts: lesson.relatedConcepts,
    taskIds: [`task-${lesson.id}`],
    difficulty: lesson.difficulty,
    estimatedMinutes: lesson.reading.estimatedMinutes + 20,
    score: null,
    xpAwarded: 0,
    aiFeedback: null,
    userReflection: '',
    unlockCondition: null,
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  };
}

function toDailyTaskRecord(userId: string, lesson: (typeof month1ClassicalPoliticalEconomyLessons)[number]): Omit<DailyTask, 'id'> & { id: string } {
  return {
    id: `task-${userId}-${lesson.id}`,
    userId,
    title: lesson.title,
    status: lesson.dayIndex === 1 ? 'active' : 'locked',
    moduleId: lesson.moduleId,
    lessonId: lesson.id,
    taskType: 'reflection',
    objective: lesson.practice.prompt,
    readingAssignments: [createReadingAssignment(lesson)],
    instructions: [
      lesson.openingFrame,
      lesson.coreIdea,
      lesson.practicalTranslation,
    ],
    practicePrompt: lesson.practice.prompt,
    userResponse: '',
    userReflection: '',
    relatedAuthors: [lesson.authorReference.name],
    relatedConcepts: lesson.relatedConcepts,
    primaryStructure: lesson.primaryStructure,
    secondaryStructures: lesson.secondaryStructures,
    practiceExerciseId: null,
    decisionMemoId: null,
    structureAnalysisId: null,
    executiveTranslationExerciseId: null,
    score: null,
    xpAwarded: 0,
    aiFeedback: null,
    difficulty: lesson.difficulty,
    unlockCondition: null,
    dueAt: null,
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  };
}

function mapSchoolToFormationSchool(profile: (typeof authorSeedProfiles)[number]['schoolOrTradition']): Author['schoolsOfThought'] {
  const school = profile.toLowerCase();

  if (school.includes('classical political economy')) {
    return ['classical_economics'];
  }

  if (school.includes('austrian')) {
    return ['austrian_school'];
  }

  if (school.includes('marx')) {
    return ['marxism'];
  }

  if (school.includes('keynes')) {
    return ['keynesianism'];
  }

  if (school.includes('peron')) {
    return ['peronism'];
  }

  if (school.includes('critical rationalism')) {
    return ['critical_rationalism'];
  }

  if (school.includes('science')) {
    return ['philosophy_of_science'];
  }

  if (school.includes('military') || school.includes('strategy')) {
    return ['military_strategy'];
  }

  if (school.includes('management') || school.includes('communication')) {
    return ['management_strategy'];
  }

  if (school.includes('genealogy') || school.includes('power')) {
    return ['genealogy_and_power'];
  }

  if (school.includes('sociology')) {
    return ['sociology'];
  }

  return ['management_strategy'];
}

function toAuthorRecord(profile: (typeof authorSeedProfiles)[number]): Omit<Author, 'id'> & { id: string } {
  const shortBio = profile.historicalContext;
  const longBio = [
    profile.historicalContext,
    profile.practicalRelevance,
    profile.keyWarningsOrLimitations.join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: profile.id,
    name: profile.name,
    slug: profile.slug,
    status: 'active',
    schoolOrTradition: profile.schoolOrTradition,
    disciplines: profile.disciplines,
    practicalUses: profile.practicalUses,
    historicalContext: profile.historicalContext,
    mainWorks: profile.mainWorks,
    coreConcepts: profile.coreConcepts,
    practicalRelevance: profile.practicalRelevance,
    keyWarningsOrLimitations: profile.keyWarningsOrLimitations,
    relatedExercises: profile.relatedExercises,
    recommendedOrderOfStudy: profile.recommendedOrderOfStudy,
    structureTags: profile.structureTags,
    librarySummary: profile.librarySummary,
    shortBio,
    longBio,
    schoolsOfThought: mapSchoolToFormationSchool(profile.schoolOrTradition),
    eraLabel: profile.historicalContext,
    nationality: null,
    keyThemes: profile.coreConcepts,
    primaryStructures: profile.structureTags.slice(0, 2),
    secondaryStructures: profile.structureTags.slice(2),
    relatedAuthors: profile.relatedAuthors,
    relatedConcepts: profile.coreConcepts,
    keyBookIds: profile.mainWorks.map((work) => `${profile.slug}:${work.title}`),
    signatureIdeas: profile.coreConcepts,
    score: null,
    xpAwarded: 0,
    aiFeedback: null,
    userReflection: '',
    difficulty: 2,
    unlockCondition: null,
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  };
}

function createDefaultProgress(userId: string): Omit<ExecutiveFormationUserProgress, 'id'> & { id: string } {
  return {
    id: userId,
    userId,
    status: 'active',
    currentTrackSlug: FORMATION_TRACK_SLUG,
    moduleId: MONTH_1_MODULE_ID,
    currentLessonId: month1ClassicalPoliticalEconomyLessons[0]?.id ?? null,
    currentDailyTaskId: month1ClassicalPoliticalEconomyLessons[0]
      ? `task-${userId}-${month1ClassicalPoliticalEconomyLessons[0].id}`
      : null,
    currentWeekNumber: 1,
    currentMonthNumber: 1,
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveAt: null,
    completedLessonIds: [],
    completedTaskIds: [],
    completedAuthorIds: [],
    completedBookIds: [],
    completedConceptIds: [],
    unlockedModuleIds: [MONTH_1_MODULE_ID],
    earnedBadgeIds: [],
    completedArtifactIds: [],
    weeklyCompletionRate: 0,
    monthlyMilestoneCompletionRate: 0,
    strongestStructures: [],
    weakestStructures: [],
    recommendedNextTaskId: month1ClassicalPoliticalEconomyLessons[0]
      ? `task-${userId}-${month1ClassicalPoliticalEconomyLessons[0].id}`
      : null,
    recommendedNextAction: 'Complete today’s formation task.',
    score: null,
    xpAwarded: 0,
    aiFeedback: null,
    userReflection: '',
    relatedAuthors: [],
    relatedConcepts: [],
    difficulty: 2,
    unlockCondition: null,
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  };
}

function createMonthOneMilestone(userId: string): Omit<MonthlyMilestone, 'id'> & { id: string } {
  return {
    id: `formation-milestone-${userId}-month-1`,
    userId,
    title: 'Month 1 Strategic Memo',
    status: 'locked',
    moduleId: MONTH_1_MODULE_ID,
    monthNumber: 1,
    brief:
      'Write a strategic memo explaining how value, distribution, and structural conflict shape one company or market you understand well.',
    deliverables: [
      'One decision memo',
      'One structure interpretation',
      'One 30/60/90-day review frame',
    ],
    evaluationRubric: [
      'Conceptual accuracy',
      'Structural reasoning',
      'Executive clarity',
      'Commercial usefulness',
    ],
    artifactIds: [],
    submissionNotes: '',
    userReflection: '',
    relatedAuthors: ['Adam Smith', 'David Ricardo', 'Karl Marx'],
    relatedConcepts: ['value', 'distribution', 'rent', 'conflict'],
    primaryStructures: ['economic_structure', 'political_structure'],
    score: null,
    xpAwarded: 0,
    aiFeedback: null,
    difficulty: 4,
    unlockCondition: null,
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  };
}

async function ensureModuleSeed() {
  const modules = await formationModulesRepository.list();
  if (modules.length === 0) {
    await formationModulesRepository.create(createMonthOneModule());
  }
}

async function ensureLessonSeed() {
  const lessons = await formationLessonsRepository.list();
  if (lessons.length === 0) {
    for (const lesson of month1ClassicalPoliticalEconomyLessons) {
      await formationLessonsRepository.create(toFormationLessonRecord(lesson));
    }
  }
}

async function ensureAuthorSeed() {
  const authors = await formationAuthorsRepository.list();
  if (authors.length >= authorSeedProfiles.length) {
    return;
  }

  const existingIds = new Set(authors.map((author) => author.id));
  for (const author of authorSeedProfiles) {
    if (!existingIds.has(author.id)) {
      await formationAuthorsRepository.create(toAuthorRecord(author));
    }
  }
}

async function ensureUserProgress(userId: string) {
  const existing = await executiveFormationUserProgressRepository.getByUserId(userId);
  if (existing) {
    return existing;
  }

  return executiveFormationUserProgressRepository.create(createDefaultProgress(userId));
}

async function ensureUserTasks(userId: string) {
  const existing = await formationDailyTasksRepository.listByUser(userId);
  if (existing.length > 0) {
    return existing;
  }

  for (const lesson of month1ClassicalPoliticalEconomyLessons) {
    await formationDailyTasksRepository.create(toDailyTaskRecord(userId, lesson));
  }

  return formationDailyTasksRepository.listByUser(userId);
}

async function ensureUserMilestone(userId: string) {
  const existing = await formationMonthlyMilestonesRepository.listByUser(userId);
  if (existing.length > 0) {
    return existing[0];
  }

  return formationMonthlyMilestonesRepository.create(createMonthOneMilestone(userId));
}

export async function bootstrapFormationData() {
  const { userId } = await getCurrentAppUser();
  await ensureModuleSeed();
  await ensureLessonSeed();
  await ensureAuthorSeed();
  const progress = await ensureUserProgress(userId);
  await ensureUserTasks(userId);
  await ensureUserMilestone(userId);
  return progress;
}

export async function loadFormationOverview(): Promise<FormationOverview> {
  const { userId } = await getCurrentAppUser();
  await bootstrapFormationData();

  const [progress, modules, tasks, xpEvents, milestones] = await Promise.all([
    executiveFormationUserProgressRepository.getByUserId(userId),
    formationModulesRepository.list(),
    formationDailyTasksRepository.listByUser(userId),
    formationXPEventsRepository.listByUser(userId),
    formationMonthlyMilestonesRepository.listByUser(userId),
  ]);

  if (!progress) {
    throw new Error('Formation progress could not be initialized.');
  }

  const currentTask =
    tasks.find((task) => task.id === progress.currentDailyTaskId) ??
    tasks.find((task) => task.status === 'active') ??
    null;

  const currentModule =
    modules.find((module) => module.id === progress.moduleId) ?? modules[0];

  if (!currentModule) {
    throw new Error('Formation module could not be loaded.');
  }

  return {
    progress,
    currentModule,
    currentTask,
    recentXpEvents: xpEvents,
    milestone: milestones[0] ?? null,
  };
}

export async function loadFormationDailyTask() {
  const overview = await loadFormationOverview();
  return overview.currentTask;
}

export async function loadFormationAuthors(filters: AuthorLibraryFilterState) {
  await bootstrapFormationData();
  const authors = await formationAuthorsRepository.list();
  return authors.filter((author) => matchesAuthorFilters(author, filters));
}

export async function loadFormationAuthorBySlug(slug: string) {
  await bootstrapFormationData();
  const authors = await formationAuthorsRepository.list();
  return authors.find((author) => author.slug === slug) ?? null;
}

export async function loadFormationMemoList() {
  const { userId } = await getCurrentAppUser();
  return formationPortfolioArtifactsRepository.listByUser(userId);
}

export async function loadFormationDecisionMemos() {
  const { userId } = await getCurrentAppUser();
  return formationDecisionMemosRepository.listByUser(userId);
}

export function getFormationLessonById(lessonId: string) {
  return month1ClassicalPoliticalEconomyLessons.find((lesson) => lesson.id === lessonId) ?? null;
}

function getMonthStatus(
  monthIndex: number,
  progress: ExecutiveFormationUserProgress,
): ProgressionMapMonthCardData['status'] {
  if (monthIndex < progress.currentMonthNumber) {
    return 'completed';
  }

  if (monthIndex === progress.currentMonthNumber) {
    return 'active';
  }

  return 'locked';
}

function getArtifactStatus(
  moduleId: string,
  artifacts: PortfolioArtifact[],
  memos: Awaited<ReturnType<typeof loadFormationDecisionMemos>>,
): ProgressionMapMonthCardData['portfolioArtifactStatus'] {
  const moduleArtifacts = artifacts.filter((artifact) => artifact.moduleId === moduleId);

  if (moduleArtifacts.length > 0) {
    return 'completed';
  }

  const draftExists = memos.some((memo) => memo.moduleId === moduleId);
  return draftExists ? 'in_progress' : 'not_started';
}

export async function loadFormationProgressionMap(): Promise<FormationProgressionMapData> {
  const { userId } = await getCurrentAppUser();
  await bootstrapFormationData();

  const [progress, modules, tasks, milestones, xpEvents, artifacts, memos] = await Promise.all([
    executiveFormationUserProgressRepository.getByUserId(userId),
    formationModulesRepository.list(),
    formationDailyTasksRepository.listByUser(userId),
    formationMonthlyMilestonesRepository.listByUser(userId),
    formationXPEventsRepository.listByUser(userId),
    formationPortfolioArtifactsRepository.listByUser(userId),
    formationDecisionMemosRepository.listByUser(userId),
  ]);

  if (!progress) {
    throw new Error('Formation progress could not be loaded.');
  }

  const moduleMap = new Map(modules.map((module) => [module.monthIndex, module]));
  const milestoneMap = new Map(milestones.map((milestone) => [milestone.monthNumber, milestone]));

  const months = progressionMapBlueprints.map((blueprint) => {
    const module = moduleMap.get(blueprint.monthIndex);
    const monthModuleId = module?.id ?? `formation-module-month-${blueprint.monthIndex}`;
    const monthTasks = tasks.filter((task) => task.moduleId === monthModuleId);
    const completedTasks = monthTasks.filter((task) => task.status === 'completed');
    const monthXp = xpEvents
      .filter((event) => event.moduleId === monthModuleId)
      .reduce((sum, event) => sum + event.xpAwarded, 0);
    const monthMilestone = milestoneMap.get(blueprint.monthIndex);

    return {
      monthIndex: blueprint.monthIndex,
      quarterLabel: blueprint.quarterLabel,
      title: module?.title ?? `Month ${blueprint.monthIndex}: ${blueprint.title}`,
      coreQuestion: blueprint.coreQuestion,
      status: getMonthStatus(blueprint.monthIndex, progress),
      progressPercentage:
        blueprint.monthIndex < progress.currentMonthNumber
          ? 100
          : blueprint.monthIndex === progress.currentMonthNumber
            ? monthTasks.length > 0
              ? Math.round((completedTasks.length / monthTasks.length) * 100)
              : progress.monthlyMilestoneCompletionRate
            : 0,
      authorsCovered: blueprint.authors.filter((author) =>
        progress.completedAuthorIds.includes(author),
      ),
      conceptsMastered: blueprint.concepts.filter((concept) =>
        progress.completedConceptIds.includes(concept),
      ),
      exercisesCompleted: completedTasks.length,
      portfolioArtifactStatus: getArtifactStatus(monthModuleId, artifacts, memos),
      xpEarned: monthXp,
      badgesUnlocked: progress.earnedBadgeIds.filter((badgeId) =>
        badgeId.includes(`month-${blueprint.monthIndex}`),
      ),
      targetArtifact:
        monthMilestone?.title || blueprint.targetArtifact,
    } satisfies ProgressionMapMonthCardData;
  });

  return {
    months,
    totalXp: progress.xp,
    currentLevel: progress.level,
    streakDays: progress.streakDays,
  };
}

function getXpRule(category: XPEvent['sourceType']) {
  const map: Record<XPEvent['sourceType'], keyof typeof formationXpRules | null> = {
    dailyTask: null,
    lesson: null,
    practiceExercise: 'practice_exercise_completed' as never,
    decisionMemo: 'decision_memo_completed' as never,
    structureAnalysis: 'structure_analysis_completed' as never,
    executiveTranslationExercise: 'public_post_drafted' as never,
    weeklyReview: 'weekly_review_completed' as never,
    monthlyMilestone: 'monthly_artifact_completed' as never,
    badge: null,
  };
  return map[category];
}

function calculateTaskXp(score: number, streakDays: number) {
  const rule = formationXpRules.find((item) => item.category === 'practice_exercise_completed');
  if (!rule) {
    return 0;
  }
  const qualityBonus = Math.min(rule.qualityBonusMax, Math.max(0, Math.round(score * 3)));
  const streakBonus = streakDays > 0 ? Math.min(rule.streakBonusMax, Math.floor(streakDays / 3) + 1) : 0;
  return rule.baseXp + qualityBonus + streakBonus;
}

export async function completeFormationDailyTask(input: {
  taskId: string;
  userResponse: string;
  userReflection: string;
  score: number;
  aiFeedback: DailyTask['aiFeedback'];
}) {
  const { userId } = await getCurrentAppUser();
  const [progress, tasks] = await Promise.all([
    executiveFormationUserProgressRepository.getByUserId(userId),
    formationDailyTasksRepository.listByUser(userId),
  ]);

  if (!progress) {
    throw new Error('Formation progress not found.');
  }

  const currentTask = tasks.find((task) => task.id === input.taskId);
  if (!currentTask) {
    throw new Error('Formation task not found.');
  }

  const xpAwarded = calculateTaskXp(input.score, progress.streakDays);

  await formationDailyTasksRepository.update(currentTask.id, {
    status: 'completed',
    userResponse: input.userResponse,
    userReflection: input.userReflection,
    score: input.score,
    xpAwarded,
    aiFeedback: input.aiFeedback,
    completedAt: null as never,
  });

  const orderedTasks = [...tasks].sort((left, right) => left.lessonId.localeCompare(right.lessonId));
  const currentIndex = orderedTasks.findIndex((task) => task.id === currentTask.id);
  const nextTask = orderedTasks[currentIndex + 1] ?? null;

  if (nextTask && nextTask.status === 'locked') {
    await formationDailyTasksRepository.update(nextTask.id, {
      status: 'active',
    });
  }

  const newXp = progress.xp + xpAwarded;
  const level = getFormationLevelForXp(newXp).level;
  const nextCompletedTaskIds = Array.from(new Set([...progress.completedTaskIds, currentTask.id]));
  const nextCompletedLessonIds = Array.from(new Set([...progress.completedLessonIds, currentTask.lessonId]));
  const currentDate = new Date().toISOString().slice(0, 10);
  const streakQualified = isQualifiedStreakDay(['practice_exercise_completed', 'reflection_submitted']);
  const nextStreak = streakQualified ? progress.streakDays + 1 : progress.streakDays;
  const weeklyCompletionRate = Math.round((nextCompletedTaskIds.length / orderedTasks.length) * 100);

  await executiveFormationUserProgressRepository.update(userId, {
    xp: newXp,
    level,
    streakDays: nextStreak,
    lastActiveAt: null as never,
    currentDailyTaskId: nextTask?.id ?? null,
    currentLessonId: nextTask?.lessonId ?? null,
    recommendedNextTaskId: nextTask?.id ?? null,
    recommendedNextAction: nextTask ? `Continue with ${nextTask.title}.` : 'Week complete. Prepare the review.',
    completedTaskIds: nextCompletedTaskIds,
    completedLessonIds: nextCompletedLessonIds,
    completedConceptIds: Array.from(new Set([...progress.completedConceptIds, ...currentTask.relatedConcepts])),
    completedAuthorIds: Array.from(new Set([...progress.completedAuthorIds, ...currentTask.relatedAuthors])),
    weeklyCompletionRate,
    xpAwarded: xpAwarded,
    score: input.score,
    aiFeedback: input.aiFeedback,
    userReflection: input.userReflection,
    relatedAuthors: currentTask.relatedAuthors,
    relatedConcepts: currentTask.relatedConcepts,
  });

  await formationXPEventsRepository.create({
    userId,
    status: 'completed',
    moduleId: currentTask.moduleId,
    sourceType: 'dailyTask',
    sourceId: currentTask.id,
    xpAwarded,
    levelAfterAward: level,
    streakAfterAward: nextStreak,
    score: input.score,
    aiFeedback: input.aiFeedback,
    userReflection: input.userReflection,
    relatedAuthors: currentTask.relatedAuthors,
    relatedConcepts: currentTask.relatedConcepts,
    difficulty: currentTask.difficulty,
    unlockCondition: null,
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  });

  if (weeklyCompletionRate >= 70) {
    const existingReviews = await formationWeeklyReviewsRepository.listByUser(userId);
    if (existingReviews.length === 0) {
      await formationWeeklyReviewsRepository.create({
        userId,
        title: 'Week 1 review',
        status: 'active',
        moduleId: currentTask.moduleId,
        weekNumber: 1,
        completedTaskIds: nextCompletedTaskIds,
        completedArtifactIds: [],
        strongestInsights: [],
        weakestPatterns: [],
        executiveSummary: '',
        nextWeekFocus: '',
        userReflection: '',
        relatedAuthors: progress.completedAuthorIds,
        relatedConcepts: progress.completedConceptIds,
        primaryStructures: ['economic_structure', 'organizational_structure'],
        score: null,
        xpAwarded: 0,
        aiFeedback: null,
        difficulty: 3,
        unlockCondition: null,
        completedAt: null,
        createdAt: null as never,
        updatedAt: null as never,
      });
    }
  }

  const updatedProgress = await executiveFormationUserProgressRepository.getByUserId(userId);
  if (!updatedProgress) {
    throw new Error('Formation progress could not be refreshed.');
  }

  return updatedProgress;
}
