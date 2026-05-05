import type {
  AiClient,
  AiCompletionRequest,
  AiCompletionResponse,
} from '@/lib/ai/types';

export class GroqClient implements AiClient {
  provider = 'groq' as const;

  async complete(
    request: AiCompletionRequest,
  ): Promise<AiCompletionResponse> {
    return {
      text: `Groq placeholder response for model "${request.model}".`,
      provider: this.provider,
      model: request.model,
    };
  }
}
