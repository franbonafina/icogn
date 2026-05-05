import type { FieldValue, Timestamp } from 'firebase/firestore';

export type FirestoreDateValue = Timestamp | FieldValue;

export type LearningItemType =
  | 'term'
  | 'concept'
  | 'quote'
  | 'principle'
  | 'framework'
  | 'case';

export type LearningMode =
  | 'spaced_repetition'
  | 'active_recall'
  | 'interleaving'
  | 'deliberate_practice';

export type AccessCodeStatus = 'active' | 'disabled' | 'expired';

export type UserRole = 'member' | 'coach' | 'admin';

export interface BaseEntity {
  id: string;
  createdAt: FirestoreDateValue;
  updatedAt: FirestoreDateValue;
}

export interface User extends BaseEntity {
  email: string;
  displayName: string;
  role: UserRole;
  accessCodeId: string | null;
  cohortIds: string[];
  active: boolean;
  lastLoginAt: FirestoreDateValue | null;
}

export interface AccessCode extends BaseEntity {
  code: string;
  label: string;
  cohortId: string | null;
  maxUses: number | null;
  usesCount: number;
  status: AccessCodeStatus;
  expiresAt: FirestoreDateValue | null;
}

export interface LearningItem extends BaseEntity {
  userId: string;
  title: string;
  type: LearningItemType;
  content: string;
  explanation: string;
  sourceText: string;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  learningMode: LearningMode;
  nextReviewAt: FirestoreDateValue | null;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lastScore: number | null;
}

export interface LearningSession extends BaseEntity {
  userId: string;
  learningItemId: string;
  learningMode: LearningMode;
  prompt: string;
  response: string;
  score: number | null;
  durationSeconds: number;
  reviewedAt: FirestoreDateValue | null;
  completedAt: FirestoreDateValue | null;
}

export interface SpeechSessionScores {
  clarity: number;
  structure: number;
  argumentation: number;
  persuasion: number;
  confidence: number;
  concision: number;
}

export interface SpeechSession extends BaseEntity {
  userId: string;
  prompt: string;
  transcript: string;
  durationSeconds: number;
  scores: SpeechSessionScores;
  feedback: string;
  improvementTasks: string[];
}

export interface DecisionScenario extends BaseEntity {
  title: string;
  summary: string;
  context: string;
  prompt: string;
  stakes: string[];
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface DecisionAttemptScores {
  clarity: number;
  riskAwareness: number;
  tradeoffQuality: number;
  ethicalReasoning: number;
  strategicThinking: number;
  actionability: number;
}

export interface DecisionAttempt extends BaseEntity {
  userId: string;
  scenarioId: string;
  userDecision: string;
  reasoning: string;
  scores: DecisionAttemptScores;
  feedback: string;
}

export interface ProfileMemory extends BaseEntity {
  userId: string;
  summary: string;
  strengths: string[];
  growthAreas: string[];
  notablePatterns: string[];
  preferredLearningModes: LearningMode[];
  lastSynthesizedAt: FirestoreDateValue | null;
}

export type AiEvaluationTargetType =
  | 'learningSession'
  | 'speechSession'
  | 'decisionAttempt'
  | 'profileMemory';

export interface AiEvaluation extends BaseEntity {
  userId: string;
  targetType: AiEvaluationTargetType;
  targetId: string;
  provider: string;
  model: string;
  promptVersion: string;
  scoreSummary: Record<string, number>;
  feedback: string;
  recommendations: string[];
  rawResponse: string;
}

export interface CollectionMap {
  users: User;
  accessCodes: AccessCode;
  learningItems: LearningItem;
  learningSessions: LearningSession;
  speechSessions: SpeechSession;
  decisionScenarios: DecisionScenario;
  decisionAttempts: DecisionAttempt;
  profileMemory: ProfileMemory;
  aiEvaluations: AiEvaluation;
}

export type CollectionName = keyof CollectionMap;
