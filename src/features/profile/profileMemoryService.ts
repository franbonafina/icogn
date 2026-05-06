import { profileMemoryRepository } from '@/lib/firebase/repositories';
import type {
  DecisionAttemptScores,
  LearningMode,
  ProfileMemory,
  SpeechSessionScores,
} from '@/types/firestore';

type TopicScoreMap = Record<string, number>;

function incrementScores(map: TopicScoreMap, keys: string[], delta: number) {
  const next = { ...map };

  keys.forEach((key) => {
    const normalized = key.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    next[normalized] = Math.max(0, (next[normalized] ?? 0) + delta);
  });

  return next;
}

function getTopKeys(map: TopicScoreMap, direction: 'desc' | 'asc', limit = 4) {
  const entries = Object.entries(map);

  return entries
    .sort((left, right) =>
      direction === 'desc' ? right[1] - left[1] : left[1] - right[1],
    )
    .filter(([, value]) => (direction === 'desc' ? value > 0 : true))
    .slice(0, limit)
    .map(([key]) => key);
}

function pushUnique(items: string[], nextItem: string, limit = 6) {
  const normalized = nextItem.trim();

  if (!normalized) {
    return items;
  }

  return [normalized, ...items.filter((item) => item !== normalized)].slice(0, limit);
}

function sortPreferredModes(modeCounts: TopicScoreMap): LearningMode[] {
  return (Object.entries(modeCounts)
    .sort((left, right) => right[1] - left[1])
    .map(([mode]) => mode) as LearningMode[]).slice(0, 4);
}

function averageScore(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildSpeechPatterns(scores: SpeechSessionScores, feedback: string, existing: string[]) {
  let next = [...existing];

  if (scores.clarity <= 3) {
    next = pushUnique(next, 'Clarity drops when answers get dense.');
  }

  if (scores.concision <= 3) {
    next = pushUnique(next, 'Tends to over-explain instead of closing decisively.');
  }

  if (scores.structure <= 3) {
    next = pushUnique(next, 'Needs stronger structure before supporting details.');
  }

  if (feedback) {
    next = pushUnique(next, feedback, 4);
  }

  return next.slice(0, 4);
}

function buildDecisionPatterns(scores: DecisionAttemptScores, feedback: string, existing: string[]) {
  let next = [...existing];

  if (scores.riskAwareness <= 3) {
    next = pushUnique(next, 'Underspecifies second-order risks.');
  }

  if (scores.tradeoffQuality <= 3) {
    next = pushUnique(next, 'Tradeoffs need to be made more explicit.');
  }

  if (scores.actionability <= 3) {
    next = pushUnique(next, 'Needs clearer sequencing from choice to execution.');
  }

  if (feedback) {
    next = pushUnique(next, feedback, 4);
  }

  return next.slice(0, 4);
}

function buildRecommendations(memory: Pick<
  ProfileMemory,
  'weaknesses' | 'speechPatterns' | 'decisionPatterns' | 'preferredModes'
>) {
  const next: string[] = [];

  if (memory.weaknesses[0]) {
    next.push(`Revisit weak topic: ${memory.weaknesses[0]}.`);
  }

  if (memory.speechPatterns[0]) {
    next.push(`Speech focus: ${memory.speechPatterns[0]}`);
  }

  if (memory.decisionPatterns[0]) {
    next.push(`Decision focus: ${memory.decisionPatterns[0]}`);
  }

  if (memory.preferredModes[0]) {
    next.push(`Use ${memory.preferredModes[0].replace(/_/g, ' ')} in the next session.`);
  }

  return next.slice(0, 4);
}

export function createDefaultProfileMemory(userId: string): Omit<ProfileMemory, 'id'> {
  return {
    userId,
    strengths: [],
    weaknesses: [],
    preferredModes: [],
    recurringErrors: [],
    speechPatterns: [],
    decisionPatterns: [],
    conceptMastery: {},
    recommendations: ['Complete a first learning, speech, or decision session to build profile memory.'],
    recentActivity: [],
    aiSummary: null,
    createdAt: null as never,
    updatedAt: null as never,
  };
}

export async function getOrCreateProfileMemory(userId: string) {
  const existing = await profileMemoryRepository.getByUserId(userId);

  if (existing) {
    return existing;
  }

  const created = await profileMemoryRepository.create({
    ...createDefaultProfileMemory(userId),
    id: userId,
  });

  return created;
}

async function persistProfileMemory(memory: Omit<ProfileMemory, 'id'>) {
  return profileMemoryRepository.upsert(memory.userId, {
    ...memory,
    createdAt: null as never,
    updatedAt: null as never,
  });
}

export async function recordLearningSessionInProfileMemory(input: {
  userId: string;
  title: string;
  tags: string[];
  learningMode: LearningMode;
  score: number;
}) {
  const current = await getOrCreateProfileMemory(input.userId);
  const masteryDelta = input.score >= 3 ? 1 : -1;
  const nextConceptMastery = incrementScores(
    current.conceptMastery,
    [input.title, ...input.tags],
    masteryDelta,
  );
  const nextRecurringErrors =
    input.score < 3
      ? pushUnique(current.recurringErrors, `Low recall on ${input.title}.`)
      : current.recurringErrors;
  const modeCounts = incrementScores(
    current.preferredModes.reduce<Record<string, number>>((acc, mode, index) => {
      acc[mode] = current.preferredModes.length - index;
      return acc;
    }, {}),
    [input.learningMode],
    1,
  );

  const nextMemory: Omit<ProfileMemory, 'id'> = {
    ...current,
    conceptMastery: nextConceptMastery,
    strengths: getTopKeys(nextConceptMastery, 'desc'),
    weaknesses: getTopKeys(nextConceptMastery, 'asc'),
    preferredModes: sortPreferredModes(modeCounts),
    recurringErrors: nextRecurringErrors.slice(0, 6),
    recentActivity: pushUnique(
      current.recentActivity,
      `Learning review: ${input.title} scored ${input.score}/5.`,
    ),
    recommendations: current.recommendations,
  };

  nextMemory.recommendations = buildRecommendations(nextMemory);

  return persistProfileMemory(nextMemory);
}

export async function recordSpeechSessionInProfileMemory(input: {
  userId: string;
  prompt: string;
  scores: SpeechSessionScores;
  feedback: string;
  improvementTasks: string[];
}) {
  const current = await getOrCreateProfileMemory(input.userId);
  const avg = averageScore(Object.values(input.scores));
  const nextRecurringErrors =
    avg < 3.5
      ? input.improvementTasks.reduce(
          (items, task) => pushUnique(items, task),
          current.recurringErrors,
        )
      : current.recurringErrors;

  const nextMemory: Omit<ProfileMemory, 'id'> = {
    ...current,
    speechPatterns: buildSpeechPatterns(input.scores, input.feedback, current.speechPatterns),
    recurringErrors: nextRecurringErrors.slice(0, 6),
    recentActivity: pushUnique(
      current.recentActivity,
      `Speech practice completed on "${input.prompt}" with average ${avg.toFixed(1)}.`,
    ),
    recommendations: current.recommendations,
  };

  nextMemory.recommendations = buildRecommendations(nextMemory);

  return persistProfileMemory(nextMemory);
}

export async function recordDecisionAttemptInProfileMemory(input: {
  userId: string;
  scenarioTitle: string;
  tags: string[];
  scores: DecisionAttemptScores;
  feedback: string;
  risksMissed: string[];
}) {
  const current = await getOrCreateProfileMemory(input.userId);
  const avg = averageScore(Object.values(input.scores));
  const nextConceptMastery = incrementScores(
    current.conceptMastery,
    input.tags,
    avg >= 3.5 ? 1 : -1,
  );
  const nextRecurringErrors = input.risksMissed.reduce(
    (items, risk) => pushUnique(items, risk),
    current.recurringErrors,
  );

  const nextMemory: Omit<ProfileMemory, 'id'> = {
    ...current,
    conceptMastery: nextConceptMastery,
    strengths: getTopKeys(nextConceptMastery, 'desc'),
    weaknesses: getTopKeys(nextConceptMastery, 'asc'),
    decisionPatterns: buildDecisionPatterns(
      input.scores,
      input.feedback,
      current.decisionPatterns,
    ),
    recurringErrors: nextRecurringErrors.slice(0, 6),
    recentActivity: pushUnique(
      current.recentActivity,
      `Decision simulation: ${input.scenarioTitle} scored ${avg.toFixed(1)} average.`,
    ),
    recommendations: current.recommendations,
  };

  nextMemory.recommendations = buildRecommendations(nextMemory);

  return persistProfileMemory(nextMemory);
}
