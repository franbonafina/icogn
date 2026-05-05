import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';

const groqApiKey = defineSecret('GROQ_API_KEY');

type CompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type CompletionRequestBody = {
  provider?: 'groq' | 'openai' | 'anthropic';
  model?: string;
  messages?: CompletionMessage[];
  temperature?: number;
};

export const health = onRequest((_request, response) => {
  response.json({ ok: true, service: 'icogn-functions' });
});

export const complete = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) => {
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const body = (request.body ?? {}) as CompletionRequestBody;
    const provider = body.provider ?? 'groq';
    const model = body.model ?? 'llama-3.3-70b-versatile';
    const messages = body.messages ?? [];
    const temperature = body.temperature ?? 0.4;

    if (provider !== 'groq') {
      response.status(400).json({
        error:
          'This backend currently has Groq enabled. Other providers remain supported at the product architecture level.',
      });
      return;
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      response.status(400).json({ error: 'messages is required' });
      return;
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
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      response.status(groqResponse.status).json({
        error: 'Groq request failed',
        provider,
        detail: errorText,
      });
      return;
    }

    const payload = (await groqResponse.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    response.json({
      provider,
      model,
      text: payload.choices?.[0]?.message?.content ?? '',
      raw: payload,
    });
  },
);
