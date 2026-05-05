import type { ReviewableLearningItem } from '@/lib/learning/scheduler';

export type LearningTrack = {
  id: string;
  name: string;
  description: string;
};

export const learningTracks: LearningTrack[] = [
  {
    id: 'memory',
    name: 'Memory',
    description: 'Recall drills and spaced reinforcement prompts.',
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    description: 'Argument decomposition and structured analysis.',
  },
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Decision practice, reflection, and communication exercises.',
  },
];

export const mockLearningItems: ReviewableLearningItem[] = [
  {
    id: 'civic-principle-1',
    title: 'Subsidiarity',
    type: 'principle',
    content:
      'Subsidiarity means decisions should be handled by the smallest competent unit before escalating upward.',
    explanation:
      'It protects local judgment while preserving coordination when larger structures are needed.',
    sourceText: 'Leadership principle: push authority close to the problem.',
    tags: ['governance', 'decision-making'],
    difficulty: 3,
    learningMode: 'spaced_repetition',
    nextReviewAt: new Date(Date.now() - 60 * 60 * 1000),
    intervalDays: 2,
    easeFactor: 2.5,
    repetitions: 2,
    lastScore: 4,
  },
  {
    id: 'argument-framework-1',
    title: 'Claim, evidence, warrant',
    type: 'framework',
    content:
      'A strong argument states the claim, presents evidence, and makes the warrant explicit.',
    explanation:
      'The warrant explains why the evidence actually supports the claim.',
    sourceText: 'Argumentation pattern for disciplined reasoning.',
    tags: ['argumentation', 'communication'],
    difficulty: 2,
    learningMode: 'active_recall',
    nextReviewAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    intervalDays: 1,
    easeFactor: 2.3,
    repetitions: 1,
    lastScore: 3,
  },
  {
    id: 'cultural-quote-1',
    title: 'Moral clarity under pressure',
    type: 'quote',
    content:
      'Pressure does not remove responsibility; it reveals the quality of prior preparation.',
    explanation:
      'This quote is used to frame preparation as the basis of high-quality judgment.',
    sourceText: 'Internal leadership note on composure and standards.',
    tags: ['leadership', 'communication'],
    difficulty: 4,
    learningMode: 'interleaving',
    nextReviewAt: new Date(Date.now() - 30 * 60 * 1000),
    intervalDays: 4,
    easeFactor: 2.4,
    repetitions: 3,
    lastScore: 4,
  },
  {
    id: 'decision-case-1',
    title: 'Escalation memo drill',
    type: 'case',
    content:
      'Write a three-sentence escalation memo that states the situation, tradeoff, and recommended action.',
    explanation:
      'The exercise trains concise communication, prioritization, and actionability.',
    sourceText: 'Deliberate practice prompt for operators handling ambiguity.',
    tags: ['decision-making', 'leadership'],
    difficulty: 4,
    learningMode: 'deliberate_practice',
    nextReviewAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    intervalDays: 1,
    easeFactor: 2.1,
    repetitions: 0,
    lastScore: null,
  },
  {
    id: 'concept-1',
    title: 'Active recall',
    type: 'concept',
    content:
      'Active recall strengthens memory by forcing retrieval before looking at the answer.',
    explanation:
      'The difficulty of retrieval is part of what improves retention.',
    sourceText: 'Core learning method used throughout icogn.',
    tags: ['learning-science', 'memory'],
    difficulty: 2,
    learningMode: 'active_recall',
    nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    intervalDays: 3,
    easeFactor: 2.6,
    repetitions: 2,
    lastScore: 5,
  },
];

export {
  buildInterleavedQueue,
  calculateNextReview,
  createLearningSession,
  getDueItems,
} from '@/lib/learning/scheduler';
