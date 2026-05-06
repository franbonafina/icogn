import type { DailyLesson } from '@/features/formation/types';

const sharedFeedbackSystemPrompt =
  'You are an executive formation coach. Evaluate the user answer for conceptual accuracy, executive usefulness, structural thinking, and clarity. Be direct, specific, and practical.';

function buildFeedbackTemplate(lessonTitle: string, coreIdea: string) {
  return {
    systemPrompt: sharedFeedbackSystemPrompt,
    userPromptTemplate: `Lesson: ${lessonTitle}
Core idea: ${coreIdea}

User answer:
{{userAnswer}}

Return structured feedback with:
1. Conceptual accuracy
2. Executive usefulness
3. Structural blind spots
4. Specific revision advice
5. Score from 1 to 5`,
    rubric: [
      'Explains the idea correctly',
      'Translates the idea into company, consulting, or founder reality',
      'Shows structural reasoning rather than surface commentary',
      'Writes with executive clarity',
    ],
    requestedOutputs: [
      'score',
      'summary',
      'strengths',
      'weaknesses',
      'revisionAdvice',
    ],
  };
}

export const month1ClassicalPoliticalEconomyLessons: DailyLesson[] = [
  {
    id: 'm1-day1-division-of-labor',
    slug: 'division-of-labor',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 1,
    title: 'Division of labor',
    openingFrame:
      'Executive work begins by seeing how specialization changes output, coordination costs, and dependence between roles.',
    authorReference: {
      type: 'author',
      name: 'Adam Smith',
      workTitle: 'The Wealth of Nations',
      summary:
        'Smith uses the pin factory to show that specialization can radically increase productivity, while also increasing interdependence.',
    },
    coreIdea:
      'Division of labor raises productivity by breaking complex work into narrower tasks, but it also creates coordination dependence and managerial design problems.',
    practicalTranslation:
      'In companies, specialization can increase throughput, but badly designed specialization creates silos, weak ownership, and brittle execution. An executive has to decide where to standardize and where to preserve integrated judgment.',
    reading: {
      title: 'The pin factory and specialization',
      sourceLabel: 'Adam Smith, Book I',
      excerpt:
        'Observe how the making of a small manufactured object becomes far more productive when labor is divided into distinct operations performed by specialized hands.',
      estimatedMinutes: 8,
      guidingQuestion:
        'What does specialization improve, and what new dependency does it create?',
    },
    practice: {
      type: 'analysis',
      title: 'Map specialization in a services business',
      prompt:
        'Choose a consulting, software, or services company. Identify three specialized functions and explain where specialization improves output and where it creates coordination friction.',
      expectedOutput: 'A short executive note with three observations and one recommendation.',
      evaluationFocus: ['structural clarity', 'operational realism', 'tradeoff awareness'],
    },
    reflectionPrompt:
      'Where in your own current work are you over-specialized, under-specialized, or structurally fragmented?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Division of labor',
      'Division of labor increases productivity but can create new coordination burdens.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow moves from specialization itself to the broader question of how productivity compounds.',
      nextLessonSlug: 'productivity',
    },
    primaryStructure: 'organizational_structure',
    secondaryStructures: ['operational_structure', 'technological_structure'],
    relatedConcepts: ['specialization', 'throughput', 'coordination'],
    difficulty: 2,
  },
  {
    id: 'm1-day2-productivity',
    slug: 'productivity',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 2,
    title: 'Productivity',
    openingFrame:
      'Executives are judged not by motion but by the ability to design structures that produce more value per unit of effort, capital, and time.',
    authorReference: {
      type: 'author',
      name: 'Adam Smith',
      workTitle: 'The Wealth of Nations',
      summary:
        'Smith treats productivity as a function of labor organization, skill, and the conditions that allow exchange and accumulation.',
    },
    coreIdea:
      'Productivity is not only about worker effort. It is shaped by process design, specialization, tools, incentives, and the surrounding structure of exchange.',
    practicalTranslation:
      'For a founder or consultant, productivity questions should be framed structurally: where are delays, rework, dependency bottlenecks, unclear incentives, or weak process architecture?',
    reading: {
      title: 'From labor effort to output design',
      sourceLabel: 'Classical political economy foundation',
      excerpt:
        'The same amount of labor can yield radically different outcomes depending on the arrangement of work, the quality of instruments, and the openness of exchange.',
      estimatedMinutes: 8,
      guidingQuestion:
        'What productivity problem looks like a people problem but is actually a structural problem?',
    },
    practice: {
      type: 'business_application',
      title: 'Diagnose a productivity trap',
      prompt:
        'Write a one-page diagnosis of a team or business unit whose productivity appears weak. Separate people issues from structural causes.',
      expectedOutput: 'A short diagnostic memo with root causes and one structural intervention.',
      evaluationFocus: ['root-cause reasoning', 'operational specificity', 'executive usefulness'],
    },
    reflectionPrompt:
      'What is one productivity problem in your current environment that is being misdiagnosed?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Productivity',
      'Productivity emerges from the structure of work, not from effort alone.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow adds a missing dimension: economic action is not only technical but moral and social.',
      nextLessonSlug: 'moral-sentiments',
    },
    primaryStructure: 'operational_structure',
    secondaryStructures: ['organizational_structure', 'economic_structure'],
    relatedConcepts: ['output', 'throughput', 'incentives'],
    difficulty: 2,
  },
  {
    id: 'm1-day3-moral-sentiments',
    slug: 'moral-sentiments',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 3,
    title: 'Moral sentiments',
    openingFrame:
      'Economic and executive judgment do not operate in a vacuum. Trust, legitimacy, perception, and moral expectation shape what can actually be coordinated.',
    authorReference: {
      type: 'book',
      name: 'Adam Smith',
      workTitle: 'The Theory of Moral Sentiments',
      summary:
        'Smith argues that sympathy, moral judgment, and social approval are central to human coordination and cannot be separated from economic life.',
    },
    coreIdea:
      'People coordinate not only through prices and incentives but through expectations, legitimacy, reputation, and moral judgment.',
    practicalTranslation:
      'In executive work, a technically correct decision can still fail if it violates trust, symbolic expectations, or perceived fairness. Structure includes legitimacy, not only economics.',
    reading: {
      title: 'Markets need social trust',
      sourceLabel: 'Adam Smith, moral psychology context',
      excerpt:
        'Human conduct is shaped by the desire for approval, the capacity for sympathy, and the internalized viewpoint of others.',
      estimatedMinutes: 9,
      guidingQuestion:
        'Where does organizational trust affect the success of otherwise rational business decisions?',
    },
    practice: {
      type: 'reflection',
      title: 'Legitimacy under pressure',
      prompt:
        'Describe a decision that was economically rational but politically, culturally, or symbolically fragile. Explain why it failed or would likely fail.',
      expectedOutput: 'A reflection note with one example and one executive lesson.',
      evaluationFocus: ['symbolic awareness', 'judgment', 'practical synthesis'],
    },
    reflectionPrompt:
      'When do you personally overvalue technical correctness and undervalue legitimacy?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Moral sentiments',
      'Economic decisions are mediated by trust, legitimacy, and social judgment.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow shifts from legitimacy to coordination: how order emerges without central control.',
      nextLessonSlug: 'market-coordination',
    },
    primaryStructure: 'symbolic_structure',
    secondaryStructures: ['organizational_structure', 'political_structure'],
    relatedConcepts: ['trust', 'legitimacy', 'reputation'],
    difficulty: 3,
  },
  {
    id: 'm1-day4-market-coordination',
    slug: 'market-coordination',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 4,
    title: 'Market coordination',
    openingFrame:
      'Executives need to understand when coordination can emerge through decentralized incentives and when structure must be imposed deliberately.',
    authorReference: {
      type: 'school',
      name: 'Classical political economy',
      summary:
        'The classical tradition begins the question of how exchange coordinates dispersed activity without requiring total centralized design.',
    },
    coreIdea:
      'Markets coordinate through decentralized signals, but that coordination is uneven, incomplete, and shaped by institutions and power.',
    practicalTranslation:
      'A founder deciding how to price, segment, or allocate authority must know what the market can coordinate on its own and what the company must organize internally.',
    reading: {
      title: 'Decentralized order and its limits',
      sourceLabel: 'Classical market coordination theme',
      excerpt:
        'Exchange enables adjustment across many actors without one mind directing all activity, but the structure of institutions determines how well that coordination holds.',
      estimatedMinutes: 8,
      guidingQuestion:
        'Where should your organization rely on distributed signals, and where should it enforce explicit structure?',
    },
    practice: {
      type: 'analysis',
      title: 'Design the boundary',
      prompt:
        'Pick one business question: pricing, staffing, feature prioritization, or delivery quality. Explain which part should be market-led and which part should be management-led.',
      expectedOutput: 'A structured note with a coordination boundary and rationale.',
      evaluationFocus: ['boundary design', 'organizational judgment', 'clarity'],
    },
    reflectionPrompt:
      'Where do you over-centralize decisions that should be decentralized, or vice versa?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Market coordination',
      'Decentralized coordination is powerful but depends on institutional and organizational structure.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow turns to value: what exactly is being produced, exchanged, and priced?',
      nextLessonSlug: 'value',
    },
    primaryStructure: 'economic_structure',
    secondaryStructures: ['organizational_structure', 'legal_structure'],
    relatedConcepts: ['coordination', 'exchange', 'signals'],
    difficulty: 3,
  },
  {
    id: 'm1-day5-value',
    slug: 'value',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 5,
    title: 'Value',
    openingFrame:
      'Executives often confuse price, cost, and value. This confusion weakens both strategy and communication.',
    authorReference: {
      type: 'author',
      name: 'David Ricardo',
      workTitle: 'Principles of Political Economy and Taxation',
      summary:
        'Ricardo sharpens the classical debate about value, distribution, and the structural relation between production and income allocation.',
    },
    coreIdea:
      'Value is not identical to market price. It is tied to production conditions, scarcity, social demand, and the structure of exchange.',
    practicalTranslation:
      'In consulting and founder work, value questions shape pricing, positioning, and negotiation. You need to distinguish what costs you money, what the market pays for, and what the buyer perceives as decisive.',
    reading: {
      title: 'Value beyond price',
      sourceLabel: 'Ricardian value debate',
      excerpt:
        'Relative values depend on the conditions of production and exchange, and cannot be reduced to surface prices alone.',
      estimatedMinutes: 9,
      guidingQuestion:
        'What do your clients pay for that is different from what your team spends effort producing?',
    },
    practice: {
      type: 'executive_translation',
      title: 'Rewrite the value proposition',
      prompt:
        'Take one technical service you know well. Rewrite its value proposition in executive language that separates cost, price, and business value.',
      expectedOutput: 'A crisp executive-facing value statement and short explanation.',
      evaluationFocus: ['commercial clarity', 'value framing', 'executive language'],
    },
    reflectionPrompt:
      'Where in your current thinking do you still describe effort instead of value?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Value',
      'Price, cost, and value are distinct and must be translated differently in executive and commercial work.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow narrows the lens to rent and how structural position shapes income.',
      nextLessonSlug: 'rent',
    },
    primaryStructure: 'economic_structure',
    secondaryStructures: ['symbolic_structure', 'organizational_structure'],
    relatedConcepts: ['price', 'cost', 'exchange value'],
    difficulty: 3,
  },
  {
    id: 'm1-day6-rent',
    slug: 'rent',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 6,
    title: 'Rent',
    openingFrame:
      'Some actors win because they create more value. Others win because they control structural bottlenecks.',
    authorReference: {
      type: 'author',
      name: 'David Ricardo',
      workTitle: 'Principles of Political Economy and Taxation',
      summary:
        'Ricardo explains rent as income tied to differential structural position, not simply productive contribution.',
    },
    coreIdea:
      'Rent is income derived from structural advantage, scarcity, or control, rather than from proportional productive effort alone.',
    practicalTranslation:
      'In business, rents appear in platform control, regulatory capture, brand dominance, switching costs, scarce expertise, and gatekeeping power. Executives need to identify who captures value structurally.',
    reading: {
      title: 'Who captures, who produces',
      sourceLabel: 'Ricardian rent logic',
      excerpt:
        'Returns may differ not because all actors create more output, but because some occupy more favorable structural positions.',
      estimatedMinutes: 8,
      guidingQuestion:
        'Where in a market do the strongest rents sit, and what protects them?',
    },
    practice: {
      type: 'analysis',
      title: 'Map rent capture',
      prompt:
        'Choose a company, industry, or partner ecosystem. Identify where rents are being captured and whether they come from law, infrastructure, narrative power, switching costs, or distribution.',
      expectedOutput: 'A short rent map with one strategic implication.',
      evaluationFocus: ['economic analysis', 'structural identification', 'strategic implication'],
    },
    reflectionPrompt:
      'In your own career, where are you building productive capability and where are you relying on positional advantage?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Rent',
      'Rent comes from structural advantage and control, not only from productive contribution.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow broadens from rent to the larger question of distribution across classes, sectors, and functions.',
      nextLessonSlug: 'distribution',
    },
    primaryStructure: 'economic_structure',
    secondaryStructures: ['legal_structure', 'political_structure'],
    relatedConcepts: ['rent', 'scarcity', 'bottlenecks'],
    difficulty: 3,
  },
  {
    id: 'm1-day7-distribution',
    slug: 'distribution',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 7,
    title: 'Distribution',
    openingFrame:
      'Production matters, but executive judgment also requires seeing how gains are distributed across labor, capital, owners, and institutions.',
    authorReference: {
      type: 'author',
      name: 'David Ricardo',
      workTitle: 'Principles of Political Economy and Taxation',
      summary:
        'Ricardo places distribution at the center of political economy by asking how output is divided among wages, profits, and rent.',
    },
    coreIdea:
      'Economic life is not only about producing output. It is also about how output is divided, and that division shapes power, incentives, and conflict.',
    practicalTranslation:
      'In company building, distribution questions show up in compensation, ownership, margin allocation, vendor dependence, taxation, and resource prioritization.',
    reading: {
      title: 'Who gets what, and why',
      sourceLabel: 'Ricardian distribution problem',
      excerpt:
        'The division of total product among different claimants is not neutral. It shapes the incentives and tensions of the whole structure.',
      estimatedMinutes: 9,
      guidingQuestion:
        'What distribution pattern inside a company quietly shapes strategy more than leaders admit?',
    },
    practice: {
      type: 'decision_memo',
      title: 'Distribution memo',
      prompt:
        'Write a memo on one distribution tension: compensation, margin sharing, channel conflict, or ownership dilution. Explain the structural stakes and propose one executive decision.',
      expectedOutput: 'A short decision memo with recommendation and tradeoffs.',
      evaluationFocus: ['tradeoff quality', 'distribution logic', 'executive decisiveness'],
    },
    reflectionPrompt:
      'Which distribution conflict do you find hardest to speak about directly?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Distribution',
      'Distribution shapes incentives, conflict, and long-term strategic behavior.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow moves from domestic distribution to international advantage and strategic specialization.',
      nextLessonSlug: 'comparative-advantage',
    },
    primaryStructure: 'economic_structure',
    secondaryStructures: ['organizational_structure', 'political_structure'],
    relatedConcepts: ['wages', 'profits', 'allocation'],
    difficulty: 4,
  },
  {
    id: 'm1-day8-comparative-advantage',
    slug: 'comparative-advantage',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 8,
    title: 'Comparative advantage',
    openingFrame:
      'Executive strategy improves when you stop asking only what is absolutely stronger and start asking where relative advantage is structurally superior.',
    authorReference: {
      type: 'author',
      name: 'David Ricardo',
      workTitle: 'Principles of Political Economy and Taxation',
      summary:
        'Ricardo shows that even less efficient actors can gain through specialization when relative costs differ.',
    },
    coreIdea:
      'Comparative advantage explains why specialization can be rational even when one actor is weaker in absolute terms, as long as relative tradeoffs differ.',
    practicalTranslation:
      'For founders and consultants, this means strategy should focus on relative advantage: where your organization is disproportionately better, not merely competent.',
    reading: {
      title: 'Relative advantage over absolute strength',
      sourceLabel: 'Ricardian trade logic',
      excerpt:
        'Mutual gain from specialization can emerge when actors focus on what they are relatively better positioned to perform.',
      estimatedMinutes: 8,
      guidingQuestion:
        'What is your current business or career comparative advantage, not just your general capability?',
    },
    practice: {
      type: 'business_application',
      title: 'Relative advantage brief',
      prompt:
        'Write a brief explaining the comparative advantage of a company, team, or your own consulting profile. Define what should be emphasized and what should be de-emphasized.',
      expectedOutput: 'A strategic note with one focus recommendation.',
      evaluationFocus: ['strategic focus', 'positioning clarity', 'resource discipline'],
    },
    reflectionPrompt:
      'Where are you wasting effort competing on terrain where your relative advantage is weak?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Comparative advantage',
      'Strategy should emphasize relative structural advantage rather than undifferentiated effort.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow complicates the picture: different sectors do not always benefit equally from the same structure.',
      nextLessonSlug: 'conflict-between-sectors',
    },
    primaryStructure: 'economic_structure',
    secondaryStructures: ['operational_structure', 'organizational_structure'],
    relatedConcepts: ['tradeoffs', 'specialization', 'positioning'],
    difficulty: 3,
  },
  {
    id: 'm1-day9-conflict-between-sectors',
    slug: 'conflict-between-sectors',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 9,
    title: 'Conflict between sectors',
    openingFrame:
      'Structures do not benefit every sector equally. Executive judgment requires seeing where gains for one part of the economy create pressure elsewhere.',
    authorReference: {
      type: 'author',
      name: 'Karl Marx',
      workTitle: 'Capital',
      summary:
        'Marx reframes political economy around conflict, contradiction, and uneven outcomes across classes and sectors.',
    },
    coreIdea:
      'Economic structures generate conflict because different sectors, classes, and institutions do not benefit symmetrically from the same arrangements.',
    practicalTranslation:
      'In strategy, transformation programs, platform shifts, or market reallocation, some functions win while others lose. Executives must identify where conflict is structural rather than accidental.',
    reading: {
      title: 'Contradiction and uneven gain',
      sourceLabel: 'Marxian structural conflict lens',
      excerpt:
        'Economic development does not produce neutral harmony. It redistributes power, pressure, and vulnerability across different positions.',
      estimatedMinutes: 10,
      guidingQuestion:
        'What current business change looks like progress from one sector and threat from another?',
    },
    practice: {
      type: 'analysis',
      title: 'Sector conflict map',
      prompt:
        'Choose a transformation: AI adoption, outsourcing, regulation, pricing change, or platform expansion. Map which sectors or stakeholder groups gain, lose, resist, or capture advantage.',
      expectedOutput: 'A conflict map with an executive implication.',
      evaluationFocus: ['conflict realism', 'stakeholder mapping', 'strategic foresight'],
    },
    reflectionPrompt:
      'Where do you still describe structural conflict as if it were only a communication problem?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Conflict between sectors',
      'Economic structures distribute benefits unevenly and generate recurring conflict across positions.',
    ),
    xpReward: {
      completion: 30,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 60,
    },
    nextStep: {
      summary:
        'Tomorrow closes the month by connecting technology to productivity, coordination, and strategic leverage.',
      nextLessonSlug: 'technology-as-productivity-amplifier',
    },
    primaryStructure: 'political_structure',
    secondaryStructures: ['economic_structure', 'organizational_structure'],
    relatedConcepts: ['conflict', 'contradiction', 'stakeholder asymmetry'],
    difficulty: 4,
  },
  {
    id: 'm1-day10-technology-as-productivity-amplifier',
    slug: 'technology-as-productivity-amplifier',
    moduleId: 'month-1-classical-political-economy',
    monthIndex: 1,
    dayIndex: 10,
    title: 'Technology as productivity amplifier',
    openingFrame:
      'Technology does not create value by itself. It amplifies the productivity of a structure that is already designed well or poorly.',
    authorReference: {
      type: 'author',
      name: 'Adam Smith',
      workTitle: 'The Wealth of Nations',
      summary:
        'Smith links productivity not only to labor division but also to instruments and the practical means that amplify labor.',
    },
    coreIdea:
      'Technology multiplies productive capacity when it is embedded in coherent economic, organizational, and operational structures.',
    practicalTranslation:
      'For a future founder or executive consultant, the question is never just whether a tool is powerful. The question is whether the surrounding workflow, authority model, incentives, and commercial logic allow the tool to compound output.',
    reading: {
      title: 'Tools inside structure',
      sourceLabel: 'Classical productivity extended into modern technology',
      excerpt:
        'Instruments can extend labor power dramatically, but only where the broader arrangement of work makes that extension usable and cumulative.',
      estimatedMinutes: 9,
      guidingQuestion:
        'What technology in your environment is currently being overvalued because its surrounding structure is weak?',
    },
    practice: {
      type: 'decision_memo',
      title: 'Technology leverage memo',
      prompt:
        'Write a memo evaluating one technology adoption decision. Explain whether the organization has the structure to convert the tool into real productivity and strategic gain.',
      expectedOutput: 'A decision memo with go, no-go, or redesign recommendation.',
      evaluationFocus: ['technology judgment', 'structural thinking', 'executive clarity'],
    },
    reflectionPrompt:
      'When do you instinctively think in tools before thinking in structure?',
    aiFeedbackRequest: buildFeedbackTemplate(
      'Technology as productivity amplifier',
      'Technology compounds the quality of the structure around it rather than solving structural weakness by itself.',
    ),
    xpReward: {
      completion: 40,
      qualityMax: 20,
      streakBonus: 10,
      totalMax: 70,
    },
    nextStep: {
      summary:
        'Month 2 can now move beyond classical political economy into institutional, entrepreneurial, or strategic extensions of structural thinking.',
      nextLessonSlug: null,
    },
    primaryStructure: 'technological_structure',
    secondaryStructures: ['operational_structure', 'organizational_structure', 'economic_structure'],
    relatedConcepts: ['amplification', 'tooling', 'workflow design'],
    difficulty: 4,
  },
];
