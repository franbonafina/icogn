import { defineSecret } from 'firebase-functions/params';

import type { CompletionMessage, ProviderName } from './types.js';

export const groqApiKey = defineSecret('GROQ_API_KEY');

export function extractJsonBlock(rawText: string) {
  const fencedMatch = rawText.match(/```json\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return rawText.trim();
}

export async function callProviderJson<T>(
  provider: ProviderName,
  messages: CompletionMessage[],
  model: string,
  temperature = 0.2,
  maxTokens?: number,
): Promise<{ parsed: T; rawText: string; raw: unknown }> {
  if (provider !== 'groq') {
    throw new Error('Only Groq is enabled in backend today.');
  }

  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqApiKey.value()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      ...(maxTokens ? { max_tokens: maxTokens } : {}),
      response_format: { type: 'json_object' },
    }),
  });

  if (!groqResponse.ok) {
    const errorText = await groqResponse.text();
    throw new Error(errorText || 'Groq request failed');
  }

  const payload = (await groqResponse.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const rawText = payload.choices?.[0]?.message?.content ?? '';
  const parsed = JSON.parse(extractJsonBlock(rawText)) as T;

  return {
    parsed,
    rawText,
    raw: payload,
  };
}
