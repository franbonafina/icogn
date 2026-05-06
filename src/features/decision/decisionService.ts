import { getOrCreateAiSettings } from '@/features/settings/aiSettingsService';
import { callGroqJson } from '@/lib/ai/groqBrowser';
import { decisionAttemptsRepository, decisionScenariosRepository } from '@/lib/firebase/repositories';
import { getFirebaseAuth } from '@/lib/firebase/auth';
import { recordDecisionAttemptInProfileMemory } from '@/features/profile/profileMemoryService';
import type {
  DecisionAttempt,
  DecisionAttemptScores,
  DecisionScenario,
} from '@/types/firestore';

export type ScenarioType =
  | 'leadership'
  | 'business'
  | 'civic'
  | 'ethical'
  | 'technical/product'
  | 'crisis';

export type DecisionScenarioDraft = {
  title: string;
  summary: string;
  context: string;
  prompt: string;
  constraints: string[];
  stakeholders: string[];
  availableOptions: string[];
  hiddenRisks: string[];
  evaluationRubric: string[];
  stakes: string[];
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
};

export type DecisionEvaluationResult = {
  scores: DecisionAttemptScores;
  feedback: string;
  alternativeDecision: string;
  risksMissed: string[];
};

const scenarioTemplates: Record<ScenarioType, DecisionScenarioDraft> = {
  leadership: {
    title: 'Underperforming senior manager',
    summary: 'A respected senior manager is slipping, but removing them may destabilize the team.',
    context:
      'You lead a critical function entering a demanding quarter. One senior manager has lost execution sharpness, but still carries trust with long-tenured staff.',
    prompt:
      'What decision do you make about the manager, and how do you protect both performance and internal trust?',
    constraints: [
      'You must act within 14 days.',
      'Morale is already fragile.',
      'There is no immediate successor fully ready.',
    ],
    stakeholders: ['Executive team', 'Senior manager', 'Team members', 'HR'],
    availableOptions: [
      'Immediate removal and interim replacement',
      'Structured performance plan with weekly checkpoints',
      'Role redesign to reduce scope and buy time',
    ],
    hiddenRisks: [
      'Other managers may read indecision as tolerance for drift.',
      'A rushed removal may trigger political backlash and talent loss.',
    ],
    evaluationRubric: [
      'Show clarity and ownership.',
      'Recognize second-order morale and precedent effects.',
      'Balance compassion with execution standards.',
    ],
    stakes: ['Team trust', 'Operational performance', 'Leadership credibility'],
    tags: ['leadership'],
    difficulty: 4,
  },
  business: {
    title: 'Margin pressure vs growth bet',
    summary: 'Revenue is growing, but margins are compressing. Finance wants cuts while product wants more investment.',
    context:
      'Your company has momentum in the market, but profitability is deteriorating. The board expects a coherent path within the quarter.',
    prompt:
      'What do you prioritize, what do you defer, and how do you explain the tradeoff?',
    constraints: [
      'Board review in 10 days.',
      'Only one major initiative can be funded this quarter.',
      'Layoffs are politically costly.',
    ],
    stakeholders: ['Board', 'Finance', 'Product', 'Commercial teams'],
    availableOptions: [
      'Cut costs aggressively',
      'Double down on core growth line',
      'Pause new bets and consolidate operations',
    ],
    hiddenRisks: [
      'Short-term margin fixes can damage future competitiveness.',
      'Overconfidence in growth can erode financial discipline.',
    ],
    evaluationRubric: [
      'Explicit tradeoff reasoning.',
      'Financial realism.',
      'Actionable sequencing.',
    ],
    stakes: ['Profitability', 'Growth trajectory', 'Board confidence'],
    tags: ['business'],
    difficulty: 4,
  },
  civic: {
    title: 'Transit reform backlash',
    summary: 'A necessary transit reform improves efficiency but hurts a vocal district in the short term.',
    context:
      'You advise on a public policy rollout where the technically correct move creates immediate public resistance and media scrutiny.',
    prompt:
      'Do you proceed, modify the rollout, or delay it? Defend the choice publicly.',
    constraints: [
      'Budget pressure is real.',
      'Election cycle is approaching.',
      'A partial rollback is still possible this month.',
    ],
    stakeholders: ['Citizens', 'Transit workers', 'Local officials', 'Media'],
    availableOptions: [
      'Proceed on schedule',
      'Phase the reform by district',
      'Delay and renegotiate implementation',
    ],
    hiddenRisks: [
      'Delay may destroy reform credibility.',
      'Proceeding without narrative discipline can trigger avoidable outrage.',
    ],
    evaluationRubric: [
      'Public legitimacy matters, not just technical correctness.',
      'Consider sequencing and communication.',
      'Show realistic civic tradeoffs.',
    ],
    stakes: ['Public trust', 'Service quality', 'Political capital'],
    tags: ['civic'],
    difficulty: 4,
  },
  ethical: {
    title: 'High performer with hidden misconduct',
    summary: 'A high performer is driving results, but you receive credible signs of serious misconduct.',
    context:
      'The individual is central to an important initiative, and exposing the issue may trigger major disruption.',
    prompt:
      'What do you do now, and what principle governs your response?',
    constraints: [
      'Evidence is credible but incomplete.',
      'Delay increases exposure.',
      'Immediate action may compromise a major deliverable.',
    ],
    stakeholders: ['Affected staff', 'Leadership', 'Customers', 'Legal'],
    availableOptions: [
      'Suspend immediately pending review',
      'Quietly investigate before acting',
      'Reassign temporarily while facts are established',
    ],
    hiddenRisks: [
      'Quiet handling can be perceived as moral compromise.',
      'Overreaction without process can create fairness concerns.',
    ],
    evaluationRubric: [
      'Ethical clarity.',
      'Procedural fairness.',
      'Institutional trust preservation.',
    ],
    stakes: ['Integrity', 'Legal risk', 'Cultural precedent'],
    tags: ['ethical'],
    difficulty: 5,
  },
  'technical/product': {
    title: 'Ship date vs platform stability',
    summary: 'A strategic product launch is near, but the platform team warns of brittle infrastructure.',
    context:
      'Commercial pressure is intense, but technical debt could turn launch success into operational failure.',
    prompt:
      'Do you ship, narrow scope, or delay? Explain your reasoning to both commercial and engineering stakeholders.',
    constraints: [
      'A public date has been signaled.',
      'Engineering capacity is limited.',
      'A partial release is possible.',
    ],
    stakeholders: ['Engineering', 'Product', 'Sales', 'Customers'],
    availableOptions: [
      'Ship on time as planned',
      'Reduce scope and harden core flows',
      'Delay launch to stabilize platform',
    ],
    hiddenRisks: [
      'Scope cuts may still leave core instability unresolved.',
      'Delay can create trust issues externally if not framed well.',
    ],
    evaluationRubric: [
      'Systems thinking.',
      'Technical risk awareness.',
      'Actionability under constraints.',
    ],
    stakes: ['Reliability', 'Customer trust', 'Execution discipline'],
    tags: ['technical', 'product'],
    difficulty: 4,
  },
  crisis: {
    title: 'Operational incident with incomplete facts',
    summary: 'A serious incident is unfolding, but verified information is partial and time pressure is extreme.',
    context:
      'Executives, customers, and internal teams need direction. The wrong first move can amplify harm.',
    prompt:
      'What is your immediate decision, what do you communicate, and what do you explicitly avoid doing too early?',
    constraints: [
      'You have 30 minutes for first response.',
      'Facts are incomplete.',
      'Stakeholders expect visible control.',
    ],
    stakeholders: ['Customers', 'Executives', 'Ops teams', 'Public/press'],
    availableOptions: [
      'Pause operations broadly',
      'Contain a limited surface area first',
      'Communicate before acting operationally',
    ],
    hiddenRisks: [
      'Premature certainty can destroy credibility.',
      'Overcontainment can create unnecessary secondary damage.',
    ],
    evaluationRubric: [
      'Composure under uncertainty.',
      'Risk containment logic.',
      'Clear action sequencing.',
    ],
    stakes: ['Safety', 'Trust', 'Operational continuity'],
    tags: ['crisis'],
    difficulty: 5,
  },
};

const demoUserId = 'demo-user';

async function getCurrentDecisionUser() {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser ?? null;

  if (!user) {
    return {
      userId: demoUserId,
      token: null,
    };
  }

  return {
    userId: user.uid,
    token: await user.getIdToken(),
  };
}

export function getScenarioTemplate(type: ScenarioType) {
  return scenarioTemplates[type];
}

export async function generateScenario(type: ScenarioType) {
  const template = getScenarioTemplate(type);
  const settings = await getOrCreateAiSettings();

  if (settings.provider !== 'groq') {
    return template;
  }

  try {
    const { parsed: generated } = await callGroqJson<Partial<DecisionScenarioDraft>>(
      [
        {
          role: 'system',
          content:
            'You generate realistic decision scenarios for serious leadership practice. Return strict JSON only.',
        },
        {
          role: 'user',
          content: [
            'Generate a realistic decision-making scenario for leadership training.',
            'Return strict JSON only.',
            'Schema: {"title":"...","summary":"...","context":"...","prompt":"...","constraints":["..."],"stakeholders":["..."],"availableOptions":["..."],"hiddenRisks":["..."],"evaluationRubric":["..."],"stakes":["..."],"tags":["..."],"difficulty":1-5}',
            `Topic: ${type}`,
            `Difficulty: ${template.difficulty}`,
            `Tags: ${template.tags.join(', ')}`,
            `Context:\n${template.context}`,
          ].join('\n\n'),
        },
      ],
      settings.modelName,
      settings.temperature,
      settings.maxTokens,
    );

    return {
      ...template,
      ...generated,
      constraints: generated.constraints ?? template.constraints,
      stakeholders: generated.stakeholders ?? template.stakeholders,
      availableOptions: generated.availableOptions ?? template.availableOptions,
      hiddenRisks: generated.hiddenRisks ?? template.hiddenRisks,
      evaluationRubric: generated.evaluationRubric ?? template.evaluationRubric,
      stakes: generated.stakes ?? template.stakes,
      tags: generated.tags ?? template.tags,
      difficulty: generated.difficulty ?? template.difficulty,
    };
  } catch {
    return template;
  }
}

export function mockEvaluateDecisionAttempt(
  scenario: DecisionScenarioDraft,
  userDecision: string,
  reasoning: string,
  risksConsidered: string,
  expectedOutcome: string,
): DecisionEvaluationResult {
  const combined = `${userDecision} ${reasoning} ${risksConsidered} ${expectedOutcome}`.toLowerCase();
  const mentionsRisk = combined.includes('risk') || combined.includes('tradeoff');
  const mentionsStakeholder = scenario.stakeholders.some((stakeholder) =>
    combined.includes(stakeholder.toLowerCase().split(' ')[0] ?? ''),
  );

  return {
    scores: {
      clarity: userDecision.length > 80 ? 4 : 3,
      riskAwareness: mentionsRisk ? 4 : 2,
      tradeoffQuality: mentionsRisk ? 4 : 3,
      ethicalReasoning: mentionsStakeholder ? 4 : 3,
      strategicThinking: reasoning.length > 140 ? 4 : 3,
      actionability: expectedOutcome.length > 50 ? 4 : 3,
    },
    feedback:
      'Fallback decision evaluation used because the authenticated backend evaluator was unavailable. The structure still surfaces decision quality, tradeoffs, and execution clarity.',
    alternativeDecision:
      'Narrow the initial move, define an explicit review checkpoint, and communicate a reversible path with stakeholder safeguards.',
    risksMissed: scenario.hiddenRisks.slice(0, 2),
  };
}

export async function evaluateDecisionAttemptWithFunction(
  scenario: DecisionScenarioDraft,
  userDecision: string,
  reasoning: string,
  risksConsidered: string,
  expectedOutcome: string,
) {
  const settings = await getOrCreateAiSettings();

  if (settings.provider !== 'groq') {
    return mockEvaluateDecisionAttempt(
      scenario,
      userDecision,
      reasoning,
      risksConsidered,
      expectedOutcome,
    );
  }

  try {
    const { parsed } = await callGroqJson<DecisionEvaluationResult>(
      [
        {
          role: 'system',
          content:
            'You evaluate leadership decisions. Return strict JSON only and use integer scores from 1 to 5.',
        },
        {
          role: 'user',
          content: [
            'Evaluate a decision attempt.',
            'Return strict JSON only.',
            'Schema: {"scores":{"clarity":1-5,"riskAwareness":1-5,"tradeoffQuality":1-5,"ethicalReasoning":1-5,"strategicThinking":1-5,"actionability":1-5},"feedback":"...","alternativeDecision":"...","risksMissed":["..."]}',
            `Scenario title: ${scenario.title}`,
            `Scenario summary:\n${scenario.summary}`,
            `Scenario prompt:\n${scenario.prompt}`,
            `Context:\n${[
              scenario.context,
              `Constraints: ${scenario.constraints.join('; ')}`,
              `Stakeholders: ${scenario.stakeholders.join('; ')}`,
              `Available options: ${scenario.availableOptions.join('; ')}`,
            ].join('\n\n')}`,
            `Stakes: ${scenario.stakes.join(', ')}`,
            `User decision:\n${userDecision}`,
            `Reasoning:\n${[
              reasoning,
              `Risks considered: ${risksConsidered}`,
              `Expected outcome: ${expectedOutcome}`,
            ].join('\n\n')}`,
          ].join('\n\n'),
        },
      ],
      settings.modelName,
      settings.temperature,
      settings.maxTokens,
    );

    return parsed;
  } catch {
    return mockEvaluateDecisionAttempt(
      scenario,
      userDecision,
      reasoning,
      risksConsidered,
      expectedOutcome,
    );
  }
}

export async function saveScenario(type: ScenarioType, scenario: DecisionScenarioDraft) {
  const payload: Omit<DecisionScenario, 'id'> = {
    title: scenario.title,
    summary: scenario.summary,
    context: scenario.context,
    prompt: scenario.prompt,
    constraints: scenario.constraints,
    stakeholders: scenario.stakeholders,
    availableOptions: scenario.availableOptions,
    hiddenRisks: scenario.hiddenRisks,
    evaluationRubric: scenario.evaluationRubric,
    stakes: scenario.stakes,
    tags: Array.from(new Set([type, ...scenario.tags])),
    difficulty: scenario.difficulty,
    createdAt: null as never,
    updatedAt: null as never,
  };

  return decisionScenariosRepository.create(payload);
}

export async function saveDecisionAttempt(
  scenarioId: string,
  scenarioTitle: string,
  scenarioTags: string[],
  userDecision: string,
  reasoning: string,
  risksConsidered: string,
  expectedOutcome: string,
  evaluation: DecisionEvaluationResult,
) {
  const { userId } = await getCurrentDecisionUser();

  const payload: Omit<DecisionAttempt, 'id'> = {
    userId,
    scenarioId,
    userDecision,
    reasoning,
    risksConsidered,
    expectedOutcome,
    scores: evaluation.scores,
    feedback: evaluation.feedback,
    alternativeDecision: evaluation.alternativeDecision,
    risksMissed: evaluation.risksMissed,
    createdAt: null as never,
    updatedAt: null as never,
  };

  const attempt = await decisionAttemptsRepository.create(payload);

  await recordDecisionAttemptInProfileMemory({
    userId,
    scenarioTitle,
    tags: scenarioTags,
    scores: evaluation.scores,
    feedback: evaluation.feedback,
    risksMissed: evaluation.risksMissed,
  });

  return attempt;
}
