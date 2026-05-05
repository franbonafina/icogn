import { GroqClient } from '@/lib/ai/groq';
import type {
  AiClient,
  AiCompletionRequest,
  AiCompletionResponse,
  AiProvider,
} from '@/lib/ai/types';

class StubProviderClient implements AiClient {
  constructor(public provider: AiProvider) {}

  async complete(
    request: AiCompletionRequest,
  ): Promise<AiCompletionResponse> {
    return {
      text: `${this.provider} placeholder response for model "${request.model}".`,
      provider: this.provider,
      model: request.model,
    };
  }
}

const providers: Record<AiProvider, AiClient> = {
  groq: new GroqClient(),
  openai: new StubProviderClient('openai'),
  anthropic: new StubProviderClient('anthropic'),
};

export function getAiClient(provider: AiProvider = 'groq') {
  return providers[provider];
}
