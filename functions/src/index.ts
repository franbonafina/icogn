import { onRequest, type Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';

import { callProviderJson, groqApiKey } from './ai.js';
import { requireAuthenticatedUser } from './auth.js';
import {
  DEFAULT_GROQ_MODEL,
  PROMPT_VERSION,
  evaluateDecisionMemoPrompt,
  evaluateDecisionPrompt,
  evaluateExecutiveCommunicationPrompt,
  evaluateFormationReflectionPrompt,
  evaluateRecallPrompt,
  evaluateSpeechPrompt,
  evaluateStructureAnalysisPrompt,
  extractLearningItemsPrompt,
  generateDailyFormationTaskPrompt,
  generateDecisionScenarioPrompt,
  generateWeeklyFormationReviewPrompt,
} from './prompts.js';
import { enforceRateLimit } from './rateLimit.js';
import { storeAiEvaluation } from './store.js';
import type {
  CompleteTask,
  EvaluateDecisionAttemptInput,
  EvaluateDecisionAttemptResult,
  EvaluateDecisionMemoInput,
  EvaluateDecisionMemoResult,
  EvaluateExecutiveCommunicationInput,
  EvaluateExecutiveCommunicationResult,
  EvaluateFormationReflectionInput,
  EvaluateFormationReflectionResult,
  EvaluateRecallAnswerInput,
  EvaluateRecallAnswerResult,
  EvaluateSpeechTranscriptInput,
  EvaluateSpeechTranscriptResult,
  EvaluateStructureAnalysisInput,
  EvaluateStructureAnalysisResult,
  ExtractLearningItemsInput,
  GenerateDailyFormationTaskInput,
  GenerateDailyFormationTaskResult,
  GenericEvaluationInput,
  GenericEvaluationResult,
  GenericGenerateTextInput,
  GenericGenerateTextResult,
  GenerateDecisionScenarioInput,
  GenerateDecisionScenarioResult,
  GenerateWeeklyFormationReviewInput,
  GenerateWeeklyFormationReviewResult,
  LearningItemDraft,
  ProviderName,
} from './types.js';

function badRequest(message: string) {
  return { error: message };
}

async function withAiRequest<TInput, TResult>(
  request: Request,
  response: Response,
  action:
    | 'extractLearningItems'
    | 'evaluateRecallAnswer'
    | 'evaluateSpeechTranscript'
    | 'evaluateDecisionAttempt'
    | 'generateDecisionScenario'
    | 'evaluateFormationReflection'
    | 'evaluateStructureAnalysis'
    | 'evaluateDecisionMemo'
    | 'evaluateExecutiveCommunication'
    | 'generateDailyFormationTask'
    | 'generateWeeklyFormationReview',
  handler: (userId: string, input: TInput) => Promise<TResult>,
) {
  if (request.method !== 'POST') {
    response.status(405).json(badRequest('Method not allowed'));
    return;
  }

  try {
    const { userId } = await requireAuthenticatedUser(request);
    await enforceRateLimit(userId, action);
    const input = (request.body ?? {}) as TInput;
    const result = await handler(userId, input);
    response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown function error';
    const status = /Bearer token|auth|token/i.test(message)
      ? 401
      : /Rate limit/i.test(message)
        ? 429
        : 500;

    response.status(status).json({ error: message });
  }
}

export const health = onRequest((_request, response) => {
  response.json({ ok: true, service: 'icogn-functions' });
});

export const complete = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<
      {
        provider: ProviderName;
        task: CompleteTask;
        input: GenericGenerateTextInput | GenericEvaluationInput;
      },
      GenericGenerateTextResult | GenericEvaluationResult
    >(request, response, 'extractLearningItems', async (_userId, payload) => {
      if (payload.task === 'generateText') {
        const input = payload.input as GenericGenerateTextInput;

        if (!input.systemPrompt?.trim() || !input.userPrompt?.trim() || !input.model?.trim()) {
          throw new Error('systemPrompt, userPrompt, and model are required.');
        }

        const { parsed } = await callProviderJson<{ text: string }>(
          payload.provider,
          [
            { role: 'system', content: input.systemPrompt },
            { role: 'user', content: input.userPrompt },
          ],
          input.model,
          input.temperature ?? 0.4,
          input.maxTokens,
        );

        return {
          provider: payload.provider,
          model: input.model,
          text: parsed.text,
        };
      }

      const input = payload.input as GenericEvaluationInput;

      if (!input.rubric?.trim() || !input.userAnswer?.trim() || !input.context?.trim() || !input.model?.trim()) {
        throw new Error('rubric, userAnswer, context, and model are required.');
      }

      const prompt = [
        `Rubric: ${input.rubric}`,
        `Context: ${input.context}`,
        `User answer: ${input.userAnswer}`,
        input.expectedOutput ? `Expected output: ${input.expectedOutput}` : '',
        'Return strict JSON with summary, strengths, improvements, and rawText.',
      ]
        .filter(Boolean)
        .join('\n\n');

      const { parsed, rawText } = await callProviderJson<{
        summary: string;
        strengths: string[];
        improvements: string[];
      }>(
        payload.provider,
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
        provider: payload.provider,
        model: input.model,
        summary: parsed.summary,
        strengths: parsed.strengths ?? [],
        improvements: parsed.improvements ?? [],
        rawText,
      };
    }),
);

export const extractLearningItems = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<ExtractLearningItemsInput, { items: LearningItemDraft[] }>(
      request,
      response,
      'extractLearningItems',
      async (userId, input) => {
        if (!input.rawText?.trim()) {
          throw new Error('rawText is required.');
        }

        const { parsed, rawText } = await callProviderJson<{ items: LearningItemDraft[] }>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You are a curriculum structuring assistant. Return strict JSON only and never include commentary.',
            },
            {
              role: 'user',
              content: extractLearningItemsPrompt(
                input.rawText,
                input.preferredType,
                input.tags,
              ),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.2,
          1200,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'learningSession',
          targetId: `extract:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: {},
          feedback: 'Learning item extraction completed.',
          recommendations: parsed.items.map((item: LearningItemDraft) => item.title).slice(0, 3),
          rawResponse: rawText,
        });

        return {
          items: parsed.items ?? [],
        };
      },
    ),
);

export const evaluateRecallAnswer = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<EvaluateRecallAnswerInput, EvaluateRecallAnswerResult>(
      request,
      response,
      'evaluateRecallAnswer',
      async (userId, input) => {
        if (!input.learningItem?.content || !input.userAnswer?.trim()) {
          throw new Error('learningItem and userAnswer are required.');
        }

        const { parsed, rawText } = await callProviderJson<EvaluateRecallAnswerResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You are a rigorous recall evaluator. Return strict JSON only and score conservatively.',
            },
            {
              role: 'user',
              content: evaluateRecallPrompt(input.learningItem, input.userAnswer),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.2,
          900,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'learningSession',
          targetId: input.learningItem.id ?? `recall:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: {
            recall: parsed.score,
          },
          feedback: parsed.feedback,
          recommendations: [parsed.suggestedNextStep, ...parsed.missingPoints].filter(Boolean),
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const evaluateSpeechTranscript = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<EvaluateSpeechTranscriptInput, EvaluateSpeechTranscriptResult>(
      request,
      response,
      'evaluateSpeechTranscript',
      async (userId, input) => {
        if (!input.prompt?.trim() || !input.transcript?.trim()) {
          throw new Error('prompt and transcript are required.');
        }

        const { parsed, rawText } = await callProviderJson<EvaluateSpeechTranscriptResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You evaluate speech performance. Return strict JSON only and use integer scores from 1 to 5.',
            },
            {
              role: 'user',
              content: evaluateSpeechPrompt(input.prompt, input.transcript),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.2,
          1200,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'speechSession',
          targetId: `speech:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: parsed.scores,
          feedback: parsed.feedback,
          recommendations: parsed.improvementTasks,
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const evaluateDecisionAttempt = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<EvaluateDecisionAttemptInput, EvaluateDecisionAttemptResult>(
      request,
      response,
      'evaluateDecisionAttempt',
      async (userId, input) => {
        if (!input.scenario?.prompt?.trim() || !input.userDecision?.trim() || !input.reasoning?.trim()) {
          throw new Error('scenario, userDecision, and reasoning are required.');
        }

        const { parsed, rawText } = await callProviderJson<EvaluateDecisionAttemptResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You evaluate leadership decisions. Return strict JSON only and use integer scores from 1 to 5.',
            },
            {
              role: 'user',
              content: evaluateDecisionPrompt(
                input.scenario,
                input.userDecision,
                input.reasoning,
              ),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.2,
          1400,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'decisionAttempt',
          targetId: input.scenario.id ?? `decision:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: parsed.scores,
          feedback: parsed.feedback,
          recommendations: [parsed.alternativeDecision, ...parsed.risksMissed].filter(Boolean),
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const generateDecisionScenario = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<GenerateDecisionScenarioInput, GenerateDecisionScenarioResult>(
      request,
      response,
      'generateDecisionScenario',
      async (userId, input) => {
        const { parsed, rawText } = await callProviderJson<GenerateDecisionScenarioResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You generate realistic decision scenarios for serious leadership practice. Return strict JSON only.',
            },
            {
              role: 'user',
              content: generateDecisionScenarioPrompt(input),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.5,
          1200,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'decisionAttempt',
          targetId: `scenario:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: {
            difficulty: parsed.difficulty,
          },
          feedback: parsed.summary,
          recommendations: parsed.stakes,
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const evaluateFormationReflection = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<EvaluateFormationReflectionInput, EvaluateFormationReflectionResult>(
      request,
      response,
      'evaluateFormationReflection',
      async (userId, input) => {
        if (!input.taskTitle?.trim() || !input.coreIdea?.trim() || !input.userAnswer?.trim()) {
          throw new Error('taskTitle, coreIdea, and userAnswer are required.');
        }

        const { parsed, rawText } = await callProviderJson<EvaluateFormationReflectionResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You evaluate executive formation work. Return strict JSON only and use integer scores from 1 to 5.',
            },
            {
              role: 'user',
              content: evaluateFormationReflectionPrompt(input),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.2,
          1200,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'formationDailyTask',
          targetId: `formation-task:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: { score: parsed.score },
          feedback: parsed.summary,
          recommendations: [...parsed.revisionAdvice, parsed.recommendedNextStep].filter(Boolean),
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const evaluateStructureAnalysis = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<EvaluateStructureAnalysisInput, EvaluateStructureAnalysisResult>(
      request,
      response,
      'evaluateStructureAnalysis',
      async (userId, input) => {
        if (!input.title?.trim() || !input.context?.trim() || !input.synthesis?.trim()) {
          throw new Error('title, context, and synthesis are required.');
        }

        const { parsed, rawText } = await callProviderJson<EvaluateStructureAnalysisResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You evaluate structure analysis work for executive usefulness. Return strict JSON only and use integer scores from 1 to 5.',
            },
            {
              role: 'user',
              content: evaluateStructureAnalysisPrompt(input),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.2,
          1300,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'formationStructureAnalysis',
          targetId: `structure-analysis:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: parsed.scores,
          feedback: parsed.feedback,
          recommendations: [...parsed.missingLayers, parsed.nextRevision].filter(Boolean),
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const evaluateDecisionMemo = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<EvaluateDecisionMemoInput, EvaluateDecisionMemoResult>(
      request,
      response,
      'evaluateDecisionMemo',
      async (userId, input) => {
        if (!input.title?.trim() || !input.decisionTitle?.trim() || !input.recommendedDecision?.trim()) {
          throw new Error('title, decisionTitle, and recommendedDecision are required.');
        }

        const { parsed, rawText } = await callProviderJson<EvaluateDecisionMemoResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You review executive decision memos. Return strict JSON only and score conservatively.',
            },
            {
              role: 'user',
              content: evaluateDecisionMemoPrompt(input),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.2,
          1600,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'formationDecisionMemo',
          targetId: `decision-memo:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: parsed.rubricScores,
          feedback: parsed.summary,
          recommendations: parsed.suggestedNextSteps,
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const evaluateExecutiveCommunication = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<EvaluateExecutiveCommunicationInput, EvaluateExecutiveCommunicationResult>(
      request,
      response,
      'evaluateExecutiveCommunication',
      async (userId, input) => {
        if (!input.sourceText?.trim() || !input.translatedOutput?.trim()) {
          throw new Error('sourceText and translatedOutput are required.');
        }

        const { parsed, rawText } = await callProviderJson<EvaluateExecutiveCommunicationResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You evaluate executive communication. Return strict JSON only and use integer scores from 1 to 5.',
            },
            {
              role: 'user',
              content: evaluateExecutiveCommunicationPrompt(input),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.2,
          1200,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'formationExecutiveCommunication',
          targetId: `executive-communication:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: parsed.scores,
          feedback: parsed.feedback,
          recommendations: parsed.revisionPoints,
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const generateDailyFormationTask = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<GenerateDailyFormationTaskInput, GenerateDailyFormationTaskResult>(
      request,
      response,
      'generateDailyFormationTask',
      async (userId, input) => {
        const { parsed, rawText } = await callProviderJson<GenerateDailyFormationTaskResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You generate practical executive formation tasks. Return strict JSON only. Avoid academic exercises.',
            },
            {
              role: 'user',
              content: generateDailyFormationTaskPrompt(input),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.4,
          1500,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'formationDailyTask',
          targetId: `generated-task:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: { difficulty: input.currentDifficultyLevel, xpReward: parsed.xpReward },
          feedback: parsed.openingFrame,
          recommendations: parsed.questions,
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);

export const generateWeeklyFormationReview = onRequest(
  { cors: true, secrets: [groqApiKey] },
  async (request, response) =>
    withAiRequest<GenerateWeeklyFormationReviewInput, GenerateWeeklyFormationReviewResult>(
      request,
      response,
      'generateWeeklyFormationReview',
      async (userId, input) => {
        const { parsed, rawText } = await callProviderJson<GenerateWeeklyFormationReviewResult>(
          'groq',
          [
            {
              role: 'system',
              content:
                'You generate serious weekly executive formation reviews. Return strict JSON only.',
            },
            {
              role: 'user',
              content: generateWeeklyFormationReviewPrompt(input),
            },
          ],
          input.model ?? DEFAULT_GROQ_MODEL,
          0.3,
          1400,
        );

        await storeAiEvaluation({
          userId,
          targetType: 'formationWeeklyReview',
          targetId: `weekly-review:${Date.now()}`,
          provider: 'groq',
          model: input.model ?? DEFAULT_GROQ_MODEL,
          promptVersion: PROMPT_VERSION,
          scoreSummary: { xpThisWeek: input.xpThisWeek },
          feedback: parsed.executiveSummary,
          recommendations: [parsed.nextWeekFocus, ...parsed.recommendedArtifacts].filter(Boolean),
          rawResponse: rawText,
        });

        return parsed;
      },
    ),
);
