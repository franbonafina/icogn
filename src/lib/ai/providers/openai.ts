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

export function createOpenAIProvider(invoke: ProviderInvoker): LLMProvider {
  return {
    name: 'openai',
    async generateText(input: GenerateTextInput) {
      // TODO: Enable OpenAI in Firebase Functions and route this provider there.
      return invoke<GenerateTextInput, GenerateTextResult>('openai', 'generateText', input);
    },
    async evaluate(input: EvaluationInput) {
      // TODO: Enable OpenAI in Firebase Functions and route this provider there.
      return invoke<EvaluationInput, EvaluationResult>('openai', 'evaluate', input);
    },
  };
}
