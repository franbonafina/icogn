import { getDefaultModelForProvider } from '@/lib/ai/catalog';
import type { AiProvider } from '@/lib/ai/types';

export type AiSettings = {
  provider: AiProvider;
  model: string;
};

const STORAGE_KEY = 'inucogn.ai.settings';

function isAiProvider(value: string): value is AiProvider {
  return value === 'groq' || value === 'openai' || value === 'anthropic';
}

export function getDefaultAiSettings(): AiSettings {
  const envProvider = import.meta.env.VITE_DEFAULT_AI_PROVIDER;
  const provider = isAiProvider(envProvider) ? envProvider : 'groq';
  const envModel = import.meta.env.VITE_DEFAULT_AI_MODEL;

  return {
    provider,
    model: envModel || getDefaultModelForProvider(provider),
  };
}

export function loadAiSettings(): AiSettings {
  if (typeof window === 'undefined') {
    return getDefaultAiSettings();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return getDefaultAiSettings();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AiSettings>;

    if (!parsed.provider || !isAiProvider(parsed.provider)) {
      return getDefaultAiSettings();
    }

    return {
      provider: parsed.provider,
      model: parsed.model || getDefaultModelForProvider(parsed.provider),
    };
  } catch {
    return getDefaultAiSettings();
  }
}

export function saveAiSettings(settings: AiSettings) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
