export type AIProviderName = 'groq' | 'openai' | 'anthropic';

export type ModelConfig = {
  provider: AIProviderName;
  modelName: string;
  temperature: number;
};

export type GenerateTextInput = {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, string | number | boolean | null>;
};

export type GenerateTextResult = {
  provider: AIProviderName;
  model: string;
  text: string;
  metadata?: Record<string, unknown>;
};

export type EvaluationInput = {
  rubric: string;
  userAnswer: string;
  context: string;
  expectedOutput?: string;
  model: string;
};

export type EvaluationResult = {
  provider: AIProviderName;
  model: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  rawText: string;
};

export interface LLMProvider {
  name: AIProviderName;
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}

export type UserAiPreferences = {
  provider: AIProviderName;
  model: string;
};

export type BackendAiTask = 'generateText' | 'evaluate';
