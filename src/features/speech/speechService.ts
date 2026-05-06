import { getOrCreateAiSettings } from '@/features/settings/aiSettingsService';
import { callGroqJson } from '@/lib/ai/groqBrowser';
import { speechSessionsRepository } from '@/lib/firebase/repositories';
import { getFirebaseAuth } from '@/lib/firebase/auth';
import { recordSpeechSessionInProfileMemory } from '@/features/profile/profileMemoryService';
import type { SpeechSession, SpeechSessionScores } from '@/types/firestore';

export type SpeechEvaluationResult = {
  scores: SpeechSessionScores;
  feedback: string;
  improvementTasks: string[];
};

export const speechPrompts = [
  'Explain a difficult decision you would make as a leader.',
  'Defend a public policy position in 90 seconds.',
  'Convince a skeptical stakeholder to support a product investment.',
  'Explain a complex technical concept to a non-technical audience.',
];

const demoUserId = 'demo-user';

export async function getCurrentSpeechUser() {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser ?? null;

  if (!user) {
    return {
      userId: demoUserId,
      token: null,
    };
  }

  return {
    userId: user.uid,
    token: await user.getIdToken(),
  };
}

export function mockEvaluateSpeechTranscript(
  prompt: string,
  transcript: string,
): SpeechEvaluationResult {
  const length = transcript.trim().split(/\s+/).filter(Boolean).length;
  const mentionsPrompt = prompt
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 5)
    .some((token) => transcript.toLowerCase().includes(token));

  const base = length > 80 ? 4 : length > 40 ? 3 : 2;

  return {
    scores: {
      clarity: base,
      structure: Math.min(5, base + 1),
      argumentation: mentionsPrompt ? Math.min(5, base + 1) : base,
      persuasion: base,
      confidence: Math.max(2, base - 1),
      concision: length < 180 ? 4 : 2,
    },
    feedback:
      'Fallback evaluation used because the backend evaluator or authenticated session was unavailable. The transcript is still captured and structured for review.',
    improvementTasks: [
      'Open with a one-sentence thesis before expanding the answer.',
      'Use one concrete example to support the main claim.',
      'Trim repetition and end with a decisive closing sentence.',
    ],
  };
}

export async function evaluateSpeechTranscriptWithFunction(
  prompt: string,
  transcript: string,
) {
  const settings = await getOrCreateAiSettings();

  if (settings.provider !== 'groq') {
    return mockEvaluateSpeechTranscript(prompt, transcript);
  }

  try {
    const { parsed } = await callGroqJson<SpeechEvaluationResult>(
      [
        {
          role: 'system',
          content:
            'You evaluate speech performance. Return strict JSON only and use integer scores from 1 to 5.',
        },
        {
          role: 'user',
          content: [
            'Evaluate a speech transcript against the prompt.',
            'Return strict JSON only.',
            'Schema: {"scores":{"clarity":1-5,"structure":1-5,"argumentation":1-5,"persuasion":1-5,"confidence":1-5,"concision":1-5},"feedback":"...","improvementTasks":["..."]}',
            `Prompt:\n${prompt}`,
            `Transcript:\n${transcript}`,
          ].join('\n\n'),
        },
      ],
      settings.modelName,
      settings.temperature,
      settings.maxTokens,
    );

    return parsed;
  } catch {
    return mockEvaluateSpeechTranscript(prompt, transcript);
  }
}

export async function saveSpeechSession(
  prompt: string,
  transcript: string,
  durationSeconds: number,
  evaluation: SpeechEvaluationResult,
) {
  const { userId } = await getCurrentSpeechUser();

  const payload: Omit<SpeechSession, 'id'> = {
    userId,
    prompt,
    transcript,
    durationSeconds,
    scores: evaluation.scores,
    feedback: evaluation.feedback,
    improvementTasks: evaluation.improvementTasks,
    createdAt: null as never,
    updatedAt: null as never,
  };

  const session = await speechSessionsRepository.create(payload);

  await recordSpeechSessionInProfileMemory({
    userId,
    prompt,
    scores: evaluation.scores,
    feedback: evaluation.feedback,
    improvementTasks: evaluation.improvementTasks,
  });

  return session;
}
