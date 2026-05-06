export type FormationXpCategory =
  | 'reading_completed'
  | 'reflection_submitted'
  | 'practice_exercise_completed'
  | 'decision_memo_completed'
  | 'structure_analysis_completed'
  | 'ai_feedback_reviewed'
  | 'weekly_review_completed'
  | 'monthly_artifact_completed'
  | 'public_post_drafted'
  | 'commercial_artifact_completed';

export type FormationLevelLabel =
  | 'Technical Executor'
  | 'Analytical Operator'
  | 'Structure Reader'
  | 'Decision Practitioner'
  | 'Strategic Consultant'
  | 'Executive Communicator'
  | 'Commercial Operator'
  | 'Founder-in-Formation'
  | 'Structure Conductor'
  | 'Executive Builder';

export type FormationBadgeCategory =
  | 'consistency'
  | 'reading'
  | 'reflection'
  | 'decision'
  | 'structure'
  | 'communication'
  | 'commercial'
  | 'portfolio'
  | 'author_completion'
  | 'concept_mastery';

export type FormationMasteryCategory =
  | 'author_completion'
  | 'concept_mastery'
  | 'reflection_quality'
  | 'practice_depth'
  | 'decision_quality'
  | 'communication_quality'
  | 'structure_reading';

export interface FormationXpRule {
  category: FormationXpCategory;
  baseXp: number;
  qualityBonusMax: number;
  streakBonusMax: number;
  capPerDay: number;
  note: string;
}

export interface FormationLevelThreshold {
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  label: FormationLevelLabel;
  minXp: number;
  maxXp: number | null;
  description: string;
}

export interface FormationBadgeDefinition {
  id: string;
  title: string;
  category: FormationBadgeCategory;
  description: string;
  unlockCondition: string;
  seriousnessNote: string;
}

export interface FormationUnlockDefinition {
  moduleSlug: string;
  title: string;
  unlockCondition: string;
  rationale: string;
}

export interface FormationStreakState {
  currentStreakDays: number;
  longestStreakDays: number;
  lastQualifiedActivityDate: string | null;
  recoveryCredits: number;
}

export interface FormationRecoveryMechanic {
  rule: string;
  creditCap: number;
  earnCondition: string;
  consumeCondition: string;
}

export interface FormationMasteryScore {
  category: FormationMasteryCategory;
  score: number;
  label: string;
  interpretation: string;
}

export interface FormationProgressDashboard {
  totalXp: number;
  currentLevel: FormationLevelThreshold;
  nextLevel: FormationLevelThreshold | null;
  streak: FormationStreakState;
  weeklyConsistencyRankLabel: string;
  unlockedModules: string[];
  earnedBadges: string[];
  completedAuthors: number;
  completedConcepts: number;
  completedPortfolioArtifacts: number;
  masteryScores: FormationMasteryScore[];
  weeklyCompletionRate: number;
  monthlyMilestoneCompletionRate: number;
}

export interface FormationAntiCheatingRule {
  id: string;
  title: string;
  description: string;
}

export interface FormationUiCopySet {
  xpLabel: string;
  levelLabel: string;
  streakLabel: string;
  weeklyRankLabel: string;
  recoveryLabel: string;
  portfolioLabel: string;
  masteryLabel: string;
}

export const formationXpRules: FormationXpRule[] = [
  {
    category: 'reading_completed',
    baseXp: 12,
    qualityBonusMax: 0,
    streakBonusMax: 4,
    capPerDay: 2,
    note: 'Reading earns modest XP. It matters, but output matters more.',
  },
  {
    category: 'reflection_submitted',
    baseXp: 18,
    qualityBonusMax: 12,
    streakBonusMax: 5,
    capPerDay: 2,
    note: 'Reflection is rewarded when it shows depth, not just completion.',
  },
  {
    category: 'practice_exercise_completed',
    baseXp: 24,
    qualityBonusMax: 16,
    streakBonusMax: 6,
    capPerDay: 2,
    note: 'Practice is a core progression loop and should carry meaningful weight.',
  },
  {
    category: 'decision_memo_completed',
    baseXp: 40,
    qualityBonusMax: 20,
    streakBonusMax: 8,
    capPerDay: 1,
    note: 'Decision memos are high-value artifacts and should be rewarded accordingly.',
  },
  {
    category: 'structure_analysis_completed',
    baseXp: 42,
    qualityBonusMax: 22,
    streakBonusMax: 8,
    capPerDay: 1,
    note: 'Multi-frame structure reading is a core executive skill and should have high XP value.',
  },
  {
    category: 'ai_feedback_reviewed',
    baseXp: 10,
    qualityBonusMax: 4,
    streakBonusMax: 2,
    capPerDay: 3,
    note: 'Reviewing feedback matters, but passive clicking should not dominate XP growth.',
  },
  {
    category: 'weekly_review_completed',
    baseXp: 45,
    qualityBonusMax: 15,
    streakBonusMax: 8,
    capPerDay: 1,
    note: 'Weekly synthesis is a serious progression event.',
  },
  {
    category: 'monthly_artifact_completed',
    baseXp: 90,
    qualityBonusMax: 30,
    streakBonusMax: 10,
    capPerDay: 1,
    note: 'Monthly artifacts represent compounding development and should carry major XP.',
  },
  {
    category: 'public_post_drafted',
    baseXp: 28,
    qualityBonusMax: 14,
    streakBonusMax: 4,
    capPerDay: 1,
    note: 'Public synthesis matters because it tests clarity and position-taking.',
  },
  {
    category: 'commercial_artifact_completed',
    baseXp: 55,
    qualityBonusMax: 20,
    streakBonusMax: 8,
    capPerDay: 1,
    note: 'Commercial outputs test real executive translation and should be strongly rewarded.',
  },
];

export const formationLevelThresholds: FormationLevelThreshold[] = [
  {
    level: 1,
    label: 'Technical Executor',
    minXp: 0,
    maxXp: 149,
    description: 'Acts well inside known tasks but still reads most situations narrowly.',
  },
  {
    level: 2,
    label: 'Analytical Operator',
    minXp: 150,
    maxXp: 349,
    description: 'Begins to connect analysis to business and institutional context.',
  },
  {
    level: 3,
    label: 'Structure Reader',
    minXp: 350,
    maxXp: 649,
    description: 'Starts reading situations through structural lenses rather than isolated events.',
  },
  {
    level: 4,
    label: 'Decision Practitioner',
    minXp: 650,
    maxXp: 999,
    description: 'Produces decisions with better tradeoff quality and clearer judgment.',
  },
  {
    level: 5,
    label: 'Strategic Consultant',
    minXp: 1000,
    maxXp: 1499,
    description: 'Can translate theory into strategic advice and executive framing.',
  },
  {
    level: 6,
    label: 'Executive Communicator',
    minXp: 1500,
    maxXp: 2149,
    description: 'Communicates complex ideas in a compressed, credible, executive form.',
  },
  {
    level: 7,
    label: 'Commercial Operator',
    minXp: 2150,
    maxXp: 2899,
    description: 'Links structural insight to offers, positioning, and practical value capture.',
  },
  {
    level: 8,
    label: 'Founder-in-Formation',
    minXp: 2900,
    maxXp: 3899,
    description: 'Thinks increasingly like an operator building a durable economic position.',
  },
  {
    level: 9,
    label: 'Structure Conductor',
    minXp: 3900,
    maxXp: 5199,
    description: 'Coordinates across structures, incentives, actors, and narratives with maturity.',
  },
  {
    level: 10,
    label: 'Executive Builder',
    minXp: 5200,
    maxXp: null,
    description: 'Produces integrated judgment, commercial language, and durable executive artifacts.',
  },
];

export const formationBadgeList: FormationBadgeDefinition[] = [
  {
    id: 'first-week-held',
    title: 'First Week Held',
    category: 'consistency',
    description: 'Complete a full week of formation activity.',
    unlockCondition: '7-day qualified streak',
    seriousnessNote: 'Signals discipline, not novelty.',
  },
  {
    id: 'reader-of-structures',
    title: 'Reader of Structures',
    category: 'structure',
    description: 'Complete three strong structure analysis outputs.',
    unlockCondition: '3 structure analyses with average score >= 4',
    seriousnessNote: 'Measures interpretive maturity.',
  },
  {
    id: 'memo-under-pressure',
    title: 'Memo Under Pressure',
    category: 'decision',
    description: 'Ship a high-quality decision memo.',
    unlockCondition: '1 completed decision memo with average score >= 4',
    seriousnessNote: 'Rewards quality of judgment, not volume.',
  },
  {
    id: 'executive-language',
    title: 'Executive Language',
    category: 'communication',
    description: 'Demonstrate strong compression and executive communication.',
    unlockCondition: '3 communication outputs with executive language >= 4',
    seriousnessNote: 'Signals language discipline.',
  },
  {
    id: 'smith-completed',
    title: 'Smith Completed',
    category: 'author_completion',
    description: 'Finish the Adam Smith study segment and related exercises.',
    unlockCondition: 'Complete all Smith-linked lessons and one related artifact',
    seriousnessNote: 'Tracks author completion as formation, not consumption.',
  },
  {
    id: 'concept-integrator',
    title: 'Concept Integrator',
    category: 'concept_mastery',
    description: 'Show repeated concept mastery across multiple lessons.',
    unlockCondition: 'Reach concept mastery >= 80 in 5 concepts',
    seriousnessNote: 'Rewards durable understanding.',
  },
  {
    id: 'commercial-translator',
    title: 'Commercial Translator',
    category: 'commercial',
    description: 'Produce a strong commercial artifact from abstract material.',
    unlockCondition: 'Complete 2 commercial artifacts with average score >= 4',
    seriousnessNote: 'Tests whether ideas become market-relevant output.',
  },
  {
    id: 'portfolio-builder',
    title: 'Portfolio Builder',
    category: 'portfolio',
    description: 'Build a serious portfolio of executive artifacts.',
    unlockCondition: 'Publish 5 portfolio artifacts',
    seriousnessNote: 'Rewards accumulation of reusable work.',
  },
  {
    id: 'reflection-with-weight',
    title: 'Reflection With Weight',
    category: 'reflection',
    description: 'Consistently submit reflective work with depth.',
    unlockCondition: 'Average reflection quality >= 4 across 5 reflections',
    seriousnessNote: 'Prevents shallow journaling from dominating progression.',
  },
  {
    id: 'month-held',
    title: 'Month Held',
    category: 'consistency',
    description: 'Complete one monthly milestone and stay active through the cycle.',
    unlockCondition: 'Complete 1 monthly artifact and 3 weekly reviews in the same month',
    seriousnessNote: 'Measures sustained effort over time.',
  },
];

export const formationUnlockDefinitions: FormationUnlockDefinition[] = [
  {
    moduleSlug: 'month-2-institutions-and-knowledge',
    title: 'Month 2 unlock',
    unlockCondition: 'Complete 70% of Month 1 daily tasks and 1 weekly review',
    rationale: 'Advancement should require real continuity, not only a single output.',
  },
  {
    moduleSlug: 'decision-memo-lab',
    title: 'Decision Memo Lab unlock',
    unlockCondition: 'Reach Level 4 or complete 2 guided decision tasks',
    rationale: 'Decision memos should open after some structural reading discipline exists.',
  },
  {
    moduleSlug: 'structure-analysis-lab',
    title: 'Structure Analysis Lab unlock',
    unlockCondition: 'Reach Level 3 and complete 2 reflection exercises',
    rationale: 'The user should first show interpretive readiness.',
  },
  {
    moduleSlug: 'executive-communication-lab',
    title: 'Executive Communication Lab unlock',
    unlockCondition: 'Reach Level 5 or complete 3 AI-reviewed practice outputs',
    rationale: 'Communication practice should follow some prior conceptual grounding.',
  },
  {
    moduleSlug: 'founder-positioning-track',
    title: 'Founder Positioning unlock',
    unlockCondition: 'Reach Level 7 and complete 2 commercial artifacts',
    rationale: 'Founder work should unlock after strategic and commercial maturity starts appearing.',
  },
];

export const formationAntiCheatingRules: FormationAntiCheatingRule[] = [
  {
    id: 'minimum-output-length',
    title: 'Minimum output threshold',
    description: 'Do not award quality XP if reflection or exercise output is below a meaningful length threshold.',
  },
  {
    id: 'duplicate-submission-detection',
    title: 'Duplicate submission detection',
    description: 'Reduce or deny XP for repeated near-identical submissions across lessons or exercises.',
  },
  {
    id: 'daily-category-cap',
    title: 'Category XP cap',
    description: 'Each XP category has a daily cap to prevent farming low-value actions.',
  },
  {
    id: 'feedback-review-delay',
    title: 'Feedback review dwell rule',
    description: 'Only award AI feedback review XP if the user spends a minimum review interval before marking it reviewed.',
  },
  {
    id: 'artifact-finalization-gate',
    title: 'Artifact finalization gate',
    description: 'Portfolio XP only counts when the artifact is marked complete and has passed review or minimum quality score.',
  },
  {
    id: 'streak-qualification-rule',
    title: 'Qualified streak day',
    description: 'A streak day only counts if the user completes at least one meaningful action, not only a read-open event.',
  },
];

export const formationRecoveryMechanic: FormationRecoveryMechanic = {
  rule: 'Missed days do not instantly zero out momentum if the user has earned recovery credits through sustained consistency.',
  creditCap: 2,
  earnCondition: 'Earn 1 recovery credit for each 14-day qualified streak, up to 2.',
  consumeCondition: 'If exactly one day is missed, one recovery credit can preserve the streak.',
};

export const formationSampleUiCopy: FormationUiCopySet = {
  xpLabel: 'Formation XP',
  levelLabel: 'Current formation level',
  streakLabel: 'Consistency streak',
  weeklyRankLabel: 'This week you rank in the top band for consistency, not competition.',
  recoveryLabel: 'Recovery credits protect continuity after rare missed days.',
  portfolioLabel: 'Portfolio progress',
  masteryLabel: 'Mastery signals show where discipline is becoming durable.',
};

export const formationProgressDashboardSpec = {
  cards: [
    'XP and current level',
    'Current streak and recovery credits',
    'Weekly consistency rank',
    'Unlocked modules',
    'Recent badges',
    'Portfolio milestone progress',
    'Author completion',
    'Concept mastery',
    'Practice depth',
    'Reflection quality',
  ],
  tone: [
    'quiet',
    'serious',
    'no competitive spectacle',
    'focused on cumulative development',
  ],
  rankingModel:
    'Weekly rank should measure consistency and completion quality inside the user’s own path or private cohort, not public leaderboard competition.',
} as const;

export function getFormationLevelForXp(totalXp: number) {
  return (
    formationLevelThresholds.find((level) => {
      const upperBound = level.maxXp ?? Number.POSITIVE_INFINITY;
      return totalXp >= level.minXp && totalXp <= upperBound;
    }) ?? formationLevelThresholds[0]
  );
}

export function getNextFormationLevel(totalXp: number) {
  const currentLevel = getFormationLevelForXp(totalXp);
  return formationLevelThresholds.find((level) => level.level === currentLevel.level + 1) ?? null;
}

export function isQualifiedStreakDay(completedXpCategories: FormationXpCategory[]) {
  return completedXpCategories.some((category) =>
    category !== 'reading_completed' ? true : completedXpCategories.length > 1,
  );
}

