export type AppRoute =
  | '/'
  | '/login'
  | '/app'
  | '/app/formation'
  | '/app/formation/daily'
  | '/app/formation/library'
  | '/app/formation/memos'
  | '/app/formation/progression'
  | '/app/learn'
  | '/app/learn/new'
  | '/app/settings/ai'
  | '/app/speech'
  | '/app/decision'
  | '/app/profile';

export type {
  AccessCode,
  AiFeedbackSummary,
  AiEvaluation,
  AiEvaluationStyle,
  AiSettings,
  Author,
  Badge,
  Book,
  ConceptCard,
  CollectionMap,
  CollectionName,
  DecisionAttempt,
  DecisionAttemptScores,
  DecisionScenario,
  DailyTask,
  DecisionMemo,
  ExecutiveFormationUserProgress,
  ExecutiveTranslationExercise,
  FormationArtifactType,
  FormationLesson,
  FormationModule,
  FormationPortfolioSourceType,
  FormationSchool,
  FormationStatus,
  FormationTaskType,
  FirestoreDateValue,
  MonthlyMilestone,
  PortfolioArtifact,
  PracticeExercise,
  LearningItem,
  LearningItemType,
  LearningMode,
  LearningSession,
  ProfileMemory,
  ReadingAssignment,
  StructureAnalysis,
  StructureTag,
  SpeechSession,
  SpeechSessionScores,
  UnlockCondition,
  User,
  UserRole,
  WeeklyReview,
  XPEvent,
} from '@/types/firestore';
