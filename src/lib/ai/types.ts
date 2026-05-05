export type AiProvider = 'groq' | 'openai' | 'anthropic';

export type AiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AiCompletionRequest = {
  model: string;
  messages: AiMessage[];
  temperature?: number;
};

export type AiCompletionResponse = {
  text: string;
  provider: AiProvider;
  model: string;
};

export interface AiClient {
  provider: AiProvider;
  complete(request: AiCompletionRequest): Promise<AiCompletionResponse>;
}

export type UserAiPreferences = {
  provider: AiProvider;
  model: string;
};
