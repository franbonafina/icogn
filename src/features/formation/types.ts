import type { StructureTag } from '@/types/firestore';

export type DailyLessonAuthorReferenceType = 'author' | 'school' | 'book';

export type DailyLessonExerciseType =
  | 'reflection'
  | 'analysis'
  | 'decision_memo'
  | 'executive_translation'
  | 'business_application';

export interface DailyLessonAuthorReference {
  type: DailyLessonAuthorReferenceType;
  name: string;
  workTitle?: string;
  summary: string;
}

export interface DailyLessonReading {
  title: string;
  sourceLabel: string;
  excerpt: string;
  estimatedMinutes: number;
  guidingQuestion: string;
}

export interface DailyLessonExercise {
  type: DailyLessonExerciseType;
  title: string;
  prompt: string;
  expectedOutput: string;
  evaluationFocus: string[];
}

export interface DailyLessonAiFeedbackRequest {
  systemPrompt: string;
  userPromptTemplate: string;
  rubric: string[];
  requestedOutputs: string[];
}

export interface DailyLessonXpReward {
  completion: number;
  qualityMax: number;
  streakBonus: number;
  totalMax: number;
}

export interface DailyLessonNextStep {
  summary: string;
  nextLessonSlug: string | null;
}

export interface DailyLesson {
  id: string;
  slug: string;
  moduleId: string;
  monthIndex: number;
  dayIndex: number;
  title: string;
  openingFrame: string;
  authorReference: DailyLessonAuthorReference;
  coreIdea: string;
  practicalTranslation: string;
  reading: DailyLessonReading;
  practice: DailyLessonExercise;
  reflectionPrompt: string;
  aiFeedbackRequest: DailyLessonAiFeedbackRequest;
  xpReward: DailyLessonXpReward;
  nextStep: DailyLessonNextStep;
  primaryStructure: StructureTag;
  secondaryStructures: StructureTag[];
  relatedConcepts: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

