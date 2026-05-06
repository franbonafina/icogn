import type { StructureTag } from '@/types/firestore';

export type AuthorDiscipline =
  | 'political_economy'
  | 'economics'
  | 'philosophy'
  | 'sociology'
  | 'strategy'
  | 'management'
  | 'communication'
  | 'negotiation'
  | 'military_strategy'
  | 'political_theory';

export type AuthorPracticalUse =
  | 'market_analysis'
  | 'executive_judgment'
  | 'organizational_design'
  | 'founder_strategy'
  | 'commercial_positioning'
  | 'risk_management'
  | 'communication'
  | 'negotiation'
  | 'power_mapping'
  | 'institutional_analysis';

export interface AuthorLibraryBook {
  title: string;
  year?: number;
  note: string;
}

export interface AuthorLibraryExerciseReference {
  slug: string;
  title: string;
  outputType:
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
}

export interface AuthorProfile {
  id: string;
  slug: string;
  name: string;
  schoolOrTradition: string;
  disciplines: AuthorDiscipline[];
  practicalUses: AuthorPracticalUse[];
  historicalContext: string;
  mainWorks: AuthorLibraryBook[];
  coreConcepts: string[];
  practicalRelevance: string;
  keyWarningsOrLimitations: string[];
  relatedAuthors: string[];
  relatedExercises: AuthorLibraryExerciseReference[];
  recommendedOrderOfStudy: number;
  structureTags: StructureTag[];
  librarySummary: string;
}

export interface AuthorLibraryCardViewModel {
  title: string;
  subtitle: string;
  disciplines: string[];
  practicalUses: string[];
  coreConceptPreview: string[];
  relevanceSnippet: string;
}

export interface AuthorLibraryFilterState {
  discipline: AuthorDiscipline | 'all';
  practicalUse: AuthorPracticalUse | 'all';
  search: string;
}

type AuthorCardProfile = Pick<
  AuthorProfile,
  | 'name'
  | 'schoolOrTradition'
  | 'practicalRelevance'
  | 'coreConcepts'
> & {
  disciplines: string[];
  practicalUses: string[];
};

type AuthorFilterableProfile = Pick<
  AuthorProfile,
  | 'name'
  | 'schoolOrTradition'
  | 'historicalContext'
  | 'practicalRelevance'
  | 'coreConcepts'
  | 'relatedAuthors'
  | 'mainWorks'
> & {
  disciplines: string[];
  practicalUses: string[];
};

type SimpleAuthorSeedInput = {
  slug: string;
  name: string;
  schoolOrTradition: string;
  disciplines: AuthorDiscipline[];
  practicalUses: AuthorPracticalUse[];
  historicalContext: string;
  mainWork: string;
  coreConcepts: string[];
  practicalRelevance: string;
  relatedAuthors: string[];
  structureTags: StructureTag[];
  order: number;
};

export const authorLibraryCardDesign = {
  layout: 'Vertical dark card with title, tradition, practical-use tags, concept preview, and one-line executive relevance.',
  hierarchy: [
    'Author name',
    'School or tradition',
    'Practical use tags',
    '3 core concepts max in preview',
    '1 relevance sentence',
  ],
  interaction: [
    'Tap card to open full author profile',
    'Long lists collapse behind “show more”',
    'Search highlight applied to matching title, concepts, and works',
  ],
  tone: [
    'Serious and quiet',
    'No playful visuals',
    'Optimized for scanning and intentional study',
  ],
} as const;

export const authorLibrarySearchBehavior = {
  searchableFields: [
    'name',
    'schoolOrTradition',
    'historicalContext',
    'mainWorks.title',
    'coreConcepts',
    'practicalRelevance',
    'relatedAuthors',
  ],
  rankingRules: [
    'Exact author name match first',
    'Prefix match on main work titles second',
    'Core concept match third',
    'Practical relevance and historical context match fourth',
  ],
  emptyState:
    'No authors match the current filters. Clear one filter or search for a broader concept, tradition, or work.',
} as const;

export function buildAuthorLibrarySummaryPrompt(profile: AuthorProfile) {
  return {
    systemPrompt:
      'You are an executive formation librarian. Summarize authors for practical, serious study. Be concise, precise, and structurally useful. Return structured JSON only.',
    userPrompt: `Summarize this author profile for an executive formation user.

Author: ${profile.name}
School or tradition: ${profile.schoolOrTradition}
Historical context: ${profile.historicalContext}
Main works: ${profile.mainWorks.map((work) => `${work.title}${work.year ? ` (${work.year})` : ''}`).join(', ')}
Core concepts: ${profile.coreConcepts.join(', ')}
Practical relevance: ${profile.practicalRelevance}
Warnings or limitations: ${profile.keyWarningsOrLimitations.join(' | ')}
Related authors: ${profile.relatedAuthors.join(', ')}
Practical uses: ${profile.practicalUses.join(', ')}

Return JSON with:
- executiveSummary
- whyItMattersNow
- usefulInWhatSituations
- commonMisreadings
- nextAuthorsToStudy`,
  };
}

export function matchesAuthorFilters(
  profile: AuthorFilterableProfile,
  filters: AuthorLibraryFilterState,
) {
  const search = filters.search.trim().toLowerCase();

  const disciplineMatch =
    filters.discipline === 'all' || profile.disciplines.includes(filters.discipline);
  const practicalUseMatch =
    filters.practicalUse === 'all' || profile.practicalUses.includes(filters.practicalUse);

  if (!search) {
    return disciplineMatch && practicalUseMatch;
  }

  const searchableText = [
    profile.name,
    profile.schoolOrTradition,
    profile.historicalContext,
    profile.practicalRelevance,
    ...profile.coreConcepts,
    ...profile.relatedAuthors,
    ...profile.mainWorks.map((work) => work.title),
  ]
    .join(' ')
    .toLowerCase();

  return disciplineMatch && practicalUseMatch && searchableText.includes(search);
}

export function toAuthorLibraryCard(profile: AuthorCardProfile): AuthorLibraryCardViewModel {
  return {
    title: profile.name,
    subtitle: profile.schoolOrTradition,
    disciplines: profile.disciplines,
    practicalUses: profile.practicalUses,
    coreConceptPreview: profile.coreConcepts.slice(0, 3),
    relevanceSnippet: profile.practicalRelevance,
  };
}

function createSimpleAuthorProfile(input: SimpleAuthorSeedInput): AuthorProfile {
  return {
    id: `author-${input.slug}`,
    slug: input.slug,
    name: input.name,
    schoolOrTradition: input.schoolOrTradition,
    disciplines: input.disciplines,
    practicalUses: input.practicalUses,
    historicalContext: input.historicalContext,
    mainWorks: [
      {
        title: input.mainWork,
        note: `Core starting point for studying ${input.name} in the formation path.`,
      },
    ],
    coreConcepts: input.coreConcepts,
    practicalRelevance: input.practicalRelevance,
    keyWarningsOrLimitations: [
      'Read in context rather than as a slogan source.',
      'Translate into executive practice instead of stopping at conceptual familiarity.',
    ],
    relatedAuthors: input.relatedAuthors,
    relatedExercises: [],
    recommendedOrderOfStudy: input.order,
    structureTags: input.structureTags,
    librarySummary: input.practicalRelevance,
  };
}

export const exampleAuthorProfiles: AuthorProfile[] = [
  {
    id: 'author-adam-smith',
    slug: 'adam-smith',
    name: 'Adam Smith',
    schoolOrTradition: 'Classical political economy and moral philosophy',
    disciplines: ['political_economy', 'economics', 'philosophy'],
    practicalUses: [
      'market_analysis',
      'organizational_design',
      'executive_judgment',
      'founder_strategy',
    ],
    historicalContext:
      'Smith wrote in the context of commercial expansion, early industrialization, and the intellectual transition away from mercantilist thinking. His work sits at the intersection of moral philosophy and political economy.',
    mainWorks: [
      {
        title: 'The Theory of Moral Sentiments',
        year: 1759,
        note: 'Foundational for understanding sympathy, legitimacy, and moral judgment.',
      },
      {
        title: 'The Wealth of Nations',
        year: 1776,
        note: 'Foundational for division of labor, productivity, exchange, and commercial society.',
      },
    ],
    coreConcepts: [
      'division of labor',
      'productivity',
      'moral sentiments',
      'market coordination',
      'commercial society',
    ],
    practicalRelevance:
      'Smith helps an executive understand how specialization, incentives, legitimacy, and exchange shape organizational design and market behavior.',
    keyWarningsOrLimitations: [
      'He is often reduced to a simplistic market slogan and stripped of his moral philosophy.',
      'His work should not be read as a defense of coordination without institutional or ethical constraints.',
      'Modern firms are more complex than the examples he uses, so translation is required.',
    ],
    relatedAuthors: ['David Ricardo', 'Karl Marx', 'Friedrich Hayek', 'Peter Drucker'],
    relatedExercises: [
      {
        slug: 'smith-division-of-labor-review',
        title: 'Operating model bottleneck review',
        outputType: 'structure_analysis',
      },
      {
        slug: 'smith-value-translation',
        title: 'Executive value proposition rewrite',
        outputType: 'executive_translation',
      },
    ],
    recommendedOrderOfStudy: 1,
    structureTags: [
      'economic_structure',
      'organizational_structure',
      'operational_structure',
      'symbolic_structure',
    ],
    librarySummary:
      'Start here to understand productivity, specialization, and the moral-social dimension of economic life.',
  },
  {
    id: 'author-clausewitz',
    slug: 'clausewitz',
    name: 'Clausewitz',
    schoolOrTradition: 'Military strategy and political realism',
    disciplines: ['military_strategy', 'strategy', 'political_theory'],
    practicalUses: [
      'executive_judgment',
      'power_mapping',
      'risk_management',
      'institutional_analysis',
    ],
    historicalContext:
      'Clausewitz wrote in the aftermath of the Napoleonic wars, analyzing strategy under uncertainty, friction, politics, and real conflict rather than idealized geometry.',
    mainWorks: [
      {
        title: 'On War',
        year: 1832,
        note: 'Core text for friction, center of gravity, escalation, and strategy under conflict.',
      },
    ],
    coreConcepts: [
      'friction',
      'center of gravity',
      'war as continuation of politics',
      'fog of war',
      'escalation',
    ],
    practicalRelevance:
      'Clausewitz is useful for reading power, conflict, escalation, and strategic friction inside organizations, markets, and negotiations.',
    keyWarningsOrLimitations: [
      'He is often misused as a source of macho aggression rather than strategic realism.',
      'Business analogies must be handled carefully; not every commercial situation is war.',
      'His value is in understanding conflict structure, not in importing military rhetoric directly.',
    ],
    relatedAuthors: ['Sun Tzu', 'John Boyd', 'Michael Porter', 'Chris Voss'],
    relatedExercises: [
      {
        slug: 'clausewitz-actor-map',
        title: 'Actor and interest mapping for a strategic account',
        outputType: 'actor_interest_mapping',
      },
      {
        slug: 'clausewitz-conflict-brief',
        title: 'Executive conflict interpretation brief',
        outputType: 'conflict_interpretation',
      },
    ],
    recommendedOrderOfStudy: 20,
    structureTags: [
      'political_structure',
      'organizational_structure',
      'operational_structure',
      'symbolic_structure',
    ],
    librarySummary:
      'Use Clausewitz to understand friction, power concentration, and strategic movement under conflict.',
  },
  {
    id: 'author-peter-drucker',
    slug: 'peter-drucker',
    name: 'Peter Drucker',
    schoolOrTradition: 'Modern management thought',
    disciplines: ['management', 'strategy', 'communication'],
    practicalUses: [
      'organizational_design',
      'executive_judgment',
      'founder_strategy',
      'commercial_positioning',
    ],
    historicalContext:
      'Drucker wrote during the rise of the modern corporation and treated management as a serious social function rather than a narrow operational technique.',
    mainWorks: [
      {
        title: 'The Practice of Management',
        year: 1954,
        note: 'Core text on management as purpose, responsibility, and institutional design.',
      },
      {
        title: 'Management: Tasks, Responsibilities, Practices',
        year: 1973,
        note: 'Broad synthesis of management logic and executive responsibility.',
      },
      {
        title: 'The Effective Executive',
        year: 1967,
        note: 'Important for executive focus, time, contribution, and decision discipline.',
      },
    ],
    coreConcepts: [
      'management by contribution',
      'customer definition',
      'effectiveness',
      'focus',
      'executive responsibility',
    ],
    practicalRelevance:
      'Drucker helps founders and consultants define purpose, customer, contribution, and management responsibility without drowning in technical activity.',
    keyWarningsOrLimitations: [
      'He can sound obvious when reduced to slogans; the value is in disciplined application.',
      'His work does not replace deeper political or economic analysis.',
      'Reading Drucker superficially can lead to generic management language instead of real judgment.',
    ],
    relatedAuthors: ['Andy Grove', 'Michael Porter', 'Richard Rumelt', 'Barbara Minto'],
    relatedExercises: [
      {
        slug: 'drucker-commercial-diagnosis',
        title: 'Commercial diagnosis of a growing practice',
        outputType: 'commercial_diagnosis',
      },
      {
        slug: 'drucker-founder-priority-memo',
        title: 'Founder priority and focus memo',
        outputType: 'decision_memo',
      },
    ],
    recommendedOrderOfStudy: 24,
    structureTags: [
      'organizational_structure',
      'operational_structure',
      'economic_structure',
      'symbolic_structure',
    ],
    librarySummary:
      'Study Drucker when you need to connect strategy, customer definition, and managerial responsibility into executive practice.',
  },
];

export const authorSeedProfiles: AuthorProfile[] = [
  ...exampleAuthorProfiles,
  createSimpleAuthorProfile({
    slug: 'david-ricardo',
    name: 'David Ricardo',
    schoolOrTradition: 'Classical political economy',
    disciplines: ['political_economy', 'economics'],
    practicalUses: ['market_analysis', 'executive_judgment', 'commercial_positioning'],
    historicalContext: 'Ricardo sharpens classical analysis around value, rent, and distribution.',
    mainWork: 'Principles of Political Economy and Taxation',
    coreConcepts: ['value', 'rent', 'distribution', 'comparative advantage'],
    practicalRelevance: 'Useful for pricing, structural advantage, and distribution conflicts.',
    relatedAuthors: ['Adam Smith', 'Karl Marx', 'John Maynard Keynes'],
    structureTags: ['economic_structure', 'political_structure'],
    order: 2,
  }),
  createSimpleAuthorProfile({
    slug: 'karl-marx',
    name: 'Karl Marx',
    schoolOrTradition: 'Critique of political economy',
    disciplines: ['political_economy', 'sociology', 'philosophy'],
    practicalUses: ['power_mapping', 'institutional_analysis', 'executive_judgment'],
    historicalContext: 'Marx analyzes capital, contradiction, class conflict, and structural power.',
    mainWork: 'Capital',
    coreConcepts: ['contradiction', 'class conflict', 'capital accumulation', 'alienation'],
    practicalRelevance: 'Useful for reading uneven gains, conflict, and hidden power structures.',
    relatedAuthors: ['Adam Smith', 'David Ricardo', 'Pierre Bourdieu'],
    structureTags: ['economic_structure', 'political_structure', 'organizational_structure'],
    order: 3,
  }),
  createSimpleAuthorProfile({
    slug: 'carl-menger',
    name: 'Carl Menger',
    schoolOrTradition: 'Austrian School',
    disciplines: ['economics', 'political_economy'],
    practicalUses: ['market_analysis', 'founder_strategy'],
    historicalContext: 'Menger inaugurates the Austrian emphasis on subjective value and emergence.',
    mainWork: 'Principles of Economics',
    coreConcepts: ['subjective value', 'marginal utility', 'emergence'],
    practicalRelevance: 'Useful for understanding value formation and customer perception.',
    relatedAuthors: ['Ludwig von Mises', 'Friedrich Hayek', 'Israel Kirzner'],
    structureTags: ['economic_structure', 'symbolic_structure'],
    order: 4,
  }),
  createSimpleAuthorProfile({
    slug: 'ludwig-von-mises',
    name: 'Ludwig von Mises',
    schoolOrTradition: 'Austrian School',
    disciplines: ['economics', 'political_theory'],
    practicalUses: ['market_analysis', 'institutional_analysis', 'executive_judgment'],
    historicalContext: 'Mises extends Austrian reasoning into prices, coordination, and calculation.',
    mainWork: 'Human Action',
    coreConcepts: ['economic calculation', 'praxeology', 'market coordination'],
    practicalRelevance: 'Useful for understanding information, incentives, and price-based coordination.',
    relatedAuthors: ['Carl Menger', 'Friedrich Hayek', 'Israel Kirzner'],
    structureTags: ['economic_structure', 'political_structure'],
    order: 5,
  }),
  createSimpleAuthorProfile({
    slug: 'friedrich-hayek',
    name: 'Friedrich Hayek',
    schoolOrTradition: 'Austrian School',
    disciplines: ['economics', 'political_theory'],
    practicalUses: ['market_analysis', 'organizational_design', 'executive_judgment'],
    historicalContext: 'Hayek develops the knowledge problem and the importance of dispersed coordination.',
    mainWork: 'The Use of Knowledge in Society',
    coreConcepts: ['dispersed knowledge', 'coordination', 'spontaneous order'],
    practicalRelevance: 'Useful for decentralization, operating design, and information flow decisions.',
    relatedAuthors: ['Carl Menger', 'Ludwig von Mises', 'Israel Kirzner'],
    structureTags: ['economic_structure', 'organizational_structure', 'operational_structure'],
    order: 6,
  }),
  createSimpleAuthorProfile({
    slug: 'israel-kirzner',
    name: 'Israel Kirzner',
    schoolOrTradition: 'Austrian School',
    disciplines: ['economics', 'management'],
    practicalUses: ['founder_strategy', 'commercial_positioning'],
    historicalContext: 'Kirzner emphasizes entrepreneurial alertness and discovery.',
    mainWork: 'Competition and Entrepreneurship',
    coreConcepts: ['alertness', 'discovery', 'entrepreneurship'],
    practicalRelevance: 'Useful for founder opportunity recognition and market discovery logic.',
    relatedAuthors: ['Carl Menger', 'Friedrich Hayek', 'April Dunford'],
    structureTags: ['economic_structure', 'symbolic_structure'],
    order: 7,
  }),
  createSimpleAuthorProfile({
    slug: 'john-maynard-keynes',
    name: 'John Maynard Keynes',
    schoolOrTradition: 'Keynesian political economy',
    disciplines: ['economics', 'political_theory'],
    practicalUses: ['market_analysis', 'institutional_analysis', 'executive_judgment'],
    historicalContext: 'Keynes analyzes uncertainty, demand, and macroeconomic instability.',
    mainWork: 'The General Theory of Employment, Interest and Money',
    coreConcepts: ['uncertainty', 'demand', 'investment', 'animal spirits'],
    practicalRelevance: 'Useful for demand sensitivity, macro context, and decision-making under uncertainty.',
    relatedAuthors: ['David Ricardo', 'Karl Marx', 'Nassim Taleb'],
    structureTags: ['economic_structure', 'political_structure'],
    order: 8,
  }),
  createSimpleAuthorProfile({
    slug: 'juan-domingo-peron',
    name: 'Juan Domingo Perón',
    schoolOrTradition: 'Peronism and political organization',
    disciplines: ['political_theory', 'strategy'],
    practicalUses: ['power_mapping', 'institutional_analysis', 'communication'],
    historicalContext: 'Perón is studied for labor, political organization, mass legitimacy, and state-society mediation.',
    mainWork: 'Conducción Política',
    coreConcepts: ['conduction', 'organization', 'mass legitimacy'],
    practicalRelevance: 'Useful for legitimacy, political coordination, and structured leadership under mass conditions.',
    relatedAuthors: ['Max Weber', 'Michel Foucault', 'Clausewitz'],
    structureTags: ['political_structure', 'symbolic_structure', 'organizational_structure'],
    order: 9,
  }),
  createSimpleAuthorProfile({
    slug: 'karl-popper',
    name: 'Karl Popper',
    schoolOrTradition: 'Critical rationalism',
    disciplines: ['philosophy'],
    practicalUses: ['executive_judgment', 'risk_management'],
    historicalContext: 'Popper focuses on falsifiability, error correction, and anti-dogmatism.',
    mainWork: 'The Logic of Scientific Discovery',
    coreConcepts: ['falsifiability', 'error correction', 'open inquiry'],
    practicalRelevance: 'Useful for evidence thresholds, decision reversibility, and disciplined challenge.',
    relatedAuthors: ['Thomas Kuhn', 'Michael Polanyi', 'Nassim Taleb'],
    structureTags: ['technological_structure', 'operational_structure'],
    order: 10,
  }),
  createSimpleAuthorProfile({
    slug: 'thomas-kuhn',
    name: 'Thomas Kuhn',
    schoolOrTradition: 'Philosophy of science',
    disciplines: ['philosophy'],
    practicalUses: ['executive_judgment', 'communication'],
    historicalContext: 'Kuhn studies paradigms, anomalies, and shifts in accepted frameworks.',
    mainWork: 'The Structure of Scientific Revolutions',
    coreConcepts: ['paradigm', 'anomaly', 'paradigm shift'],
    practicalRelevance: 'Useful for understanding when an organization is stuck inside an outdated interpretive frame.',
    relatedAuthors: ['Karl Popper', 'Michael Polanyi', 'Clayton Christensen'],
    structureTags: ['symbolic_structure', 'technological_structure'],
    order: 11,
  }),
  createSimpleAuthorProfile({
    slug: 'michael-polanyi',
    name: 'Michael Polanyi',
    schoolOrTradition: 'Tacit knowledge and philosophy of science',
    disciplines: ['philosophy'],
    practicalUses: ['organizational_design', 'executive_judgment'],
    historicalContext: 'Polanyi emphasizes tacit knowledge and limits of explicit codification.',
    mainWork: 'Personal Knowledge',
    coreConcepts: ['tacit knowledge', 'judgment', 'craft'],
    practicalRelevance: 'Useful for expert work, apprenticeship design, and limits of process codification.',
    relatedAuthors: ['Karl Popper', 'Thomas Kuhn', 'Friedrich Hayek'],
    structureTags: ['organizational_structure', 'operational_structure'],
    order: 12,
  }),
  createSimpleAuthorProfile({
    slug: 'nassim-taleb',
    name: 'Nassim Taleb',
    schoolOrTradition: 'Uncertainty and antifragility',
    disciplines: ['philosophy', 'economics'],
    practicalUses: ['risk_management', 'executive_judgment', 'founder_strategy'],
    historicalContext: 'Taleb focuses on tail risk, fragility, convexity, and epistemic limits.',
    mainWork: 'Antifragile',
    coreConcepts: ['tail risk', 'fragility', 'antifragility', 'skin in the game'],
    practicalRelevance: 'Useful for asymmetry, downside exposure, and robust decision design.',
    relatedAuthors: ['Karl Popper', 'Friedrich Hayek', 'Clausewitz'],
    structureTags: ['economic_structure', 'operational_structure', 'technological_structure'],
    order: 13,
  }),
  createSimpleAuthorProfile({
    slug: 'hegel',
    name: 'Hegel',
    schoolOrTradition: 'German idealism',
    disciplines: ['philosophy'],
    practicalUses: ['executive_judgment', 'institutional_analysis'],
    historicalContext: 'Hegel is useful for historical movement, contradiction, and recognition.',
    mainWork: 'Phenomenology of Spirit',
    coreConcepts: ['recognition', 'dialectic', 'historical development'],
    practicalRelevance: 'Useful for reading conflict, recognition, and evolving institutional forms.',
    relatedAuthors: ['Karl Marx', 'Nietzsche', 'Max Weber'],
    structureTags: ['symbolic_structure', 'political_structure'],
    order: 14,
  }),
  createSimpleAuthorProfile({
    slug: 'nietzsche',
    name: 'Nietzsche',
    schoolOrTradition: 'Genealogy and critique of morality',
    disciplines: ['philosophy'],
    practicalUses: ['communication', 'executive_judgment'],
    historicalContext: 'Nietzsche is useful for analyzing values, ressentiment, and style of force.',
    mainWork: 'On the Genealogy of Morality',
    coreConcepts: ['ressentiment', 'genealogy', 'value creation'],
    practicalRelevance: 'Useful for reading status conflict, moral language, and symbolic positioning.',
    relatedAuthors: ['Michel Foucault', 'René Girard', 'Hegel'],
    structureTags: ['symbolic_structure', 'political_structure'],
    order: 15,
  }),
  createSimpleAuthorProfile({
    slug: 'max-weber',
    name: 'Max Weber',
    schoolOrTradition: 'Classical sociology',
    disciplines: ['sociology', 'political_theory'],
    practicalUses: ['institutional_analysis', 'organizational_design', 'power_mapping'],
    historicalContext: 'Weber studies legitimacy, bureaucracy, authority, and rationalization.',
    mainWork: 'Economy and Society',
    coreConcepts: ['authority', 'legitimacy', 'bureaucracy', 'rationalization'],
    practicalRelevance: 'Useful for reading institutional authority and organizational legitimacy.',
    relatedAuthors: ['Juan Domingo Perón', 'Michel Foucault', 'Pierre Bourdieu'],
    structureTags: ['political_structure', 'organizational_structure', 'symbolic_structure'],
    order: 16,
  }),
  createSimpleAuthorProfile({
    slug: 'michel-foucault',
    name: 'Michel Foucault',
    schoolOrTradition: 'Genealogy of power',
    disciplines: ['philosophy', 'sociology'],
    practicalUses: ['power_mapping', 'institutional_analysis', 'communication'],
    historicalContext: 'Foucault studies institutions, discipline, discourse, and distributed power.',
    mainWork: 'Discipline and Punish',
    coreConcepts: ['discipline', 'discourse', 'power', 'institutional formation'],
    practicalRelevance: 'Useful for reading how power operates through procedures, language, and institutions.',
    relatedAuthors: ['Max Weber', 'Pierre Bourdieu', 'Nietzsche'],
    structureTags: ['political_structure', 'symbolic_structure', 'organizational_structure'],
    order: 17,
  }),
  createSimpleAuthorProfile({
    slug: 'pierre-bourdieu',
    name: 'Pierre Bourdieu',
    schoolOrTradition: 'Field theory and sociology',
    disciplines: ['sociology'],
    practicalUses: ['power_mapping', 'institutional_analysis', 'commercial_positioning'],
    historicalContext: 'Bourdieu studies fields, capital, habitus, and symbolic struggle.',
    mainWork: 'Distinction',
    coreConcepts: ['field', 'capital', 'habitus', 'symbolic power'],
    practicalRelevance: 'Useful for markets of prestige, symbolic competition, and elite signaling.',
    relatedAuthors: ['Max Weber', 'Michel Foucault', 'René Girard'],
    structureTags: ['symbolic_structure', 'political_structure', 'economic_structure'],
    order: 18,
  }),
  createSimpleAuthorProfile({
    slug: 'rene-girard',
    name: 'René Girard',
    schoolOrTradition: 'Mimetic theory',
    disciplines: ['philosophy', 'sociology'],
    practicalUses: ['power_mapping', 'risk_management', 'executive_judgment'],
    historicalContext: 'Girard studies imitation, rivalry, and scapegoating.',
    mainWork: 'Violence and the Sacred',
    coreConcepts: ['mimesis', 'rivalry', 'scapegoat mechanism'],
    practicalRelevance: 'Useful for reading rivalry, escalation, and symbolic contagion inside groups.',
    relatedAuthors: ['Nietzsche', 'Michel Foucault', 'Clausewitz'],
    structureTags: ['symbolic_structure', 'political_structure'],
    order: 19,
  }),
  createSimpleAuthorProfile({
    slug: 'sun-tzu',
    name: 'Sun Tzu',
    schoolOrTradition: 'Classical strategy',
    disciplines: ['military_strategy', 'strategy'],
    practicalUses: ['executive_judgment', 'risk_management', 'commercial_positioning'],
    historicalContext: 'Sun Tzu emphasizes asymmetry, information, and indirect advantage.',
    mainWork: 'The Art of War',
    coreConcepts: ['indirect strategy', 'deception', 'advantage', 'preparation'],
    practicalRelevance: 'Useful for strategic positioning, asymmetry, and advantage without frontal waste.',
    relatedAuthors: ['Clausewitz', 'John Boyd', 'Michael Porter'],
    structureTags: ['political_structure', 'operational_structure'],
    order: 21,
  }),
  createSimpleAuthorProfile({
    slug: 'john-boyd',
    name: 'John Boyd',
    schoolOrTradition: 'Decision cycles and maneuver conflict',
    disciplines: ['military_strategy', 'strategy'],
    practicalUses: ['executive_judgment', 'organizational_design', 'risk_management'],
    historicalContext: 'Boyd focuses on orientation, adaptation, tempo, and decision cycles.',
    mainWork: 'Patterns of Conflict',
    coreConcepts: ['OODA loop', 'orientation', 'tempo', 'adaptation'],
    practicalRelevance: 'Useful for fast-moving decisions, adaptation, and tempo advantage.',
    relatedAuthors: ['Clausewitz', 'Sun Tzu', 'Andy Grove'],
    structureTags: ['operational_structure', 'organizational_structure', 'technological_structure'],
    order: 22,
  }),
  createSimpleAuthorProfile({
    slug: 'andy-grove',
    name: 'Andy Grove',
    schoolOrTradition: 'Operational management and strategic inflection',
    disciplines: ['management', 'strategy'],
    practicalUses: ['organizational_design', 'executive_judgment', 'founder_strategy'],
    historicalContext: 'Grove focuses on leverage, management systems, and inflection points.',
    mainWork: 'Only the Paranoid Survive',
    coreConcepts: ['strategic inflection point', 'managerial leverage', 'operating cadence'],
    practicalRelevance: 'Useful for scaling operations and recognizing when the environment has shifted.',
    relatedAuthors: ['Peter Drucker', 'Michael Porter', 'Clayton Christensen'],
    structureTags: ['organizational_structure', 'operational_structure', 'technological_structure'],
    order: 25,
  }),
  createSimpleAuthorProfile({
    slug: 'michael-porter',
    name: 'Michael Porter',
    schoolOrTradition: 'Competitive strategy',
    disciplines: ['strategy', 'management'],
    practicalUses: ['market_analysis', 'commercial_positioning', 'founder_strategy'],
    historicalContext: 'Porter formalizes industry structure and competitive positioning.',
    mainWork: 'Competitive Strategy',
    coreConcepts: ['five forces', 'competitive positioning', 'value chain'],
    practicalRelevance: 'Useful for industry structure, differentiation, and strategic positioning.',
    relatedAuthors: ['Richard Rumelt', 'Clayton Christensen', 'April Dunford'],
    structureTags: ['economic_structure', 'symbolic_structure', 'organizational_structure'],
    order: 26,
  }),
  createSimpleAuthorProfile({
    slug: 'richard-rumelt',
    name: 'Richard Rumelt',
    schoolOrTradition: 'Strategy diagnosis',
    disciplines: ['strategy', 'management'],
    practicalUses: ['executive_judgment', 'founder_strategy', 'commercial_positioning'],
    historicalContext: 'Rumelt emphasizes diagnosis, coherent action, and avoiding strategy theater.',
    mainWork: 'Good Strategy Bad Strategy',
    coreConcepts: ['diagnosis', 'guiding policy', 'coherent action'],
    practicalRelevance: 'Useful for separating real strategy from vague aspiration.',
    relatedAuthors: ['Michael Porter', 'Peter Drucker', 'Andy Grove'],
    structureTags: ['organizational_structure', 'economic_structure'],
    order: 27,
  }),
  createSimpleAuthorProfile({
    slug: 'clayton-christensen',
    name: 'Clayton Christensen',
    schoolOrTradition: 'Innovation and disruption',
    disciplines: ['strategy', 'management'],
    practicalUses: ['founder_strategy', 'market_analysis', 'commercial_positioning'],
    historicalContext: 'Christensen studies disruption, jobs to be done, and incumbent blind spots.',
    mainWork: 'The Innovator’s Dilemma',
    coreConcepts: ['disruption', 'jobs to be done', 'incumbent blindness'],
    practicalRelevance: 'Useful for market entry, offer design, and strategic asymmetry.',
    relatedAuthors: ['Michael Porter', 'Richard Rumelt', 'April Dunford'],
    structureTags: ['economic_structure', 'technological_structure', 'symbolic_structure'],
    order: 28,
  }),
  createSimpleAuthorProfile({
    slug: 'barbara-minto',
    name: 'Barbara Minto',
    schoolOrTradition: 'Executive communication',
    disciplines: ['communication', 'management'],
    practicalUses: ['communication', 'executive_judgment'],
    historicalContext: 'Minto systematizes top-down argument structure for business communication.',
    mainWork: 'The Pyramid Principle',
    coreConcepts: ['top-down structure', 'grouping', 'message hierarchy'],
    practicalRelevance: 'Useful for memos, board communication, and argument compression.',
    relatedAuthors: ['Peter Drucker', 'Robert Cialdini', 'Chris Voss'],
    structureTags: ['symbolic_structure', 'organizational_structure'],
    order: 29,
  }),
  createSimpleAuthorProfile({
    slug: 'robert-cialdini',
    name: 'Robert Cialdini',
    schoolOrTradition: 'Influence and persuasion',
    disciplines: ['communication', 'negotiation'],
    practicalUses: ['communication', 'commercial_positioning', 'negotiation'],
    historicalContext: 'Cialdini studies persuasion mechanisms and influence conditions.',
    mainWork: 'Influence',
    coreConcepts: ['social proof', 'authority', 'reciprocity', 'scarcity'],
    practicalRelevance: 'Useful for persuasion, commercial framing, and stakeholder influence.',
    relatedAuthors: ['Barbara Minto', 'Chris Voss', 'April Dunford'],
    structureTags: ['symbolic_structure', 'economic_structure'],
    order: 30,
  }),
  createSimpleAuthorProfile({
    slug: 'april-dunford',
    name: 'April Dunford',
    schoolOrTradition: 'Positioning and market language',
    disciplines: ['strategy', 'communication'],
    practicalUses: ['commercial_positioning', 'founder_strategy', 'communication'],
    historicalContext: 'Dunford focuses on positioning and market category clarity.',
    mainWork: 'Obviously Awesome',
    coreConcepts: ['positioning', 'category design', 'market framing'],
    practicalRelevance: 'Useful for making offers legible to buyers and markets.',
    relatedAuthors: ['Michael Porter', 'Clayton Christensen', 'Robert Cialdini'],
    structureTags: ['economic_structure', 'symbolic_structure'],
    order: 31,
  }),
  createSimpleAuthorProfile({
    slug: 'chris-voss',
    name: 'Chris Voss',
    schoolOrTradition: 'Negotiation and tactical empathy',
    disciplines: ['negotiation', 'communication'],
    practicalUses: ['negotiation', 'communication', 'executive_judgment'],
    historicalContext: 'Voss translates crisis negotiation techniques into high-stakes persuasion.',
    mainWork: 'Never Split the Difference',
    coreConcepts: ['tactical empathy', 'labeling', 'calibrated questions'],
    practicalRelevance: 'Useful for negotiation, stakeholder management, and difficult executive conversations.',
    relatedAuthors: ['Robert Cialdini', 'Barbara Minto', 'Clausewitz'],
    structureTags: ['symbolic_structure', 'political_structure'],
    order: 32,
  }),
];
