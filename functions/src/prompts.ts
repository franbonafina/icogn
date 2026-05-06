export const PROMPT_VERSION = 'v1';
export const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';

export function extractLearningItemsPrompt(rawText: string, preferredType?: string, tags?: string[]) {
  return [
    'Convert the source text into learning item drafts.',
    'Return strict JSON only.',
    'Top-level schema: {"items":[{"title","type","content","explanation","tags","difficulty","suggestedLearningMode"}]}',
    'Allowed type values: term, concept, quote, principle, framework, case.',
    'Allowed suggestedLearningMode values: spaced_repetition, active_recall, interleaving, deliberate_practice.',
    'Difficulty must be an integer from 1 to 5.',
    preferredType ? `Preferred type: ${preferredType}` : '',
    tags?.length ? `Preferred tags: ${tags.join(', ')}` : '',
    `Source text:\n${rawText}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function evaluateRecallPrompt(learningItem: {
  title: string;
  type: string;
  content: string;
  explanation?: string;
  tags?: string[];
}, userAnswer: string) {
  return [
    'Evaluate a recall answer.',
    'Return strict JSON only.',
    'Schema: {"score":0-5,"feedback":"...","missingPoints":["..."],"suggestedNextStep":"..."}',
    `Learning item title: ${learningItem.title}`,
    `Type: ${learningItem.type}`,
    `Reference content:\n${learningItem.content}`,
    learningItem.explanation ? `Explanation:\n${learningItem.explanation}` : '',
    learningItem.tags?.length ? `Tags: ${learningItem.tags.join(', ')}` : '',
    `User answer:\n${userAnswer}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function evaluateSpeechPrompt(prompt: string, transcript: string) {
  return [
    'Evaluate a speech transcript against the prompt.',
    'Return strict JSON only.',
    'Schema: {"scores":{"clarity":1-5,"structure":1-5,"argumentation":1-5,"persuasion":1-5,"confidence":1-5,"concision":1-5},"feedback":"...","improvementTasks":["..."]}',
    `Prompt:\n${prompt}`,
    `Transcript:\n${transcript}`,
  ].join('\n\n');
}

export function evaluateDecisionPrompt(scenario: {
  title?: string;
  summary?: string;
  prompt: string;
  context?: string;
  stakes?: string[];
}, userDecision: string, reasoning: string) {
  return [
    'Evaluate a decision attempt.',
    'Return strict JSON only.',
    'Schema: {"scores":{"clarity":1-5,"riskAwareness":1-5,"tradeoffQuality":1-5,"ethicalReasoning":1-5,"strategicThinking":1-5,"actionability":1-5},"feedback":"...","alternativeDecision":"...","risksMissed":["..."]}',
    scenario.title ? `Scenario title: ${scenario.title}` : '',
    scenario.summary ? `Scenario summary:\n${scenario.summary}` : '',
    `Scenario prompt:\n${scenario.prompt}`,
    scenario.context ? `Context:\n${scenario.context}` : '',
    scenario.stakes?.length ? `Stakes: ${scenario.stakes.join(', ')}` : '',
    `User decision:\n${userDecision}`,
    `Reasoning:\n${reasoning}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function generateDecisionScenarioPrompt(input: {
  topic?: string;
  difficulty?: number;
  tags?: string[];
  context?: string;
}) {
  return [
    'Generate a realistic decision-making scenario for leadership training.',
    'Return strict JSON only.',
    'Schema: {"title":"...","summary":"...","context":"...","prompt":"...","stakes":["..."],"tags":["..."],"difficulty":1-5}',
    input.topic ? `Topic: ${input.topic}` : 'Topic: leadership judgment',
    typeof input.difficulty === 'number' ? `Difficulty: ${input.difficulty}` : '',
    input.tags?.length ? `Tags: ${input.tags.join(', ')}` : '',
    input.context ? `Context:\n${input.context}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function evaluateFormationReflectionPrompt(input: {
  taskTitle: string;
  openingFrame: string;
  coreIdea: string;
  practicalTranslation: string;
  practicePrompt: string;
  userAnswer: string;
  userReflection?: string;
}) {
  return [
    'Evaluate a daily executive formation response.',
    'Return strict JSON only.',
    'Schema: {"score":1-5,"summary":"...","strengths":["..."],"weaknesses":["..."],"revisionAdvice":["..."],"recommendedNextStep":"..."}',
    `Task title: ${input.taskTitle}`,
    `Opening frame:\n${input.openingFrame}`,
    `Core idea:\n${input.coreIdea}`,
    `Practical translation:\n${input.practicalTranslation}`,
    `Practice prompt:\n${input.practicePrompt}`,
    `User answer:\n${input.userAnswer}`,
    input.userReflection ? `User reflection:\n${input.userReflection}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function evaluateStructureAnalysisPrompt(input: {
  title: string;
  context: string;
  economicLayer: string;
  legalLayer: string;
  politicalLayer: string;
  organizationalLayer: string;
  symbolicLayer: string;
  operationalLayer: string;
  technologicalLayer: string;
  synthesis: string;
}) {
  return [
    'Evaluate a structure analysis for executive usefulness.',
    'Return strict JSON only.',
    'Schema: {"scores":{"clarity":1-5,"structuralCoverage":1-5,"judgment":1-5,"executiveUsefulness":1-5,"riskAwareness":1-5},"feedback":"...","missingLayers":["..."],"nextRevision":"..."}',
    `Title: ${input.title}`,
    `Context:\n${input.context}`,
    `Economic layer:\n${input.economicLayer}`,
    `Legal layer:\n${input.legalLayer}`,
    `Political layer:\n${input.politicalLayer}`,
    `Organizational layer:\n${input.organizationalLayer}`,
    `Symbolic layer:\n${input.symbolicLayer}`,
    `Operational layer:\n${input.operationalLayer}`,
    `Technological layer:\n${input.technologicalLayer}`,
    `Synthesis:\n${input.synthesis}`,
  ].join('\n\n');
}

export function evaluateDecisionMemoPrompt(input: {
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
  userReflection?: string;
}) {
  return [
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
    .join('\n\n');
}

export function evaluateExecutiveCommunicationPrompt(input: {
  sourceText: string;
  targetAudience: string;
  targetFormat: string;
  translatedOutput: string;
}) {
  return [
    'Evaluate an executive translation or communication output.',
    'Return strict JSON only.',
    'Schema: {"scores":{"clarity":1-5,"compression":1-5,"audienceFit":1-5,"persuasiveForce":1-5,"executiveTone":1-5},"feedback":"...","revisionPoints":["..."]}',
    `Source text:\n${input.sourceText}`,
    `Target audience: ${input.targetAudience}`,
    `Target format: ${input.targetFormat}`,
    `Translated output:\n${input.translatedOutput}`,
  ].join('\n\n');
}

export function generateDailyFormationTaskPrompt(input: {
  currentMonth: number;
  currentWeek: number;
  currentAuthor: string;
  currentConcept: string;
  userProfile: string;
  previousUserAnswers: string[];
  currentDifficultyLevel: number;
  desiredOutputType: string;
}) {
  return [
    'Generate one serious practical exercise for the Executive Formation Path.',
    'Return strict JSON only.',
    'Schema: {"title":"...","openingFrame":"...","coreIdea":"...","practicalTranslation":"...","task":"...","questions":["..."],"expectedOutput":"...","evaluationCriteria":["..."],"xpReward":number,"relatedConcepts":["..."],"suggestedTimeboxMinutes":number}',
    `Current month: ${input.currentMonth}`,
    `Current week: ${input.currentWeek}`,
    `Current author: ${input.currentAuthor}`,
    `Current concept: ${input.currentConcept}`,
    `User profile:\n${input.userProfile}`,
    input.previousUserAnswers.length
      ? `Previous user answers:\n${input.previousUserAnswers.join('\n\n---\n\n')}`
      : '',
    `Current difficulty level: ${input.currentDifficultyLevel}`,
    `Desired output type: ${input.desiredOutputType}`,
    'The exercise must be practical, executive, and structurally grounded rather than academic.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function generateWeeklyFormationReviewPrompt(input: {
  weekNumber: number;
  monthNumber: number;
  completedTaskSummaries: string[];
  xpThisWeek: number;
  strongestSignals: string[];
  weakPatterns: string[];
  userGoal: string;
}) {
  return [
    'Generate a weekly executive formation review.',
    'Return strict JSON only.',
    'Schema: {"title":"...","executiveSummary":"...","strongestInsights":["..."],"weakestPatterns":["..."],"nextWeekFocus":"...","recommendedArtifacts":["..."]}',
    `Month number: ${input.monthNumber}`,
    `Week number: ${input.weekNumber}`,
    `Completed task summaries:\n${input.completedTaskSummaries.join('\n- ')}`,
    `XP this week: ${input.xpThisWeek}`,
    `Strongest signals: ${input.strongestSignals.join(' | ')}`,
    `Weak patterns: ${input.weakPatterns.join(' | ')}`,
    `User goal: ${input.userGoal}`,
    'The output must sound serious, practical, and oriented to judgment development.',
  ].join('\n\n');
}
