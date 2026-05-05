export type AppRoute =
  | '/'
  | '/login'
  | '/app'
  | '/app/learn'
  | '/app/speech'
  | '/app/decision'
  | '/app/profile';

export type {
  AccessCode,
  AiEvaluation,
  CollectionMap,
  CollectionName,
  DecisionAttempt,
  DecisionAttemptScores,
  DecisionScenario,
  FirestoreDateValue,
  LearningItem,
  LearningItemType,
  LearningMode,
  LearningSession,
  ProfileMemory,
  SpeechSession,
  SpeechSessionScores,
  User,
  UserRole,
} from '@/types/firestore';
