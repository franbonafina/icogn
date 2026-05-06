import {
  decisionAttemptsRepository,
  learningSessionsRepository,
  profileMemoryRepository,
  speechSessionsRepository,
} from '@/lib/firebase/repositories';
import { getCurrentAppUser } from '@/lib/firebase/currentUser';
import { mockLearningItems } from '@/lib/learning';
import { getDueItems } from '@/lib/learning/scheduler';
import { speechPrompts } from '@/features/speech/speechService';
import { getScenarioTemplate, type ScenarioType } from '@/features/decision/decisionService';
import { createDefaultProfileMemory } from '@/features/profile/profileMemoryService';
import type { DecisionAttempt, LearningSession, ProfileMemory, SpeechSession } from '@/types/firestore';

export type DashboardData = {
  greetingName: string;
  dueConcepts: Array<{ id: string; title: string; mode: string }>;
  suggestedSpeechPractice: string;
  suggestedDecisionScenario: {
    type: ScenarioType;
    title: string;
    summary: string;
  };
  progress: {
    conceptsReviewed: number;
    recallScoreAverage: number | null;
    speechScoreAverage: number | null;
    decisionScoreAverage: number | null;
  };
  insight: {
    strength: string;
    weakness: string;
    recommendedAction: string;
  };
};

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function averageSpeechScore(sessions: SpeechSession[]) {
  return average(
    sessions.map((session) => {
      const values = Object.values(session.scores);
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    }),
  );
}

function averageDecisionScore(attempts: DecisionAttempt[]) {
  return average(
    attempts.map((attempt) => {
      const values = Object.values(attempt.scores);
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    }),
  );
}

function pickSpeechPrompt(memory: ProfileMemory) {
  if (memory.speechPatterns.some((item) => item.toLowerCase().includes('technical'))) {
    return speechPrompts[3];
  }

  if (memory.speechPatterns.some((item) => item.toLowerCase().includes('stakeholder'))) {
    return speechPrompts[2];
  }

  return speechPrompts[0];
}

function pickScenarioType(memory: ProfileMemory): ScenarioType {
  const weakness = memory.weaknesses[0] ?? '';

  if (weakness.includes('ethical')) {
    return 'ethical';
  }

  if (weakness.includes('business')) {
    return 'business';
  }

  if (weakness.includes('crisis')) {
    return 'crisis';
  }

  if (memory.decisionPatterns.some((item) => item.toLowerCase().includes('risk'))) {
    return 'crisis';
  }

  return 'leadership';
}

export async function loadHomeDashboard() {
  const { userId, displayName } = await getCurrentAppUser();
  const [profileMemory, learningSessions, speechSessions, decisionAttempts] =
    await Promise.all([
      profileMemoryRepository.getByUserId(userId),
      learningSessionsRepository.listByUser(userId),
      speechSessionsRepository.listByUser(userId),
      decisionAttemptsRepository.listByUser(userId),
    ]);

  const memory = profileMemory ?? {
    ...createDefaultProfileMemory(userId),
    id: userId,
  };

  const dueConcepts = getDueItems(mockLearningItems, new Date()).slice(0, 3).map((item) => ({
    id: item.id,
    title: item.title,
    mode: item.learningMode.replace(/_/g, ' '),
  }));

  const scenarioType = pickScenarioType(memory);
  const scenario = getScenarioTemplate(scenarioType);

  return {
    greetingName: displayName,
    dueConcepts,
    suggestedSpeechPractice: pickSpeechPrompt(memory),
    suggestedDecisionScenario: {
      type: scenarioType,
      title: scenario.title,
      summary: scenario.summary,
    },
    progress: {
      conceptsReviewed: learningSessions.length,
      recallScoreAverage: average(
        (learningSessions as LearningSession[])
          .map((session) => session.score)
          .filter((score): score is number => typeof score === 'number'),
      ),
      speechScoreAverage: averageSpeechScore(speechSessions as SpeechSession[]),
      decisionScoreAverage: averageDecisionScore(decisionAttempts as DecisionAttempt[]),
    },
    insight: {
      strength: memory.strengths[0] ?? 'No clear strength yet. Complete a few sessions to establish a pattern.',
      weakness: memory.weaknesses[0] ?? 'No priority weakness detected yet.',
      recommendedAction:
        memory.recommendations[0] ?? 'Start with one recall review, one short speech, or one decision scenario.',
    },
  } satisfies DashboardData;
}
