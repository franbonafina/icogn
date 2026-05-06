export type ProgressionMapBlueprint = {
  monthIndex: number;
  slug: string;
  title: string;
  theme: string;
  coreQuestion: string;
  authors: string[];
  concepts: string[];
  targetArtifact: string;
  quarterLabel: string;
};

export type ProgressionMapMonthCardData = {
  monthIndex: number;
  quarterLabel: string;
  title: string;
  coreQuestion: string;
  status: 'locked' | 'active' | 'completed';
  progressPercentage: number;
  authorsCovered: string[];
  conceptsMastered: string[];
  exercisesCompleted: number;
  portfolioArtifactStatus: 'not_started' | 'in_progress' | 'completed';
  xpEarned: number;
  badgesUnlocked: string[];
  targetArtifact: string;
};

export const progressionMapBlueprints: ProgressionMapBlueprint[] = [
  {
    monthIndex: 1,
    slug: 'month-1-classical-political-economy',
    title: 'Classical Political Economy',
    theme: 'Value, productivity, distribution, conflict',
    coreQuestion: 'How do productive structures create value, rent, and conflict across actors?',
    authors: ['Adam Smith', 'David Ricardo', 'Karl Marx'],
    concepts: ['division of labor', 'productivity', 'value', 'rent', 'distribution'],
    targetArtifact: 'Strategic memo on value and structural conflict',
    quarterLabel: 'Quarter I',
  },
  {
    monthIndex: 2,
    slug: 'month-2-austrian-coordination',
    title: 'Coordination and Discovery',
    theme: 'Subjective value, information, entrepreneurship',
    coreQuestion: 'How does coordination emerge when knowledge is dispersed and value is subjective?',
    authors: ['Carl Menger', 'Ludwig von Mises', 'Friedrich Hayek', 'Israel Kirzner'],
    concepts: ['subjective value', 'knowledge problem', 'alertness', 'coordination'],
    targetArtifact: 'Market reading brief on discovery and asymmetry',
    quarterLabel: 'Quarter I',
  },
  {
    monthIndex: 3,
    slug: 'month-3-macro-instability',
    title: 'Macro Instability and Political Order',
    theme: 'Demand, uncertainty, legitimacy, mass organization',
    coreQuestion: 'How do uncertainty, demand, and legitimacy reshape executive and political choices?',
    authors: ['John Maynard Keynes', 'Juan Domingo Perón', 'Max Weber'],
    concepts: ['uncertainty', 'demand', 'legitimacy', 'organization'],
    targetArtifact: 'Decision note on macro pressure and institutional legitimacy',
    quarterLabel: 'Quarter I',
  },
  {
    monthIndex: 4,
    slug: 'month-4-knowledge-and-paradigms',
    title: 'Knowledge, Error, and Paradigm Shift',
    theme: 'Falsification, tacit knowledge, changing frames',
    coreQuestion: 'How do leaders decide when their model of reality is failing?',
    authors: ['Karl Popper', 'Thomas Kuhn', 'Michael Polanyi', 'Nassim Taleb'],
    concepts: ['falsifiability', 'paradigm shift', 'tacit knowledge', 'fragility'],
    targetArtifact: 'Executive review on model failure and decision reversibility',
    quarterLabel: 'Quarter II',
  },
  {
    monthIndex: 5,
    slug: 'month-5-recognition-and-genealogy',
    title: 'Recognition, Power, and Symbolic Order',
    theme: 'Recognition, values, discipline, symbolic power',
    coreQuestion: 'How do recognition, status, and institutional language shape real outcomes?',
    authors: ['Hegel', 'Nietzsche', 'Michel Foucault', 'Pierre Bourdieu', 'René Girard'],
    concepts: ['recognition', 'genealogy', 'discipline', 'field', 'mimesis'],
    targetArtifact: 'Power map of a company, market, or conflict',
    quarterLabel: 'Quarter II',
  },
  {
    monthIndex: 6,
    slug: 'month-6-conflict-and-strategy',
    title: 'Conflict, Friction, and Strategic Movement',
    theme: 'Conflict structure, asymmetry, tempo, pressure',
    coreQuestion: 'How do serious operators move under pressure, friction, and strategic conflict?',
    authors: ['Sun Tzu', 'Clausewitz', 'John Boyd'],
    concepts: ['friction', 'asymmetry', 'tempo', 'orientation'],
    targetArtifact: 'Conflict interpretation memo with action sequence',
    quarterLabel: 'Quarter II',
  },
  {
    monthIndex: 7,
    slug: 'month-7-management-and-execution',
    title: 'Management as Executive Function',
    theme: 'Responsibility, contribution, leverage, cadence',
    coreQuestion: 'What separates technical work from real executive management?',
    authors: ['Peter Drucker', 'Andy Grove'],
    concepts: ['contribution', 'leverage', 'cadence', 'effective executive'],
    targetArtifact: 'Operating memo on managerial leverage and priority',
    quarterLabel: 'Quarter III',
  },
  {
    monthIndex: 8,
    slug: 'month-8-competitive-structure',
    title: 'Competitive Structure and Position',
    theme: 'Industry structure, diagnosis, advantage',
    coreQuestion: 'How do you diagnose where a business can actually win?',
    authors: ['Michael Porter', 'Richard Rumelt', 'Clayton Christensen'],
    concepts: ['five forces', 'diagnosis', 'coherent action', 'disruption'],
    targetArtifact: 'Commercial strategy map with structural diagnosis',
    quarterLabel: 'Quarter III',
  },
  {
    monthIndex: 9,
    slug: 'month-9-executive-communication',
    title: 'Executive Communication and Persuasion',
    theme: 'Message hierarchy, influence, compressed clarity',
    coreQuestion: 'How do you compress complexity into language executives can act on?',
    authors: ['Barbara Minto', 'Robert Cialdini', 'Chris Voss'],
    concepts: ['pyramid principle', 'influence', 'tactical empathy'],
    targetArtifact: 'Executive memo and talk track pair',
    quarterLabel: 'Quarter III',
  },
  {
    monthIndex: 10,
    slug: 'month-10-market-language',
    title: 'Market Language and Positioning',
    theme: 'Category, offer, commercial framing',
    coreQuestion: 'How do you make a product or service legible to the market?',
    authors: ['April Dunford', 'Clayton Christensen', 'Robert Cialdini'],
    concepts: ['positioning', 'category design', 'market framing'],
    targetArtifact: 'Commercial positioning brief and offer reframing',
    quarterLabel: 'Quarter IV',
  },
  {
    monthIndex: 11,
    slug: 'month-11-decision-architecture',
    title: 'Decision Architecture',
    theme: 'Tradeoffs, evidence, risk, review loops',
    coreQuestion: 'What does a high-quality executive decision process look like under real constraints?',
    authors: ['Peter Drucker', 'Richard Rumelt', 'Nassim Taleb'],
    concepts: ['tradeoffs', 'review loops', 'evidence thresholds', 'downside discipline'],
    targetArtifact: 'Portfolio decision memo with 30/60/90 review logic',
    quarterLabel: 'Quarter IV',
  },
  {
    monthIndex: 12,
    slug: 'month-12-founder-synthesis',
    title: 'Founder Synthesis',
    theme: 'Integrating judgment, structure, communication, commerce',
    coreQuestion: 'How do you integrate structural reading into a founder-grade operating thesis?',
    authors: ['Peter Drucker', 'April Dunford', 'Andy Grove', 'Clausewitz'],
    concepts: ['operating thesis', 'strategic coherence', 'executive communication'],
    targetArtifact: 'Founder operating thesis and portfolio dossier',
    quarterLabel: 'Quarter IV',
  },
];

export const progressionMapComponentHierarchy = [
  'ProgressionMapPage',
  'ProgressionMapHeader',
  'ProgressionMapSummaryStrip',
  'ProgressionMapList',
  'ProgressionMapMonthCard',
  'ProgressionMapStatusPill',
  'ProgressionMapDesktopRail',
] as const;
