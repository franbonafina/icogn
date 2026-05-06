export type ProviderName = 'groq' | 'openai' | 'anthropic';

export type CompleteTask = 'generateText' | 'evaluate';

export type CompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type LearningItemDraft = {
  title: string;
  type: 'term' | 'concept' | 'quote' | 'principle' | 'framework' | 'case';
  content: string;
  explanation: string;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  suggestedLearningMode:
    | 'spaced_repetition'
    | 'active_recall'
    | 'interleaving'
    | 'deliberate_practice';
};

export type ExtractLearningItemsInput = {
  rawText: string;
  preferredType?: LearningItemDraft['type'];
  tags?: string[];
  model?: string;
};

export type EvaluateRecallAnswerInput = {
  learningItem: {
    id?: string;
    title: string;
    type: string;
    content: string;
    explanation?: string;
    tags?: string[];
  };
  userAnswer: string;
  model?: string;
};

export type EvaluateRecallAnswerResult = {
  score: 0 | 1 | 2 | 3 | 4 | 5;
  feedback: string;
  missingPoints: string[];
  suggestedNextStep: string;
};

export type EvaluateSpeechTranscriptInput = {
  prompt: string;
  transcript: string;
  model?: string;
};

export type EvaluateSpeechTranscriptResult = {
  scores: {
    clarity: number;
    structure: number;
    argumentation: number;
    persuasion: number;
    confidence: number;
    concision: number;
  };
  feedback: string;
  improvementTasks: string[];
};

export type EvaluateDecisionAttemptInput = {
  scenario: {
    id?: string;
    title?: string;
    summary?: string;
    prompt: string;
    context?: string;
    stakes?: string[];
  };
  userDecision: string;
  reasoning: string;
  model?: string;
};

export type EvaluateDecisionAttemptResult = {
  scores: {
    clarity: number;
    riskAwareness: number;
    tradeoffQuality: number;
    ethicalReasoning: number;
    strategicThinking: number;
    actionability: number;
  };
  feedback: string;
  alternativeDecision: string;
  risksMissed: string[];
};

export type GenerateDecisionScenarioInput = {
  topic?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  context?: string;
  model?: string;
};

export type GenerateDecisionScenarioResult = {
  title: string;
  summary: string;
  context: string;
  prompt: string;
  stakes: string[];
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
};

export type EvaluateFormationReflectionInput = {
  taskTitle: string;
  openingFrame: string;
  coreIdea: string;
  practicalTranslation: string;
  practicePrompt: string;
  userAnswer: string;
  userReflection?: string;
  model?: string;
};

export type EvaluateFormationReflectionResult = {
  score: 1 | 2 | 3 | 4 | 5;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  revisionAdvice: string[];
  recommendedNextStep: string;
};

export type EvaluateStructureAnalysisInput = {
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
  model?: string;
};

export type EvaluateStructureAnalysisResult = {
  scores: {
    clarity: number;
    structuralCoverage: number;
    judgment: number;
    executiveUsefulness: number;
    riskAwareness: number;
  };
  feedback: string;
  missingLayers: string[];
  nextRevision: string;
};

export type EvaluateDecisionMemoInput = {
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
  model?: string;
};

export type EvaluateDecisionMemoResult = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestedNextSteps: string[];
  rubricScores: {
    clarity: number;
    judgment: number;
    structure: number;
    riskAwareness: number;
    executiveLanguage: number;
  };
};

export type EvaluateExecutiveCommunicationInput = {
  sourceText: string;
  targetAudience: string;
  targetFormat: string;
  translatedOutput: string;
  model?: string;
};

export type EvaluateExecutiveCommunicationResult = {
  scores: {
    clarity: number;
    compression: number;
    audienceFit: number;
    persuasiveForce: number;
    executiveTone: number;
  };
  feedback: string;
  revisionPoints: string[];
};

export type GenerateDailyFormationTaskInput = {
  currentMonth: number;
  currentWeek: number;
  currentAuthor: string;
  currentConcept: string;
  userProfile: string;
  previousUserAnswers: string[];
  currentDifficultyLevel: 1 | 2 | 3 | 4 | 5;
  desiredOutputType: string;
  model?: string;
};

export type GenerateDailyFormationTaskResult = {
  title: string;
  openingFrame: string;
  coreIdea: string;
  practicalTranslation: string;
  task: string;
  questions: string[];
  expectedOutput: string;
  evaluationCriteria: string[];
  xpReward: number;
  relatedConcepts: string[];
  suggestedTimeboxMinutes: number;
};

export type GenerateWeeklyFormationReviewInput = {
  weekNumber: number;
  monthNumber: number;
  completedTaskSummaries: string[];
  xpThisWeek: number;
  strongestSignals: string[];
  weakPatterns: string[];
  userGoal: string;
  model?: string;
};

export type GenerateWeeklyFormationReviewResult = {
  title: string;
  executiveSummary: string;
  strongestInsights: string[];
  weakestPatterns: string[];
  nextWeekFocus: string;
  recommendedArtifacts: string[];
};

export type GenericGenerateTextInput = {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
};

export type GenericGenerateTextResult = {
  provider: ProviderName;
  model: string;
  text: string;
  metadata?: Record<string, unknown>;
};

export type GenericEvaluationInput = {
  rubric: string;
  userAnswer: string;
  context: string;
  expectedOutput?: string;
  model: string;
};

export type GenericEvaluationResult = {
  provider: ProviderName;
  model: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  rawText: string;
};

export type AiEvaluationRecord = {
  userId: string;
  targetType:
    | 'learningSession'
    | 'speechSession'
    | 'decisionAttempt'
    | 'profileMemory'
    | 'formationDailyTask'
    | 'formationDecisionMemo'
    | 'formationWeeklyReview'
    | 'formationStructureAnalysis'
    | 'formationExecutiveCommunication';
  targetId: string;
  provider: ProviderName;
  model: string;
  promptVersion: string;
  scoreSummary: Record<string, number>;
  feedback: string;
  recommendations: string[];
  rawResponse: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};
