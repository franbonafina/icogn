import {
  formationDecisionMemosRepository,
  formationPortfolioArtifactsRepository,
} from '@/lib/firebase/repositories';
import { getCurrentAppUser } from '@/lib/firebase/currentUser';
import type {
  AiFeedbackSummary,
  DecisionMemo,
  PortfolioArtifact,
} from '@/types/firestore';

export interface DecisionMemoLabFormData {
  moduleId: string;
  taskId?: string | null;
  title: string;
  decisionTitle: string;
  context: string;
  actorsInvolved: string[];
  interests: string[];
  dignityRecognitionAtStake: string;
  legalInstitutionalFrame: string;
  economicFrame: string;
  politicalFrame: string;
  operationalFrame: string;
  technologicalFrame: string;
  options: string[];
  decisionCriteria: string[];
  recommendedDecision: string;
  rejectedAlternatives: string[];
  risks: string[];
  evidenceThatCouldChangeDecision: string[];
  reviewMetrics30_60_90: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
  userReflection: string;
  relatedAuthors: string[];
  relatedConcepts: string[];
  primaryStructures: Array<
    | 'economic_structure'
    | 'legal_structure'
    | 'political_structure'
    | 'organizational_structure'
    | 'symbolic_structure'
    | 'operational_structure'
    | 'technological_structure'
  >;
  secondaryStructures: Array<
    | 'economic_structure'
    | 'legal_structure'
    | 'political_structure'
    | 'organizational_structure'
    | 'symbolic_structure'
    | 'operational_structure'
    | 'technological_structure'
  >;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface DecisionMemoScoreSet {
  clarity: number;
  judgment: number;
  structure: number;
  riskAwareness: number;
  executiveLanguage: number;
}

export interface DecisionMemoBadgeRule {
  id: string;
  title: string;
  description: string;
  condition: string;
}

export interface DecisionMemoLabComponentSpec {
  name: string;
  responsibility: string;
  primaryAction?: string;
}

export const decisionMemoLabComponents: DecisionMemoLabComponentSpec[] = [
  {
    name: 'DecisionMemoLabPage',
    responsibility: 'Top-level workspace, loading state, draft state, and submit flow.',
    primaryAction: 'Continue draft',
  },
  {
    name: 'DecisionMemoProgressHeader',
    responsibility: 'Shows memo title, draft/final status, XP potential, and save state.',
  },
  {
    name: 'DecisionMemoGuidedForm',
    responsibility: 'Guided form that renders the memo sections in sequence.',
  },
  {
    name: 'DecisionMemoFrameSection',
    responsibility: 'Collects context, actors, interests, dignity/recognition, and framing layers.',
  },
  {
    name: 'DecisionMemoOptionSection',
    responsibility: 'Collects options, decision criteria, recommended decision, and rejected alternatives.',
  },
  {
    name: 'DecisionMemoRiskSection',
    responsibility: 'Captures risks, change-of-decision evidence, and 30/60/90-day review metrics.',
  },
  {
    name: 'DecisionMemoReflectionSection',
    responsibility: 'Captures user reflection and ties the memo back to authors and concepts.',
  },
  {
    name: 'DecisionMemoAiReviewPanel',
    responsibility: 'Triggers AI review and displays scores for clarity, judgment, structure, risk awareness, and executive language.',
    primaryAction: 'Request AI feedback',
  },
  {
    name: 'DecisionMemoFooterActions',
    responsibility: 'Save draft, mark complete, and publish final memo to portfolio.',
    primaryAction: 'Save draft',
  },
];

export const decisionMemoScoringRubric = [
  {
    key: 'clarity',
    label: 'Clarity',
    description: 'Does the memo state the decision and its logic without ambiguity?',
  },
  {
    key: 'judgment',
    label: 'Judgment',
    description: 'Does the recommendation reflect executive tradeoff quality and seriousness?',
  },
  {
    key: 'structure',
    label: 'Structure',
    description: 'Does the memo reason across legal, economic, political, operational, and technological frames coherently?',
  },
  {
    key: 'riskAwareness',
    label: 'Risk awareness',
    description: 'Does the memo identify meaningful downside, uncertainty, and disconfirming evidence?',
  },
  {
    key: 'executiveLanguage',
    label: 'Executive language',
    description: 'Is the writing concise, high-signal, and suitable for leadership communication?',
  },
] as const;

export const decisionMemoBadgeRules: DecisionMemoBadgeRule[] = [
  {
    id: 'first-memo-shipped',
    title: 'First Memo Shipped',
    description: 'Awarded when the user completes and publishes the first decision memo.',
    condition: 'Publish 1 final decision memo to the portfolio.',
  },
  {
    id: 'clear-call',
    title: 'Clear Call',
    description: 'Awarded when a memo scores highly on clarity.',
    condition: 'Earn clarity >= 5 on a final memo.',
  },
  {
    id: 'cold-risk-reader',
    title: 'Cold Risk Reader',
    description: 'Awarded when a memo scores highly on risk awareness.',
    condition: 'Earn risk awareness >= 5 on a final memo.',
  },
  {
    id: 'multi-frame-operator',
    title: 'Multi-Frame Operator',
    description: 'Awarded when the memo uses structural frames with consistency.',
    condition: 'Complete 3 memos with structure >= 4.',
  },
  {
    id: 'executive-language',
    title: 'Executive Language',
    description: 'Awarded when the user consistently writes in strong executive style.',
    condition: 'Complete 3 memos with executive language >= 4.',
  },
];

export function buildDecisionMemoAiFeedbackPrompt(memo: DecisionMemoLabFormData) {
  return {
    systemPrompt:
      'You are an executive decision memo reviewer. Evaluate the memo for clarity, judgment, structural reasoning, risk awareness, and executive language. Be demanding, specific, and practical. Return structured JSON only.',
    userPrompt: `Review the following executive decision memo.

Decision title: ${memo.decisionTitle}
Context: ${memo.context}
Actors involved: ${memo.actorsInvolved.join(', ')}
Interests: ${memo.interests.join(', ')}
Dignity / recognition at stake: ${memo.dignityRecognitionAtStake}
Legal or institutional frame: ${memo.legalInstitutionalFrame}
Economic frame: ${memo.economicFrame}
Political frame: ${memo.politicalFrame}
Operational frame: ${memo.operationalFrame}
Technological frame: ${memo.technologicalFrame}
Options: ${memo.options.join(' | ')}
Decision criteria: ${memo.decisionCriteria.join(' | ')}
Recommended decision: ${memo.recommendedDecision}
Rejected alternatives: ${memo.rejectedAlternatives.join(' | ')}
Risks: ${memo.risks.join(' | ')}
Evidence that could change the decision: ${memo.evidenceThatCouldChangeDecision.join(' | ')}
30-day review metrics: ${memo.reviewMetrics30_60_90.day30.join(' | ')}
60-day review metrics: ${memo.reviewMetrics30_60_90.day60.join(' | ')}
90-day review metrics: ${memo.reviewMetrics30_60_90.day90.join(' | ')}
User reflection: ${memo.userReflection}

Return JSON with:
- summary
- strengths
- weaknesses
- suggestedNextSteps
- rubricScores: { clarity, judgment, structure, riskAwareness, executiveLanguage }`,
    rubric: decisionMemoScoringRubric.map((item) => item.description),
  };
}

function flattenMemoContent(input: DecisionMemoLabFormData) {
  return [
    `Decision title: ${input.decisionTitle}`,
    `Context: ${input.context}`,
    `Actors involved: ${input.actorsInvolved.join(', ')}`,
    `Interests: ${input.interests.join(', ')}`,
    `Dignity / recognition at stake: ${input.dignityRecognitionAtStake}`,
    `Legal or institutional frame: ${input.legalInstitutionalFrame}`,
    `Economic frame: ${input.economicFrame}`,
    `Political frame: ${input.politicalFrame}`,
    `Operational frame: ${input.operationalFrame}`,
    `Technological frame: ${input.technologicalFrame}`,
    `Options: ${input.options.join(' | ')}`,
    `Decision criteria: ${input.decisionCriteria.join(' | ')}`,
    `Recommended decision: ${input.recommendedDecision}`,
    `Rejected alternatives: ${input.rejectedAlternatives.join(' | ')}`,
    `Risks: ${input.risks.join(' | ')}`,
    `Evidence that could change the decision: ${input.evidenceThatCouldChangeDecision.join(' | ')}`,
    `30-day review metrics: ${input.reviewMetrics30_60_90.day30.join(' | ')}`,
    `60-day review metrics: ${input.reviewMetrics30_60_90.day60.join(' | ')}`,
    `90-day review metrics: ${input.reviewMetrics30_60_90.day90.join(' | ')}`,
    `Reflection: ${input.userReflection}`,
  ].join('\n\n');
}

function createEmptyAiFeedback(): AiFeedbackSummary | null {
  return null;
}

function toDecisionMemoUpdatePayload(
  draft: Omit<DecisionMemo, 'id'>,
  overrides: Partial<Omit<DecisionMemo, 'id' | 'createdAt'>> = {},
): Partial<Omit<DecisionMemo, 'id' | 'createdAt'>> {
  return {
    userId: draft.userId,
    title: draft.title,
    status: draft.status,
    moduleId: draft.moduleId,
    taskId: draft.taskId,
    decisionTitle: draft.decisionTitle,
    context: draft.context,
    actorsInvolved: draft.actorsInvolved,
    interests: draft.interests,
    dignityRecognitionAtStake: draft.dignityRecognitionAtStake,
    legalInstitutionalFrame: draft.legalInstitutionalFrame,
    economicFrame: draft.economicFrame,
    politicalFrame: draft.politicalFrame,
    operationalFrame: draft.operationalFrame,
    technologicalFrame: draft.technologicalFrame,
    options: draft.options,
    decisionCriteria: draft.decisionCriteria,
    recommendedDecision: draft.recommendedDecision,
    rejectedAlternatives: draft.rejectedAlternatives,
    risks: draft.risks,
    evidenceThatCouldChangeDecision: draft.evidenceThatCouldChangeDecision,
    reviewMetrics30_60_90: draft.reviewMetrics30_60_90,
    draftVersion: draft.draftVersion,
    finalArtifactId: draft.finalArtifactId,
    clarityScore: draft.clarityScore,
    judgmentScore: draft.judgmentScore,
    structureScore: draft.structureScore,
    riskAwarenessScore: draft.riskAwarenessScore,
    executiveLanguageScore: draft.executiveLanguageScore,
    decision: draft.decision,
    reasoning: draft.reasoning,
    expectedOutcome: draft.expectedOutcome,
    alternatives: draft.alternatives,
    recommendation: draft.recommendation,
    userReflection: draft.userReflection,
    relatedAuthors: draft.relatedAuthors,
    relatedConcepts: draft.relatedConcepts,
    primaryStructures: draft.primaryStructures,
    secondaryStructures: draft.secondaryStructures,
    score: draft.score,
    xpAwarded: draft.xpAwarded,
    aiFeedback: draft.aiFeedback,
    difficulty: draft.difficulty,
    unlockCondition: draft.unlockCondition,
    completedAt: draft.completedAt,
    ...overrides,
  };
}

export function createDecisionMemoDraftRecord(
  userId: string,
  input: DecisionMemoLabFormData,
): Omit<DecisionMemo, 'id'> {
  return {
    userId,
    title: input.title,
    status: 'draft',
    moduleId: input.moduleId,
    taskId: input.taskId ?? null,
    decisionTitle: input.decisionTitle,
    context: input.context,
    actorsInvolved: input.actorsInvolved,
    interests: input.interests,
    dignityRecognitionAtStake: input.dignityRecognitionAtStake,
    legalInstitutionalFrame: input.legalInstitutionalFrame,
    economicFrame: input.economicFrame,
    politicalFrame: input.politicalFrame,
    operationalFrame: input.operationalFrame,
    technologicalFrame: input.technologicalFrame,
    options: input.options,
    decisionCriteria: input.decisionCriteria,
    recommendedDecision: input.recommendedDecision,
    rejectedAlternatives: input.rejectedAlternatives,
    risks: input.risks,
    evidenceThatCouldChangeDecision: input.evidenceThatCouldChangeDecision,
    reviewMetrics30_60_90: input.reviewMetrics30_60_90,
    draftVersion: 1,
    finalArtifactId: null,
    clarityScore: null,
    judgmentScore: null,
    structureScore: null,
    riskAwarenessScore: null,
    executiveLanguageScore: null,
    decision: input.recommendedDecision,
    reasoning: [
      input.legalInstitutionalFrame,
      input.economicFrame,
      input.politicalFrame,
      input.operationalFrame,
      input.technologicalFrame,
    ]
      .filter(Boolean)
      .join('\n\n'),
    expectedOutcome: input.reviewMetrics30_60_90.day90.join(' | '),
    alternatives: input.options,
    recommendation: input.recommendedDecision,
    userReflection: input.userReflection,
    relatedAuthors: input.relatedAuthors,
    relatedConcepts: input.relatedConcepts,
    primaryStructures: input.primaryStructures,
    secondaryStructures: input.secondaryStructures,
    score: null,
    xpAwarded: 0,
    aiFeedback: createEmptyAiFeedback(),
    difficulty: input.difficulty,
    unlockCondition: null,
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  };
}

export async function saveDecisionMemoDraft(input: DecisionMemoLabFormData, memoId?: string) {
  const { userId } = await getCurrentAppUser();
  const draft = createDecisionMemoDraftRecord(userId, input);

  if (memoId) {
    const existing = await formationDecisionMemosRepository.getById(memoId);

    if (!existing) {
      throw new Error('Decision memo draft not found.');
    }

    await formationDecisionMemosRepository.update(
      memoId,
      toDecisionMemoUpdatePayload(draft, {
        draftVersion: existing.draftVersion + 1,
      }),
    );
    return formationDecisionMemosRepository.getById(memoId);
  }

  return formationDecisionMemosRepository.create(draft);
}

export async function finalizeDecisionMemo(
  memoId: string,
  scores: DecisionMemoScoreSet,
  aiFeedback: AiFeedbackSummary,
) {
  const memo = await formationDecisionMemosRepository.getById(memoId);

  if (!memo) {
    throw new Error('Decision memo not found.');
  }

  const averageScore =
    (scores.clarity +
      scores.judgment +
      scores.structure +
      scores.riskAwareness +
      scores.executiveLanguage) /
    5;

  await formationDecisionMemosRepository.update(memoId, {
    status: 'completed',
    clarityScore: scores.clarity,
    judgmentScore: scores.judgment,
    structureScore: scores.structure,
    riskAwarenessScore: scores.riskAwareness,
    executiveLanguageScore: scores.executiveLanguage,
    score: averageScore,
    xpAwarded: Math.round(40 + averageScore * 8),
    aiFeedback,
    completedAt: null as never,
  });

  return formationDecisionMemosRepository.getById(memoId);
}

export async function publishDecisionMemoToPortfolio(memoId: string) {
  const memo = await formationDecisionMemosRepository.getById(memoId);

  if (!memo) {
    throw new Error('Decision memo not found.');
  }

  const artifactPayload: Omit<PortfolioArtifact, 'id'> = {
    userId: memo.userId,
    title: memo.title,
    status: 'reviewed',
    moduleId: memo.moduleId,
    artifactType: 'memo',
    sourceType: 'decisionMemo',
    sourceId: memo.id,
    summary: memo.decisionTitle,
    content: flattenMemoContent({
      moduleId: memo.moduleId,
      taskId: memo.taskId,
      title: memo.title,
      decisionTitle: memo.decisionTitle,
      context: memo.context,
      actorsInvolved: memo.actorsInvolved,
      interests: memo.interests,
      dignityRecognitionAtStake: memo.dignityRecognitionAtStake,
      legalInstitutionalFrame: memo.legalInstitutionalFrame,
      economicFrame: memo.economicFrame,
      politicalFrame: memo.politicalFrame,
      operationalFrame: memo.operationalFrame,
      technologicalFrame: memo.technologicalFrame,
      options: memo.options,
      decisionCriteria: memo.decisionCriteria,
      recommendedDecision: memo.recommendedDecision,
      rejectedAlternatives: memo.rejectedAlternatives,
      risks: memo.risks,
      evidenceThatCouldChangeDecision: memo.evidenceThatCouldChangeDecision,
      reviewMetrics30_60_90: memo.reviewMetrics30_60_90,
      userReflection: memo.userReflection,
      relatedAuthors: memo.relatedAuthors,
      relatedConcepts: memo.relatedConcepts,
      primaryStructures: memo.primaryStructures,
      secondaryStructures: memo.secondaryStructures,
      difficulty: memo.difficulty,
    }),
    tags: ['decision-memo', ...memo.relatedConcepts],
    userReflection: memo.userReflection,
    relatedAuthors: memo.relatedAuthors,
    relatedConcepts: memo.relatedConcepts,
    primaryStructures: memo.primaryStructures,
    score: memo.score,
    xpAwarded: memo.xpAwarded,
    aiFeedback: memo.aiFeedback,
    difficulty: memo.difficulty,
    unlockCondition: memo.unlockCondition,
    visibility: 'private',
    completedAt: memo.completedAt,
    createdAt: null as never,
    updatedAt: null as never,
  };

  const artifact = await formationPortfolioArtifactsRepository.create(artifactPayload);

  await formationDecisionMemosRepository.update(memoId, {
    status: 'reviewed',
    finalArtifactId: artifact.id,
  });

  return artifact;
}
