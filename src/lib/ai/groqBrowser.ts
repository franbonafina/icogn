type CompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function getGroqApiKey() {
  return import.meta.env.VITE_GROQ_API_KEY?.trim() ?? '';
}

function getGroqBaseUrl() {
  return (
    import.meta.env.VITE_GROQ_API_BASE_URL?.trim() ||
    'https://api.groq.com/openai/v1'
  ).replace(/\/+$/, '');
}

function extractJsonBlock(rawText: string) {
  const fencedMatch = rawText.match(/```json\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return rawText.trim();
}

async function postGroqChatCompletion(body: Record<string, unknown>) {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error('Missing VITE_GROQ_API_KEY.');
  }

  const response = await fetch(`${getGroqBaseUrl()}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Groq request failed.');
  }

  return (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };
}

export async function callGroqJson<T>(
  messages: CompletionMessage[],
  model: string,
  temperature = 0.2,
  maxTokens?: number,
) {
  const payload = await postGroqChatCompletion({
    model,
    messages,
    temperature,
    ...(maxTokens ? { max_tokens: maxTokens } : {}),
    response_format: { type: 'json_object' },
  });

  const rawText = payload.choices?.[0]?.message?.content ?? '';

  return {
    rawText,
    parsed: JSON.parse(extractJsonBlock(rawText)) as T,
  };
}

export async function callGroqText(
  messages: CompletionMessage[],
  model: string,
  temperature = 0.4,
  maxTokens?: number,
) {
  const payload = await postGroqChatCompletion({
    model,
    messages,
    temperature,
    ...(maxTokens ? { max_tokens: maxTokens } : {}),
  });

  return payload.choices?.[0]?.message?.content?.trim() ?? '';
}
