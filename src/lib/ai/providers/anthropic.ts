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

export function createAnthropicProvider(invoke: ProviderInvoker): LLMProvider {
  return {
    name: 'anthropic',
    async generateText(input: GenerateTextInput) {
      // TODO: Enable Anthropic in Firebase Functions and route this provider there.
      return invoke<GenerateTextInput, GenerateTextResult>('anthropic', 'generateText', input);
    },
    async evaluate(input: EvaluationInput) {
      // TODO: Enable Anthropic in Firebase Functions and route this provider there.
      return invoke<EvaluationInput, EvaluationResult>('anthropic', 'evaluate', input);
    },
  };
}
