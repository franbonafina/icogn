import { callGroqJson } from '@/lib/ai/groqBrowser';
import type {
  AIProviderName,
  EvaluationInput,
  EvaluationResult,
  GenerateTextInput,
  GenerateTextResult,
  LLMProvider,
  ModelConfig,
} from '@/lib/ai/types';

function assertSupportedProvider(provider: AIProviderName) {
  if (provider !== 'groq') {
    throw new Error(
      `Direct browser AI is currently enabled only for Groq. Selected provider: ${provider}.`,
    );
  }
}

const groqProvider: LLMProvider = {
  name: 'groq',
  async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
    const { parsed } = await callGroqJson<{ text: string }>(
      [
        { role: 'system', content: input.systemPrompt },
        { role: 'user', content: input.userPrompt },
      ],
      input.model,
      input.temperature ?? 0.4,
      input.maxTokens,
    );

    return {
      provider: 'groq',
      model: input.model,
      text: parsed.text,
      metadata: input.metadata,
    };
  },
  async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    const prompt = [
      `Rubric: ${input.rubric}`,
      `Context: ${input.context}`,
      `User answer: ${input.userAnswer}`,
      input.expectedOutput ? `Expected output: ${input.expectedOutput}` : '',
      'Return strict JSON with summary, strengths, and improvements.',
    ]
      .filter(Boolean)
      .join('\n\n');

    const { parsed, rawText } = await callGroqJson<{
      summary: string;
      strengths: string[];
      improvements: string[];
    }>(
      [
        {
          role: 'system',
          content:
            'You evaluate written answers. Return strict JSON only with summary, strengths, and improvements.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      input.model,
      0.2,
      1000,
    );

    return {
      provider: 'groq',
      model: input.model,
      summary: parsed.summary,
      strengths: parsed.strengths ?? [],
      improvements: parsed.improvements ?? [],
      rawText,
    };
  },
};

export const providerRegistry: Record<AIProviderName, LLMProvider> = {
  groq: groqProvider,
  openai: {
    name: 'openai',
    async generateText() {
      assertSupportedProvider('openai');
      return Promise.reject(new Error('OpenAI direct browser provider is not enabled.'));
    },
    async evaluate() {
      assertSupportedProvider('openai');
      return Promise.reject(new Error('OpenAI direct browser provider is not enabled.'));
    },
  },
  anthropic: {
    name: 'anthropic',
    async generateText() {
      assertSupportedProvider('anthropic');
      return Promise.reject(new Error('Anthropic direct browser provider is not enabled.'));
    },
    async evaluate() {
      assertSupportedProvider('anthropic');
      return Promise.reject(new Error('Anthropic direct browser provider is not enabled.'));
    },
  },
};

export function getLLMProvider(provider: AIProviderName = 'groq') {
  return providerRegistry[provider];
}

export async function generateText(
  config: ModelConfig,
  input: Omit<GenerateTextInput, 'model' | 'temperature'>,
) {
  assertSupportedProvider(config.provider);

  return getLLMProvider(config.provider).generateText({
    ...input,
    model: config.modelName,
    temperature: config.temperature,
  });
}

export async function evaluateAnswer(
  config: Pick<ModelConfig, 'provider' | 'modelName'>,
  input: Omit<EvaluationInput, 'model'>,
) {
  assertSupportedProvider(config.provider);

  return getLLMProvider(config.provider).evaluate({
    ...input,
    model: config.modelName,
  });
}

export type { EvaluationInput, EvaluationResult, GenerateTextInput, GenerateTextResult };
