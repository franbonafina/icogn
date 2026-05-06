import { getOrCreateAiSettings } from '@/features/settings/aiSettingsService';
import { callGroqJson } from '@/lib/ai/groqBrowser';
import type { AiFeedbackSummary } from '@/types/firestore';

import type { DailyLesson } from '@/features/formation/types';
import type { DecisionMemoLabFormData, DecisionMemoScoreSet } from '@/features/formation/decisionMemoLab';

export type FormationReflectionEvaluation = {
  score: 1 | 2 | 3 | 4 | 5;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  revisionAdvice: string[];
  recommendedNextStep: string;
};

export type FormationDecisionMemoEvaluation = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestedNextSteps: string[];
  rubricScores: DecisionMemoScoreSet;
};

function toAiFeedbackSummary(
  provider: 'groq' | 'openai' | 'anthropic',
  model: string,
  summary: string,
  strengths: string[],
  weaknesses: string[],
  suggestedNextSteps: string[],
  rubricScores: Record<string, number>,
): AiFeedbackSummary {
  return {
    provider,
    model,
    summary,
    strengths,
    weaknesses,
    suggestedNextSteps,
    rubricScores,
    generatedAt: null,
  };
}

function decisionMemoScoresToRecord(scores: DecisionMemoScoreSet) {
  return {
    clarity: scores.clarity,
    judgment: scores.judgment,
    structure: scores.structure,
    riskAwareness: scores.riskAwareness,
    executiveLanguage: scores.executiveLanguage,
  };
}

function mockEvaluateFormationReflection(
  lesson: DailyLesson,
  userAnswer: string,
): FormationReflectionEvaluation {
  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  const score = wordCount > 140 ? 4 : wordCount > 60 ? 3 : 2;

  return {
    score,
    summary:
      'Fallback formation review used because the authenticated backend evaluator was unavailable. The response can still be saved and improved.',
    strengths: [
      `The answer stays anchored to "${lesson.title}".`,
      'The user is attempting practical translation rather than pure summary.',
    ],
    weaknesses: [
      'The answer can be more concrete about business or institutional consequences.',
      'The structure can be tighter and more executive in tone.',
    ],
    revisionAdvice: [
      'Name one real company, market, or internal operating situation.',
      'State one decision implication in a short concluding sentence.',
    ],
    recommendedNextStep: 'Tighten the answer, then complete the daily task to keep the streak alive.',
  };
}

export async function evaluateFormationReflectionWithFunction(
  lesson: DailyLesson,
  userAnswer: string,
  userReflection: string,
) {
  const settings = await getOrCreateAiSettings();

  if (settings.provider !== 'groq') {
    return {
      evaluation: mockEvaluateFormationReflection(lesson, userAnswer),
      aiFeedback: toAiFeedbackSummary(
        settings.provider,
        settings.modelName,
        'Fallback formation review used.',
        ['The response was captured successfully.'],
        ['Backend AI evaluation was unavailable.'],
        ['Retry once authenticated backend evaluation is available.'],
        { score: 2 },
      ),
    };
  }

  try {
    const { parsed: evaluation } = await callGroqJson<FormationReflectionEvaluation>(
      [
        {
          role: 'system',
          content:
            'You evaluate executive formation work. Return strict JSON only and use integer scores from 1 to 5.',
        },
        {
          role: 'user',
          content: [
            'Evaluate a daily executive formation response.',
            'Return strict JSON only.',
            'Schema: {"score":1-5,"summary":"...","strengths":["..."],"weaknesses":["..."],"revisionAdvice":["..."],"recommendedNextStep":"..."}',
            `Task title: ${lesson.title}`,
            `Opening frame:\n${lesson.openingFrame}`,
            `Core idea:\n${lesson.coreIdea}`,
            `Practical translation:\n${lesson.practicalTranslation}`,
            `Practice prompt:\n${lesson.practice.prompt}`,
            `User answer:\n${userAnswer}`,
            userReflection ? `User reflection:\n${userReflection}` : '',
          ]
            .filter(Boolean)
            .join('\n\n'),
        },
      ],
      settings.modelName,
      settings.temperature,
      settings.maxTokens,
    );

    return {
      evaluation,
      aiFeedback: toAiFeedbackSummary(
        settings.provider,
        settings.modelName,
        evaluation.summary,
        evaluation.strengths,
        evaluation.weaknesses,
        [evaluation.recommendedNextStep, ...evaluation.revisionAdvice].filter(Boolean),
        { score: evaluation.score },
      ),
    };
  } catch {
    const fallback = mockEvaluateFormationReflection(lesson, userAnswer);
    return {
      evaluation: fallback,
      aiFeedback: toAiFeedbackSummary(
        settings.provider,
        settings.modelName,
        fallback.summary,
        fallback.strengths,
        fallback.weaknesses,
        [fallback.recommendedNextStep, ...fallback.revisionAdvice],
        { score: fallback.score },
      ),
    };
  }
}

function mockEvaluateDecisionMemo(input: DecisionMemoLabFormData): FormationDecisionMemoEvaluation {
  const structureCount = [
    input.legalInstitutionalFrame,
    input.economicFrame,
    input.politicalFrame,
    input.operationalFrame,
    input.technologicalFrame,
  ].filter((value) => value.trim().length > 0).length;

  const base = structureCount >= 5 ? 4 : 3;

  return {
    summary:
      'Fallback memo review used because the authenticated backend evaluator was unavailable. The memo still has enough structure to save as a draft.',
    strengths: [
      'The memo is framed as a real executive call rather than a generic essay.',
      'The core decision and surrounding constraints are visible.',
    ],
    weaknesses: [
      'The recommendation can be shorter and more decisive.',
      'The rejected alternatives and risks can be more explicit.',
    ],
    suggestedNextSteps: [
      'Compress the recommendation into one firm paragraph.',
      'Add one piece of disconfirming evidence that would reverse the call.',
    ],
    rubricScores: {
      clarity: base,
      judgment: base,
      structure: Math.min(5, base + 1),
      riskAwareness: base,
      executiveLanguage: base,
    },
  };
}

export async function evaluateDecisionMemoWithFunction(input: DecisionMemoLabFormData) {
  const settings = await getOrCreateAiSettings();

  if (settings.provider !== 'groq') {
    const evaluation = mockEvaluateDecisionMemo(input);
    return {
      evaluation,
      aiFeedback: toAiFeedbackSummary(
        settings.provider,
        settings.modelName,
        evaluation.summary,
        evaluation.strengths,
        evaluation.weaknesses,
        evaluation.suggestedNextSteps,
        decisionMemoScoresToRecord(evaluation.rubricScores),
      ),
    };
  }

  try {
    const { parsed: evaluation } = await callGroqJson<FormationDecisionMemoEvaluation>(
      [
        {
          role: 'system',
          content:
            'You review executive decision memos. Return strict JSON only and score conservatively.',
        },
        {
          role: 'user',
          content: [
            'Evaluate an executive decision memo.',
            'Return strict JSON only.',
            'Schema: {"summary":"...","strengths":["..."],"weaknesses":["..."],"suggestedNextSteps":["..."],"rubricScores":{"clarity":1-5,"judgment":1-5,"structure":1-5,"riskAwareness":1-5,"executiveLanguage":1-5}}',
            `Memo title: ${input.title}`,
            `Decision title: ${input.decisionTitle}`,
            `Context:\n${input.context}`,
            `Actors involved: ${input.actorsInvolved.join(', ')}`,
            `Interests: ${input.interests.join(', ')}`,
            `Dignity / recognition at stake: ${input.dignityRecognitionAtStake}`,
            `Legal or institutional frame:\n${input.legalInstitutionalFrame}`,
            `Economic frame:\n${input.economicFrame}`,
            `Political frame:\n${input.politicalFrame}`,
            `Operational frame:\n${input.operationalFrame}`,
            `Technological frame:\n${input.technologicalFrame}`,
            `Options: ${input.options.join(' | ')}`,
            `Decision criteria: ${input.decisionCriteria.join(' | ')}`,
            `Recommended decision:\n${input.recommendedDecision}`,
            `Rejected alternatives: ${input.rejectedAlternatives.join(' | ')}`,
            `Risks: ${input.risks.join(' | ')}`,
            `Evidence that could change the decision: ${input.evidenceThatCouldChangeDecision.join(' | ')}`,
            `30-day review metrics: ${input.reviewMetrics30_60_90.day30.join(' | ')}`,
            `60-day review metrics: ${input.reviewMetrics30_60_90.day60.join(' | ')}`,
            `90-day review metrics: ${input.reviewMetrics30_60_90.day90.join(' | ')}`,
            input.userReflection ? `User reflection:\n${input.userReflection}` : '',
          ]
            .filter(Boolean)
            .join('\n\n'),
        },
      ],
      settings.modelName,
      settings.temperature,
      settings.maxTokens,
    );

    return {
      evaluation,
      aiFeedback: toAiFeedbackSummary(
        settings.provider,
        settings.modelName,
        evaluation.summary,
        evaluation.strengths,
        evaluation.weaknesses,
        evaluation.suggestedNextSteps,
        decisionMemoScoresToRecord(evaluation.rubricScores),
      ),
    };
  } catch {
    const evaluation = mockEvaluateDecisionMemo(input);
    return {
      evaluation,
      aiFeedback: toAiFeedbackSummary(
        settings.provider,
        settings.modelName,
        evaluation.summary,
        evaluation.strengths,
        evaluation.weaknesses,
        evaluation.suggestedNextSteps,
        decisionMemoScoresToRecord(evaluation.rubricScores),
      ),
    };
  }
}
