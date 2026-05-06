# Executive Formation Path Architecture

## Goal

Design the functional architecture for the Executive Formation Path module inside the existing React + Tailwind application.

The architecture should reuse the current app foundations:

- authentication
- user profile
- sidebar navigation
- home dashboard
- Firestore
- AI provider abstraction through browser-side Groq for the private prototype, with an OpenAI-compatible migration path later
- existing learning engine

The module should behave like a serious progression environment for executive formation, not like a generic course area.

## Module areas

The module includes:

1. Daily Formation
2. Author Library
3. Structure Analysis Lab
4. Decision Memo Lab
5. Executive Communication Lab
6. Gamification Dashboard
7. Progression Map
8. Portfolio

## High-level integration

The module should live as a first-class feature under `src/features/formation`.

Suggested folder structure:

- `src/features/formation/routes`
- `src/features/formation/components`
- `src/features/formation/services`
- `src/features/formation/hooks`
- `src/features/formation/types`
- `src/features/formation/lib`

Suggested route namespace:

- `/app/formation`
- `/app/formation/daily`
- `/app/formation/library`
- `/app/formation/structures`
- `/app/formation/memos`
- `/app/formation/communication`
- `/app/formation/progression`
- `/app/formation/gamification`
- `/app/formation/portfolio`

The existing home dashboard can later surface one entry card for today’s Executive Formation task.

## Routes

### `/app/formation`

Purpose:
- entry point and overview

Main content:
- current stage
- current week
- today’s primary task
- current streak
- next milestone
- quick links to labs and portfolio

### `/app/formation/daily`

Purpose:
- run the daily formation session

Main content:
- reading card
- author lens
- reflection prompt
- practice output
- AI review
- completion action

### `/app/formation/library`

Purpose:
- explore authors, books, schools, concepts, and structures

Main content:
- author index
- school filters
- concept tags
- structure tags
- reading status

### `/app/formation/library/:authorId`

Purpose:
- author detail page

Main content:
- author overview
- schools of thought
- key books
- key concepts
- structure relevance
- related tasks

### `/app/formation/structures`

Purpose:
- structure analysis lab home

Main content:
- create analysis
- recent analyses
- templates by subject

### `/app/formation/structures/:analysisId`

Purpose:
- active structure analysis workspace

Main content:
- subject context
- layered structure analysis
- notes
- AI critique
- save artifact

### `/app/formation/memos`

Purpose:
- decision memo lab home

Main content:
- create memo
- recent memos
- memo templates

### `/app/formation/memos/:memoId`

Purpose:
- active decision memo editor

Main content:
- prompt
- executive memo structure
- argument sections
- AI review
- version history

### `/app/formation/communication`

Purpose:
- executive communication lab home

Main content:
- communication drills
- rewrite tasks
- explanation tasks
- recent outputs

### `/app/formation/communication/:sessionId`

Purpose:
- active communication exercise

Main content:
- source idea
- target audience
- rewrite or speech prompt
- output capture
- AI scoring

### `/app/formation/gamification`

Purpose:
- progression signals and achievement summary

Main content:
- XP
- level
- streak
- badges
- completed authors
- completed artifacts
- unlocked modules

### `/app/formation/progression`

Purpose:
- 12-month progression map

Main content:
- modules by month
- current position
- completed milestones
- locked and unlocked modules

### `/app/formation/portfolio`

Purpose:
- final output library

Main content:
- essays
- memos
- frameworks
- pitches
- offers
- strategic maps

## Components

### Shared formation shell components

- `FormationHeader`
- `FormationSubnav`
- `FormationStagePill`
- `FormationProgressBar`
- `FormationEmptyState`
- `FormationStatCard`

### Daily Formation components

- `DailyFormationPage`
- `DailyTaskCard`
- `ReadingCard`
- `AuthorLensCard`
- `ReflectionPromptCard`
- `PracticeOutputEditor`
- `DailyEvaluationCard`
- `DailyCompletionFooter`

### Author Library components

- `AuthorLibraryPage`
- `AuthorFilters`
- `AuthorGrid`
- `AuthorCard`
- `AuthorDetailPage`
- `BookList`
- `ConceptTagGroup`
- `RelatedStructureList`

### Structure Analysis Lab components

- `StructureLabPage`
- `StructureAnalysisEditor`
- `StructureLayerSection`
- `StructureLensSwitcher`
- `StructurePromptPanel`
- `StructureAnalysisReviewCard`

Each analysis should explicitly handle:

- economic
- legal
- political
- organizational
- symbolic
- operational
- technological

### Decision Memo Lab components

- `DecisionMemoPage`
- `DecisionMemoEditor`
- `MemoTemplateSelector`
- `MemoSectionBlock`
- `MemoReviewPanel`
- `MemoVersionList`

### Executive Communication Lab components

- `CommunicationLabPage`
- `CommunicationTaskCard`
- `AudienceSelector`
- `ExecutiveRewriteEditor`
- `SpeechCapturePanel`
- `CommunicationEvaluationCard`

### Gamification components

- `GamificationPage`
- `XpSummaryCard`
- `LevelCard`
- `StreakCard`
- `BadgeGrid`
- `UnlockedModulesList`
- `ArtifactStatsCard`

### Progression Map components

- `ProgressionMapPage`
- `MonthTrack`
- `ModuleNode`
- `MilestoneCard`
- `UnlockStatusPill`

### Portfolio components

- `PortfolioPage`
- `PortfolioFilters`
- `ArtifactGrid`
- `ArtifactCard`
- `ArtifactDetailPage`
- `ArtifactExportActions`

## Data collections

Use additive Firestore collections.

### `formationPaths`

- `id`
- `slug`
- `title`
- `description`
- `active`
- `mission`
- `targetProfile`
- `createdAt`
- `updatedAt`

### `formationModules`

- `id`
- `pathId`
- `monthIndex`
- `title`
- `theme`
- `description`
- `unlocksAtLevel`
- `createdAt`
- `updatedAt`

### `formationWeeks`

- `id`
- `pathId`
- `moduleId`
- `weekIndex`
- `theme`
- `primaryStructure`
- `authorIds`
- `learningGoals`
- `milestoneType`
- `createdAt`
- `updatedAt`

### `formationDailyTasks`

- `id`
- `pathId`
- `moduleId`
- `weekId`
- `dayIndex`
- `title`
- `taskType`
- `readingText`
- `authorId`
- `schoolIds`
- `conceptIds`
- `primaryStructure`
- `secondaryStructures`
- `practicePrompt`
- `artifactType`
- `difficulty`
- `xpReward`
- `estimatedMinutes`
- `createdAt`
- `updatedAt`

### `formationAuthors`

- `id`
- `name`
- `slug`
- `schoolIds`
- `summary`
- `keyBooks`
- `keyConcepts`
- `structureTags`
- `priority`
- `createdAt`
- `updatedAt`

### `formationSchools`

- `id`
- `name`
- `summary`
- `createdAt`
- `updatedAt`

### `formationConcepts`

- `id`
- `name`
- `summary`
- `authorIds`
- `schoolIds`
- `structureTags`
- `createdAt`
- `updatedAt`

### `formationEnrollments`

- `id`
- `userId`
- `pathId`
- `currentModuleId`
- `currentWeekId`
- `currentDayIndex`
- `xp`
- `level`
- `streakDays`
- `completedAuthorIds`
- `unlockedModuleIds`
- `completedArtifactCount`
- `startedAt`
- `updatedAt`

### `formationTaskAttempts`

- `id`
- `userId`
- `pathId`
- `taskId`
- `weekId`
- `taskType`
- `writtenResponse`
- `speechTranscript`
- `selfScore`
- `aiEvaluationId`
- `xpEarned`
- `completed`
- `createdAt`
- `updatedAt`

### `formationStructureAnalyses`

- `id`
- `userId`
- `pathId`
- `title`
- `subjectType`
- `subjectLabel`
- `context`
- `economicLayer`
- `legalLayer`
- `politicalLayer`
- `organizationalLayer`
- `symbolicLayer`
- `operationalLayer`
- `technologicalLayer`
- `summary`
- `aiEvaluationId`
- `status`
- `createdAt`
- `updatedAt`

### `formationDecisionMemos`

- `id`
- `userId`
- `pathId`
- `title`
- `context`
- `decision`
- `reasoning`
- `risks`
- `expectedOutcome`
- `alternatives`
- `aiEvaluationId`
- `status`
- `createdAt`
- `updatedAt`

### `formationCommunicationSessions`

- `id`
- `userId`
- `pathId`
- `sourceIdea`
- `targetAudience`
- `format`
- `writtenOutput`
- `speechTranscript`
- `scores`
- `aiEvaluationId`
- `status`
- `createdAt`
- `updatedAt`

### `formationMilestones`

- `id`
- `userId`
- `pathId`
- `moduleId`
- `monthIndex`
- `title`
- `brief`
- `artifactIds`
- `status`
- `score`
- `createdAt`
- `updatedAt`

### `formationPortfolioArtifacts`

- `id`
- `userId`
- `pathId`
- `artifactType`
- `title`
- `summary`
- `content`
- `sourceCollection`
- `sourceId`
- `tags`
- `status`
- `createdAt`
- `updatedAt`

## API calls

In the current Firebase Spark-compatible prototype, AI calls go directly from the browser to Groq.

### Existing functions that can be reused

- `extractLearningItems`
- `evaluateRecallAnswer`
- `evaluateSpeechTranscript`
- `evaluateDecisionAttempt`

### New functions recommended

#### `evaluateFormationReflection`

Input:
- `task`
- `readingText`
- `userReflection`
- `structureTags`

Output:
- `clarityScore`
- `depthScore`
- `structureAwarenessScore`
- `feedback`
- `missingAngles`
- `suggestedRevision`

#### `evaluateStructureAnalysis`

Input:
- `subject`
- `analysisLayers`

Output:
- `coverageScore`
- `coherenceScore`
- `strategicUsefulnessScore`
- `blindSpots`
- `feedback`

#### `evaluateDecisionMemo`

Input:
- `memo`

Output:
- `clarity`
- `tradeoffQuality`
- `executiveTone`
- `actionability`
- `feedback`
- `revisionTasks`

#### `evaluateExecutiveCommunication`

Input:
- `sourceIdea`
- `targetAudience`
- `userOutput`

Output:
- `clarity`
- `compression`
- `executiveRelevance`
- `persuasion`
- `feedback`
- `rewrittenVersion`

#### `generateDailyFormationTask`

Input:
- `userProfileMemory`
- `currentModule`
- `currentWeek`
- `completedTasks`

Output:
- `dailyTask`

#### `generateWeeklyFormationReview`

Input:
- `weekAttempts`
- `profileMemory`

Output:
- `summary`
- `strengths`
- `weaknesses`
- `recommendedNextFocus`

#### `generateMonthlyMilestoneBrief`

Input:
- `module`
- `userProgress`

Output:
- `milestoneTitle`
- `brief`
- `deliverables`
- `evaluationRubric`

## AI prompts needed

### 1. Reading interpretation prompt

Purpose:
- evaluate whether the user can convert theory into practical executive interpretation

### 2. Author comparison prompt

Purpose:
- compare two authors or traditions through the lens of structures

### 3. Structure analysis prompt

Purpose:
- critique multi-layer analysis across economic, legal, political, organizational, symbolic, operational, and technological dimensions

### 4. Decision memo prompt

Purpose:
- evaluate memo quality using executive standards

### 5. Executive rewrite prompt

Purpose:
- transform dense or technical language into executive language

### 6. Weekly review synthesis prompt

Purpose:
- summarize weekly progression and recommend the next focus

### 7. Milestone brief generation prompt

Purpose:
- generate a serious monthly checkpoint artifact brief

## State management

Do not introduce a heavy state library for MVP.

Use:

- route-level `useState` for local editors
- `useEffect` for initial data load
- small feature hooks for module data orchestration
- repository/service layer for Firestore access
- existing app patterns for auth and current user

Suggested hooks:

- `useFormationEnrollment`
- `useDailyFormationTask`
- `useAuthorLibrary`
- `useStructureAnalysis`
- `useDecisionMemo`
- `useCommunicationSession`
- `useFormationGamification`
- `useFormationPortfolio`

Suggested service files:

- `formationEnrollmentService.ts`
- `formationTaskService.ts`
- `formationLibraryService.ts`
- `formationStructureService.ts`
- `formationMemoService.ts`
- `formationCommunicationService.ts`
- `formationGamificationService.ts`
- `formationPortfolioService.ts`

## User flow

### Primary flow

1. User opens `/app/formation`
2. User sees current module and today’s primary task
3. User starts `/app/formation/daily`
4. User reads, reflects, and produces output
5. User receives AI review
6. User earns XP and advances weekly completion
7. User optionally deepens work in Structure Lab, Memo Lab, or Communication Lab
8. Weekly review becomes available after enough completed tasks
9. Monthly milestone unlocks after the module cycle is complete
10. Strong outputs are saved into Portfolio

### Secondary flows

- User explores Author Library while doing daily tasks
- User manually creates a structure analysis
- User writes a decision memo outside the daily task
- User practices executive rewrites or spoken explanations

## MVP implementation order

### Phase 1

- add route group under `/app/formation`
- create Formation Home
- create Progression Map
- create enrollment and module data model

### Phase 2

- implement Daily Formation session
- seed authors, schools, concepts, modules, weeks, and tasks
- integrate completion, XP, streak, and weekly progress

### Phase 3

- implement Author Library
- add author detail pages
- connect author references from daily tasks

### Phase 4

- implement Decision Memo Lab
- implement Executive Communication Lab
- reuse existing evaluation patterns where possible

### Phase 5

- implement Structure Analysis Lab
- add multi-layer structure evaluation

### Phase 6

- implement Gamification Dashboard
- implement Portfolio
- implement Weekly Review and Monthly Milestone flows

## Practical MVP recommendation

For the first private prototype, the minimum coherent version is:

- Formation Home
- Progression Map
- Daily Formation
- Author Library
- Decision Memo Lab
- Executive Communication Lab
- XP / streak / level summary
- Portfolio artifact saving

Delay full Structure Analysis Lab depth until the daily loop and artifact pipeline are stable.

## Reference rule

If an architectural decision makes this module feel more like a progression engine for executive formation, keep it.

If it makes the module feel more like a content library, online course, or note-taking tool with weak output discipline, reject it.
