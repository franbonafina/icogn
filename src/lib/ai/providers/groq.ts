import type {
  EvaluationInput,
  EvaluationResult,
  GenerateTextInput,
  GenerateTextResult,
  LLMProvider,
} from '@/lib/ai/types';

type ProviderInvoker = <TInput, TResult>(
  provider: LLMProvider['name'],
  task: 'generateText' | 'evaluate',
  input: TInput,
) => Promise<TResult>;

export function createGroqProvider(invoke: ProviderInvoker): LLMProvider {
  return {
    name: 'groq',
    generateText(input: GenerateTextInput) {
      return invoke<GenerateTextInput, GenerateTextResult>('groq', 'generateText', input);
    },
    evaluate(input: EvaluationInput) {
      return invoke<EvaluationInput, EvaluationResult>('groq', 'evaluate', input);
    },
  };
}
