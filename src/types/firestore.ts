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

export type StructureTag =
  | 'economic_structure'
  | 'legal_structure'
  | 'political_structure'
  | 'organizational_structure'
  | 'symbolic_structure'
  | 'operational_structure'
  | 'technological_structure';

export type FormationStatus =
  | 'draft'
  | 'locked'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'reviewed'
  | 'archived';

export type FormationTaskType =
  | 'theory_reading'
  | 'author_study'
  | 'reflection'
  | 'decision_memo'
  | 'structure_analysis'
  | 'executive_translation'
  | 'speech_drill'
  | 'business_case'
  | 'weekly_review'
  | 'monthly_milestone';

export type FormationArtifactType =
  | 'essay'
  | 'memo'
  | 'framework'
  | 'pitch'
  | 'commercial_offer'
  | 'strategic_map'
  | 'reading_note'
  | 'structure_analysis'
  | 'founder_thesis'
  | 'communication_brief';

export type FormationPortfolioSourceType =
  | 'dailyTask'
  | 'practiceExercise'
  | 'decisionMemo'
  | 'structureAnalysis'
  | 'executiveTranslationExercise'
  | 'weeklyReview'
  | 'monthlyMilestone';

export type FormationSchool =
  | 'classical_economics'
  | 'marxism'
  | 'austrian_school'
  | 'keynesianism'
  | 'peronism'
  | 'critical_rationalism'
  | 'philosophy_of_science'
  | 'military_strategy'
  | 'management_strategy'
  | 'executive_communication'
  | 'sociology'
  | 'genealogy_and_power';

export interface UnlockCondition {
  type:
    | 'xp'
    | 'level'
    | 'streak'
    | 'module_completion'
    | 'lesson_completion'
    | 'badge'
    | 'manual';
  value: string | number | boolean;
  label: string;
  relatedId?: string | null;
}

export interface AiFeedbackSummary {
  provider: 'groq' | 'openai' | 'anthropic' | 'system';
  model: string | null;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestedNextSteps: string[];
  rubricScores: Record<string, number>;
  generatedAt: FirestoreDateValue | null;
}

export interface ReadingAssignment {
  title: string;
  sourceType: 'book' | 'author_note' | 'essay' | 'internal_note' | 'excerpt';
  sourceId: string | null;
  excerpt: string;
  guidingQuestion: string;
  estimatedMinutes: number;
}

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
  constraints: string[];
  stakeholders: string[];
  availableOptions: string[];
  hiddenRisks: string[];
  evaluationRubric: string[];
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
  risksConsidered: string;
  expectedOutcome: string;
  scores: DecisionAttemptScores;
  feedback: string;
  alternativeDecision: string;
  risksMissed: string[];
}

export interface ProfileMemory extends BaseEntity {
  userId: string;
  strengths: string[];
  weaknesses: string[];
  preferredModes: LearningMode[];
  recurringErrors: string[];
  speechPatterns: string[];
  decisionPatterns: string[];
  conceptMastery: Record<string, number>;
  recommendations: string[];
  recentActivity: string[];
  aiSummary: string | null;
}

export type AiEvaluationTargetType =
  | 'learningSession'
  | 'speechSession'
  | 'decisionAttempt'
  | 'profileMemory'
  | 'formationDailyTask'
  | 'formationDecisionMemo'
  | 'formationWeeklyReview'
  | 'formationStructureAnalysis'
  | 'formationExecutiveCommunication';

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

export type AiEvaluationStyle = 'strict' | 'balanced' | 'encouraging';

export interface AiSettings extends BaseEntity {
  userId: string;
  provider: 'groq' | 'openai' | 'anthropic';
  modelName: string;
  temperature: number;
  maxTokens: number;
  strictJsonMode: boolean;
  evaluationStyle: AiEvaluationStyle;
}

// Executive Formation Path
// Intended top-level collections:
// - executiveFormationUserProgress
// - formationModules
// - formationLessons
// - formationAuthors
// - formationBooks
// - formationConceptCards
// - formationDailyTasks
// - formationPracticeExercises
// - formationDecisionMemos
// - formationStructureAnalyses
// - formationExecutiveTranslationExercises
// - formationBadges
// - formationXPEvents
// - formationWeeklyReviews
// - formationMonthlyMilestones
// - formationPortfolioArtifacts
//
// Recommended subcollections by user:
// - executiveFormationUserProgress/{userId}/xpEvents
// - executiveFormationUserProgress/{userId}/weeklyReviews
// - executiveFormationUserProgress/{userId}/monthlyMilestones
// - executiveFormationUserProgress/{userId}/portfolioArtifacts

export interface ExecutiveFormationUserProgress extends BaseEntity {
  userId: string;
  status: FormationStatus;
  currentTrackSlug: string;
  moduleId: string;
  currentLessonId: string | null;
  currentDailyTaskId: string | null;
  currentWeekNumber: number;
  currentMonthNumber: number;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveAt: FirestoreDateValue | null;
  completedLessonIds: string[];
  completedTaskIds: string[];
  completedAuthorIds: string[];
  completedBookIds: string[];
  completedConceptIds: string[];
  unlockedModuleIds: string[];
  earnedBadgeIds: string[];
  completedArtifactIds: string[];
  weeklyCompletionRate: number;
  monthlyMilestoneCompletionRate: number;
  strongestStructures: StructureTag[];
  weakestStructures: StructureTag[];
  recommendedNextTaskId: string | null;
  recommendedNextAction: string | null;
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface FormationModule extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  status: FormationStatus;
  monthIndex: number;
  quarterIndex: 1 | 2 | 3 | 4;
  moduleId: string;
  theme: string;
  objective: string;
  primaryStructures: StructureTag[];
  secondaryStructures: StructureTag[];
  relatedAuthors: string[];
  relatedConcepts: string[];
  lessonIds: string[];
  milestoneId: string | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  userReflection: string;
  completedAt: FirestoreDateValue | null;
}

export interface FormationLesson extends BaseEntity {
  title: string;
  status: FormationStatus;
  moduleId: string;
  weekNumber: number;
  dayNumber: number;
  sequenceIndex: number;
  objective: string;
  summary: string;
  readingAssignments: ReadingAssignment[];
  primaryStructure: StructureTag;
  secondaryStructures: StructureTag[];
  relatedAuthors: string[];
  relatedConcepts: string[];
  taskIds: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  userReflection: string;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface Author extends BaseEntity {
  name: string;
  slug: string;
  status: FormationStatus;
  schoolOrTradition: string;
  disciplines: string[];
  practicalUses: string[];
  historicalContext: string;
  mainWorks: Array<{
    title: string;
    year?: number;
    note: string;
  }>;
  coreConcepts: string[];
  practicalRelevance: string;
  keyWarningsOrLimitations: string[];
  relatedExercises: Array<{
    slug: string;
    title: string;
    outputType: string;
  }>;
  recommendedOrderOfStudy: number;
  structureTags: StructureTag[];
  librarySummary: string;
  shortBio: string;
  longBio: string;
  schoolsOfThought: FormationSchool[];
  eraLabel: string;
  nationality: string | null;
  keyThemes: string[];
  primaryStructures: StructureTag[];
  secondaryStructures: StructureTag[];
  relatedAuthors: string[];
  relatedConcepts: string[];
  keyBookIds: string[];
  signatureIdeas: string[];
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  userReflection: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface Book extends BaseEntity {
  title: string;
  slug: string;
  status: FormationStatus;
  authorId: string;
  publicationYear: number | null;
  description: string;
  schoolOfThought: FormationSchool | null;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructures: StructureTag[];
  secondaryStructures: StructureTag[];
  keyTakeaways: string[];
  excerpt: string;
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  userReflection: string;
  moduleId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface ConceptCard extends BaseEntity {
  title: string;
  status: FormationStatus;
  summary: string;
  explanation: string;
  authorIds: string[];
  bookIds: string[];
  relatedAuthors: string[];
  relatedConcepts: string[];
  moduleId: string;
  primaryStructures: StructureTag[];
  secondaryStructures: StructureTag[];
  exampleApplications: string[];
  userReflection: string;
  aiFeedback: AiFeedbackSummary | null;
  score: number | null;
  xpAwarded: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface DailyTask extends BaseEntity {
  userId: string;
  title: string;
  status: FormationStatus;
  moduleId: string;
  lessonId: string;
  taskType: FormationTaskType;
  objective: string;
  readingAssignments: ReadingAssignment[];
  instructions: string[];
  practicePrompt: string;
  userResponse: string;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructure: StructureTag;
  secondaryStructures: StructureTag[];
  practiceExerciseId: string | null;
  decisionMemoId: string | null;
  structureAnalysisId: string | null;
  executiveTranslationExerciseId: string | null;
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  dueAt: FirestoreDateValue | null;
  completedAt: FirestoreDateValue | null;
}

export interface PracticeExercise extends BaseEntity {
  userId: string;
  title: string;
  status: FormationStatus;
  moduleId: string;
  lessonId: string | null;
  taskId: string | null;
  exerciseType:
    | 'reflection'
    | 'application'
    | 'comparison'
    | 'positioning'
    | 'case_breakdown'
    | 'speech_drill';
  prompt: string;
  instructions: string[];
  userResponse: string;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructures: StructureTag[];
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface DecisionMemo extends BaseEntity {
  userId: string;
  title: string;
  status: FormationStatus;
  moduleId: string;
  taskId: string | null;
  decisionTitle: string;
  context: string;
  actorsInvolved: string[];
  interests: string[];
  dignityRecognitionAtStake: string;
  legalInstitutionalFrame: string;
  economicFrame: string;
  politicalFrame: string;
  operationalFrame: string;
  technologicalFrame: string;
  options: string[];
  decisionCriteria: string[];
  recommendedDecision: string;
  rejectedAlternatives: string[];
  risks: string[];
  evidenceThatCouldChangeDecision: string[];
  reviewMetrics30_60_90: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
  draftVersion: number;
  finalArtifactId: string | null;
  clarityScore: number | null;
  judgmentScore: number | null;
  structureScore: number | null;
  riskAwarenessScore: number | null;
  executiveLanguageScore: number | null;
  decision: string;
  reasoning: string;
  expectedOutcome: string;
  alternatives: string[];
  recommendation: string;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructures: StructureTag[];
  secondaryStructures: StructureTag[];
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface StructureAnalysis extends BaseEntity {
  userId: string;
  title: string;
  status: FormationStatus;
  moduleId: string;
  taskId: string | null;
  subjectType: 'company' | 'market' | 'conflict' | 'institution' | 'professional_situation';
  subjectLabel: string;
  context: string;
  economicLayer: string;
  legalLayer: string;
  politicalLayer: string;
  organizationalLayer: string;
  symbolicLayer: string;
  operationalLayer: string;
  technologicalLayer: string;
  synthesis: string;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructures: StructureTag[];
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface ExecutiveTranslationExercise extends BaseEntity {
  userId: string;
  title: string;
  status: FormationStatus;
  moduleId: string;
  taskId: string | null;
  sourceText: string;
  targetAudience:
    | 'executive_team'
    | 'client_leadership'
    | 'board'
    | 'investor'
    | 'commercial_team'
    | 'general_public';
  targetFormat:
    | 'brief'
    | 'email'
    | 'talk_track'
    | 'memo'
    | 'pitch'
    | 'commercial_offer';
  translatedOutput: string;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  moduleIdReference: string | null;
  primaryStructures: StructureTag[];
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface Badge extends BaseEntity {
  title: string;
  slug: string;
  status: FormationStatus;
  description: string;
  category:
    | 'consistency'
    | 'structure_mastery'
    | 'author_completion'
    | 'artifact_completion'
    | 'communication'
    | 'decision_quality';
  iconKey: string | null;
  moduleId: string;
  unlockCondition: UnlockCondition;
  relatedAuthors: string[];
  relatedConcepts: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  userReflection: string;
  completedAt: FirestoreDateValue | null;
}

export interface XPEvent extends BaseEntity {
  userId: string;
  status: FormationStatus;
  moduleId: string;
  sourceType:
    | 'dailyTask'
    | 'lesson'
    | 'practiceExercise'
    | 'decisionMemo'
    | 'structureAnalysis'
    | 'executiveTranslationExercise'
    | 'weeklyReview'
    | 'monthlyMilestone'
    | 'badge';
  sourceId: string;
  xpAwarded: number;
  levelAfterAward: number;
  streakAfterAward: number;
  score: number | null;
  aiFeedback: AiFeedbackSummary | null;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface WeeklyReview extends BaseEntity {
  userId: string;
  title: string;
  status: FormationStatus;
  moduleId: string;
  weekNumber: number;
  completedTaskIds: string[];
  completedArtifactIds: string[];
  strongestInsights: string[];
  weakestPatterns: string[];
  executiveSummary: string;
  nextWeekFocus: string;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructures: StructureTag[];
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface MonthlyMilestone extends BaseEntity {
  userId: string;
  title: string;
  status: FormationStatus;
  moduleId: string;
  monthNumber: number;
  brief: string;
  deliverables: string[];
  evaluationRubric: string[];
  artifactIds: string[];
  submissionNotes: string;
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructures: StructureTag[];
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  completedAt: FirestoreDateValue | null;
}

export interface PortfolioArtifact extends BaseEntity {
  userId: string;
  title: string;
  status: FormationStatus;
  moduleId: string;
  artifactType: FormationArtifactType;
  sourceType: FormationPortfolioSourceType;
  sourceId: string;
  summary: string;
  content: string;
  tags: string[];
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructures: StructureTag[];
  score: number | null;
  xpAwarded: number;
  aiFeedback: AiFeedbackSummary | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlockCondition: UnlockCondition | null;
  visibility: 'private' | 'shared_with_cohort' | 'export_ready';
  completedAt: FirestoreDateValue | null;
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
  aiSettings: AiSettings;
  executiveFormationUserProgress: ExecutiveFormationUserProgress;
  formationModules: FormationModule;
  formationLessons: FormationLesson;
  formationAuthors: Author;
  formationBooks: Book;
  formationConceptCards: ConceptCard;
  formationDailyTasks: DailyTask;
  formationPracticeExercises: PracticeExercise;
  formationDecisionMemos: DecisionMemo;
  formationStructureAnalyses: StructureAnalysis;
  formationExecutiveTranslationExercises: ExecutiveTranslationExercise;
  formationBadges: Badge;
  formationXPEvents: XPEvent;
  formationWeeklyReviews: WeeklyReview;
  formationMonthlyMilestones: MonthlyMilestone;
  formationPortfolioArtifacts: PortfolioArtifact;
}

export type CollectionName = keyof CollectionMap;
