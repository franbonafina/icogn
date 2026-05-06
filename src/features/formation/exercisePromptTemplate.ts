export type FormationExerciseOutputType =
  | 'structure_analysis'
  | 'decision_memo'
  | 'executive_translation'
  | 'commercial_diagnosis'
  | 'actor_interest_mapping'
  | 'conflict_interpretation'
  | 'strategic_positioning'
  | 'legal_risk_identification'
  | 'narrative_reframing'
  | 'founder_reflection';

export interface ExerciseGeneratorInput {
  currentMonth: number;
  currentWeek: number;
  currentAuthor: string;
  currentConcept: string;
  userProfile: string;
  previousUserAnswers: string[];
  currentDifficultyLevel: 1 | 2 | 3 | 4 | 5;
  desiredOutputType: FormationExerciseOutputType;
}

export interface GeneratedPracticalExercise {
  title: string;
  outputType: FormationExerciseOutputType;
  context: string;
  scenario: string;
  task: string;
  questions: string[];
  expectedOutput: string;
  evaluationCriteria: string[];
  xpReward: number;
  relatedConcepts: string[];
  suggestedTimeboxMinutes: number;
}

export function buildPracticalExercisePrompt(input: ExerciseGeneratorInput) {
  return `You are generating one practical exercise for the "Executive Formation Path" module.

The module trains a user moving from technical architect / solution consultant toward executive consultant and future founder.

This is not an academic course and not a classroom exercise.
The exercise must feel executive, practical, commercially relevant, and structurally intelligent.

Core rule:
- Think in structures, not systems.
- Prefer real company, market, institutional, consulting, or founder situations.
- Do not ask for generic summaries of theory.
- Do not produce abstract essay prompts unless they lead to a practical executive artifact.

Valid output types:
1. Structure Analysis
2. Decision Memo
3. Executive Translation
4. Commercial Diagnosis
5. Actor & Interest Mapping
6. Conflict Interpretation
7. Strategic Positioning
8. Legal Risk Identification
9. Narrative Reframing
10. Founder Reflection

Input:
- Current month: ${input.currentMonth}
- Current week: ${input.currentWeek}
- Current author: ${input.currentAuthor}
- Current concept: ${input.currentConcept}
- User profile: ${input.userProfile}
- Previous user answers:
${input.previousUserAnswers.length > 0 ? input.previousUserAnswers.map((answer, index) => `${index + 1}. ${answer}`).join('\n') : '- none'}
- Current difficulty level: ${input.currentDifficultyLevel}
- Desired output type: ${input.desiredOutputType}

Generation requirements:
- The exercise must be clearly linked to the current author and concept.
- The exercise must require judgment, translation, or structural interpretation.
- The exercise must be plausible for consulting, executive decision-making, market analysis, founder work, or organizational diagnosis.
- The exercise must not sound like a university exam.
- The exercise must produce a usable output such as a memo, map, diagnosis, positioning note, or executive brief.
- The difficulty should match the current level.
- If previous answers suggest a weakness, compensate by making the task target that weakness.

Return strict JSON only with this shape:
{
  "title": "string",
  "outputType": "structure_analysis | decision_memo | executive_translation | commercial_diagnosis | actor_interest_mapping | conflict_interpretation | strategic_positioning | legal_risk_identification | narrative_reframing | founder_reflection",
  "context": "string",
  "scenario": "string",
  "task": "string",
  "questions": ["string"],
  "expectedOutput": "string",
  "evaluationCriteria": ["string"],
  "xpReward": number,
  "relatedConcepts": ["string"],
  "suggestedTimeboxMinutes": number
}

Quality constraints:
- Context should be concise but concrete.
- Scenario should feel real.
- Task should be explicit and action-oriented.
- Questions should sharpen thinking, not repeat the task.
- Expected output should describe a professional deliverable.
- Evaluation criteria should measure executive usefulness, not academic vocabulary.
- XP reward should be proportional to difficulty and timebox.
- Suggested timebox should usually be between 15 and 45 minutes.`;
}

export const examplePracticalExercises: GeneratedPracticalExercise[] = [
  {
    title: 'Smith-based operating model bottleneck review',
    outputType: 'structure_analysis',
    context:
      'A mid-sized SaaS implementation company is growing quickly but delivery quality is becoming uneven across projects.',
    scenario:
      'The founder believes the problem is weak individual performance. You suspect the deeper issue is how work is divided across sales, solution design, implementation, and support.',
    task:
      'Analyze the operating model through the lens of Adam Smith and division of labor. Identify where specialization improves output and where it creates coordination drag.',
    questions: [
      'Which functions benefit from specialization and which require integrated judgment?',
      'Where is handoff friction destroying productivity?',
      'What structural redesign would improve throughput without increasing chaos?',
    ],
    expectedOutput:
      'A one-page executive structure analysis with diagnosis, bottlenecks, and one redesign recommendation.',
    evaluationCriteria: [
      'Correct use of division of labor as a structural lens',
      'Clear distinction between productivity gains and coordination costs',
      'Concrete organizational recommendation',
      'Executive clarity and concision',
    ],
    xpReward: 55,
    relatedConcepts: ['division of labor', 'productivity', 'coordination'],
    suggestedTimeboxMinutes: 30,
  },
  {
    title: 'Marx-based sector conflict interpretation',
    outputType: 'conflict_interpretation',
    context:
      'A company is introducing AI automation into internal operations and leadership frames it purely as efficiency improvement.',
    scenario:
      'Different groups inside the company are reacting differently: executives see margin improvement, managers fear loss of authority, and operational staff fear weakening career paths.',
    task:
      'Interpret the transformation through a Marx-inspired lens of structural conflict and uneven gains. Explain where interests align, where they diverge, and what contradiction leadership is underestimating.',
    questions: [
      'Who gains structurally from the change and who loses bargaining position?',
      'What conflict is being disguised as a technical modernization story?',
      'What executive response would reduce denial without collapsing the initiative?',
    ],
    expectedOutput:
      'A conflict interpretation note for leadership with stakeholder tensions, hidden contradictions, and one management implication.',
    evaluationCriteria: [
      'Recognizes structural conflict rather than superficial resistance',
      'Maps uneven gains across groups',
      'Connects theory to executive action',
      'Avoids ideological slogans and stays practically grounded',
    ],
    xpReward: 60,
    relatedConcepts: ['distribution', 'sector conflict', 'power'],
    suggestedTimeboxMinutes: 35,
  },
  {
    title: 'Hayek-based executive translation on decentralized knowledge',
    outputType: 'executive_translation',
    context:
      'A product leader wants to centralize most customer-facing decisions because they believe field teams are too inconsistent.',
    scenario:
      'You need to explain why full centralization may destroy valuable local knowledge while still preserving standards.',
    task:
      'Translate Hayek’s knowledge problem into executive language for a leadership team deciding how much authority to centralize.',
    questions: [
      'What knowledge exists locally that central teams cannot fully see in time?',
      'What decisions should remain decentralized?',
      'How would you explain the risk of over-centralization without sounding ideological?',
    ],
    expectedOutput:
      'A short executive brief that reframes dispersed knowledge into a practical operating decision.',
    evaluationCriteria: [
      'Accurate translation of Hayek into executive terms',
      'Strong distinction between standards and centralized control',
      'Useful language for leadership decision-making',
      'Clear and compressed communication',
    ],
    xpReward: 50,
    relatedConcepts: ['dispersed knowledge', 'coordination', 'decentralization'],
    suggestedTimeboxMinutes: 25,
  },
  {
    title: 'Clausewitz-based actor and interest map for a strategic account',
    outputType: 'actor_interest_mapping',
    context:
      'A consulting team is trying to close a high-value enterprise deal, but formal stakeholders and real power holders do not appear to be the same people.',
    scenario:
      'The account looks commercially attractive, but internal politics inside the client organization are making the sales process unstable.',
    task:
      'Use a Clausewitz-inspired lens of friction, center of gravity, and real versus formal power to map the actors and interests inside the account.',
    questions: [
      'Who is the formal decision-maker and who is the real center of gravity?',
      'Where is friction slowing the deal?',
      'Which actor can enable or block movement disproportionally?',
    ],
    expectedOutput:
      'An actor and interest map with power assessment, friction points, and one recommended engagement strategy.',
    evaluationCriteria: [
      'Maps power rather than only reporting org chart labels',
      'Identifies strategic leverage correctly',
      'Uses Clausewitz practically rather than metaphorically',
      'Produces a commercially useful recommendation',
    ],
    xpReward: 65,
    relatedConcepts: ['friction', 'center of gravity', 'strategic leverage'],
    suggestedTimeboxMinutes: 40,
  },
  {
    title: 'Drucker-based commercial diagnosis of a growing practice',
    outputType: 'commercial_diagnosis',
    context:
      'An independent advisory practice has strong technical credibility and good delivery outcomes but weak commercial growth.',
    scenario:
      'The founder keeps adding capabilities, but clients do not clearly understand why the offer matters or when to buy it.',
    task:
      'Diagnose the business using a Drucker-style management lens. Clarify what the business is actually for, who the customer is, and where the offer lacks strategic focus.',
    questions: [
      'What customer problem is truly being solved?',
      'What inside the business is capability accumulation without strategic discipline?',
      'What one change would improve the commercial posture most quickly?',
    ],
    expectedOutput:
      'A commercial diagnosis memo with customer definition, strategic confusion points, and one focused recommendation.',
    evaluationCriteria: [
      'Frames the diagnosis in terms of customer and purpose',
      'Distinguishes activity from strategic effectiveness',
      'Produces an executive-quality recommendation',
      'Uses practical rather than abstract management language',
    ],
    xpReward: 55,
    relatedConcepts: ['management by purpose', 'customer definition', 'focus'],
    suggestedTimeboxMinutes: 30,
  },
];

