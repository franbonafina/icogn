import type { AiProvider } from '@/lib/ai/types';

export type AiModelOption = {
  id: string;
  label: string;
  provider: AiProvider;
  status: 'active' | 'planned';
};

export const aiModelCatalog: Record<AiProvider, AiModelOption[]> = {
  groq: [
    {
      id: 'llama-3.3-70b-versatile',
      label: 'Llama 3.3 70B Versatile',
      provider: 'groq',
      status: 'active',
    },
    {
      id: 'llama-3.1-8b-instant',
      label: 'Llama 3.1 8B Instant',
      provider: 'groq',
      status: 'active',
    },
  ],
  openai: [
    {
      id: 'gpt-4.1-mini',
      label: 'GPT-4.1 Mini',
      provider: 'openai',
      status: 'planned',
    },
    {
      id: 'gpt-4.1',
      label: 'GPT-4.1',
      provider: 'openai',
      status: 'planned',
    },
  ],
  anthropic: [
    {
      id: 'claude-3-5-sonnet',
      label: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      status: 'planned',
    },
    {
      id: 'claude-3-7-sonnet',
      label: 'Claude 3.7 Sonnet',
      provider: 'anthropic',
      status: 'planned',
    },
  ],
};

export function getDefaultModelForProvider(provider: AiProvider) {
  return aiModelCatalog[provider][0]?.id ?? '';
}
