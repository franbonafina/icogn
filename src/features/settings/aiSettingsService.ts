import { aiSettingsRepository } from '@/lib/firebase/repositories';
import { getCurrentAppUser } from '@/lib/firebase/currentUser';
import { getDefaultAiSettings, saveAiSettings as saveLocalAiSettings } from '@/lib/ai/settings';
import type { AiEvaluationStyle, AiSettings } from '@/types/firestore';

export type AiSettingsForm = {
  provider: 'groq' | 'openai' | 'anthropic';
  modelName: string;
  temperature: number;
  maxTokens: number;
  strictJsonMode: boolean;
  evaluationStyle: AiEvaluationStyle;
};

export function createDefaultAiSettingsRecord(userId: string): Omit<AiSettings, 'id'> {
  const defaults = getDefaultAiSettings();

  return {
    userId,
    provider: defaults.provider,
    modelName: defaults.model,
    temperature: 0.4,
    maxTokens: 1200,
    strictJsonMode: true,
    evaluationStyle: 'balanced',
    createdAt: null as never,
    updatedAt: null as never,
  };
}

export async function getOrCreateAiSettings() {
  const { userId } = await getCurrentAppUser();
  const existing = await aiSettingsRepository.getByUserId(userId);

  if (existing) {
    return existing;
  }

  return aiSettingsRepository.create({
    ...createDefaultAiSettingsRecord(userId),
    id: userId,
  });
}

export async function saveAiSettingsConfig(input: AiSettingsForm) {
  const { userId } = await getCurrentAppUser();

  const saved = await aiSettingsRepository.upsert(userId, {
    userId,
    ...input,
    createdAt: null as never,
    updatedAt: null as never,
  });

  saveLocalAiSettings({
    provider: input.provider,
    model: input.modelName,
  });

  return saved;
}
