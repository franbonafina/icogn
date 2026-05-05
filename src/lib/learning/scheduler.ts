import type { LearningItemType, LearningMode } from '@/types/firestore';

type DateLike =
  | Date
  | string
  | number
  | null
  | undefined
  | {
      toDate(): Date;
    };

export type ReviewableLearningItem = {
  id: string;
  title: string;
  type: LearningItemType;
  content: string;
  explanation: string;
  sourceText: string;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  learningMode: LearningMode;
  nextReviewAt: DateLike;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lastScore: number | null;
};

export type LearningSessionCard = {
  id: string;
  itemId: string;
  mode: LearningMode;
  title: string;
  prompt: string;
  answer: string;
  sourceText: string;
  tags: string[];
  exercise: string;
  improvementFocus: string[];
};

export type GeneratedLearningSession = {
  mode: LearningMode;
  cards: LearningSessionCard[];
  startedAt: Date;
};

export type NextReviewResult = {
  score: number;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: Date;
  lastScore: number;
};

function toDate(value: DateLike): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === 'object' && 'toDate' in value) {
    const parsed = value.toDate();
    return parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed : null;
  }

  return null;
}

function addDays(date: Date, intervalDays: number) {
  return new Date(date.getTime() + intervalDays * 24 * 60 * 60 * 1000);
}

function clampScore(score: number) {
  return Math.max(0, Math.min(5, Math.round(score)));
}

function buildPrompt(item: ReviewableLearningItem, mode: LearningMode) {
  if (mode === 'deliberate_practice') {
    return `Apply ${item.title} in a short written exercise.`;
  }

  if (mode === 'active_recall') {
    return `Recall ${item.title} before revealing the answer.`;
  }

  if (mode === 'interleaving') {
    return `Connect ${item.title} to adjacent concepts without relying on the same tag sequence.`;
  }

  return `Review ${item.title} and rate how well you recalled it.`;
}

function buildExercise(item: ReviewableLearningItem, mode: LearningMode) {
  switch (mode) {
    case 'active_recall':
      return `State the core idea of "${item.title}" from memory, then reveal the reference answer.`;
    case 'interleaving':
      return `Explain "${item.title}" and compare it with another concept in this sequence.`;
    case 'deliberate_practice':
      return `Write a specific response that uses "${item.title}" under pressure, then refine it with targeted feedback.`;
    case 'spaced_repetition':
    default:
      return `Recall the concept, check the answer, and self-score your retention from 0 to 5.`;
  }
}

function buildImprovementFocus(item: ReviewableLearningItem, mode: LearningMode) {
  const focus = [
    `Use the exact vocabulary of ${item.title} once before paraphrasing.`,
    `Tie the answer back to ${item.tags[0] ?? 'the broader topic'} in one sentence.`,
  ];

  if (mode === 'deliberate_practice') {
    focus.push('Make the answer more specific and actionable.');
  }

  if (item.difficulty >= 4) {
    focus.push('Slow down and reconstruct the concept step by step.');
  }

  return focus;
}

export function getDueItems(items: ReviewableLearningItem[], date = new Date()) {
  const target = toDate(date) ?? new Date();

  return [...items]
    .filter((item) => {
      const nextReviewAt = toDate(item.nextReviewAt);
      return !nextReviewAt || nextReviewAt.getTime() <= target.getTime();
    })
    .sort((left, right) => {
      const leftDate = toDate(left.nextReviewAt)?.getTime() ?? 0;
      const rightDate = toDate(right.nextReviewAt)?.getTime() ?? 0;
      return leftDate - rightDate;
    });
}

export function calculateNextReview(
  item: ReviewableLearningItem,
  score: number,
  date = new Date(),
): NextReviewResult {
  const normalizedScore = clampScore(score);
  const currentEaseFactor = Math.max(1.3, item.easeFactor || 2.5);

  const easeFactor = Math.max(
    1.3,
    currentEaseFactor +
      (0.1 - (5 - normalizedScore) * (0.08 + (5 - normalizedScore) * 0.02)),
  );

  if (normalizedScore < 3) {
    const intervalDays = 0.25;

    return {
      score: normalizedScore,
      repetitions: 0,
      intervalDays,
      easeFactor,
      nextReviewAt: addDays(date, intervalDays),
      lastScore: normalizedScore,
    };
  }

  const repetitions = item.repetitions + 1;
  let intervalDays = 1;

  if (repetitions === 1) {
    intervalDays = 1;
  } else if (repetitions === 2) {
    intervalDays = 3;
  } else {
    intervalDays = Math.max(4, Math.round(Math.max(1, item.intervalDays) * easeFactor));
  }

  return {
    score: normalizedScore,
    repetitions,
    intervalDays,
    easeFactor,
    nextReviewAt: addDays(date, intervalDays),
    lastScore: normalizedScore,
  };
}

export function buildInterleavedQueue(items: ReviewableLearningItem[], date = new Date()) {
  const dueItems = getDueItems(items, date);
  const dueIds = new Set(dueItems.map((item) => item.id));
  const remaining = [...dueItems, ...items.filter((item) => !dueIds.has(item.id))];
  const queue: ReviewableLearningItem[] = [];
  let previousTag: string | null = null;

  while (remaining.length > 0) {
    const candidateIndex = remaining.findIndex((item) => {
      const primaryTag = item.tags[0] ?? item.id;
      return primaryTag !== previousTag;
    });

    const nextIndex = candidateIndex >= 0 ? candidateIndex : 0;
    const [nextItem] = remaining.splice(nextIndex, 1);

    queue.push(nextItem);
    previousTag = nextItem.tags[0] ?? nextItem.id;
  }

  return queue;
}

export function createLearningSession(
  items: ReviewableLearningItem[],
  mode: LearningMode,
  date = new Date(),
): GeneratedLearningSession {
  const orderedItems =
    mode === 'interleaving'
      ? buildInterleavedQueue(items, date)
      : getDueItems(items, date).length > 0
        ? getDueItems(items, date)
        : [...items];

  const filteredItems =
    mode === 'spaced_repetition'
      ? orderedItems.filter((item) => item.learningMode === 'spaced_repetition')
      : mode === 'active_recall'
        ? orderedItems.filter((item) => item.learningMode !== 'deliberate_practice')
        : mode === 'deliberate_practice'
          ? orderedItems.filter((item) => item.learningMode === 'deliberate_practice')
          : orderedItems;

  const source = filteredItems.length > 0 ? filteredItems : orderedItems;

  return {
    mode,
    startedAt: date,
    cards: source.map((item) => ({
      id: `${mode}:${item.id}`,
      itemId: item.id,
      mode,
      title: item.title,
      prompt: buildPrompt(item, mode),
      answer: item.content,
      sourceText: item.sourceText,
      tags: item.tags,
      exercise: buildExercise(item, mode),
      improvementFocus: buildImprovementFocus(item, mode),
    })),
  };
}
