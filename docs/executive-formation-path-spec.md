# Executive Formation Path

## Purpose

Executive Formation Path is a guided progression module inside CivicMind for a user moving from technical architect or solution consultant toward executive consultant and future founder.

Its role is not to deliver a generic course. Its role is to build executive capacity through daily practice, structured reading, reflection, communication drills, decision writing, and artifact creation.

The module should train a user to:

- think in structures rather than isolated tools
- interpret economic, political, legal, organizational, symbolic, operational, and technological reality
- connect theory to real business and institutional decisions
- write and speak with executive clarity
- produce reusable strategic artifacts
- accumulate visible progression over weeks and months

## Core framing

The central lens is **structures**, not systems.

The module should repeatedly train the user to read reality through:

- economic structures
- legal structures
- political structures
- organizational structures
- symbolic structures
- operational structures
- technological structures

Each reading, memo, reflection, and scenario should map back to one or more of these structures.

## Intellectual foundation

The content spine can draw from the following authors and traditions:

- Adam Smith
- David Ricardo
- Karl Marx
- Carl Menger
- Ludwig von Mises
- Friedrich Hayek
- Israel Kirzner
- John Maynard Keynes
- Juan Perón
- Karl Popper
- Thomas Kuhn
- Michael Polanyi
- Nassim Taleb
- G.W.F. Hegel
- Friedrich Nietzsche
- Max Weber
- Michel Foucault
- Pierre Bourdieu
- Sun Tzu
- Carl von Clausewitz
- John Boyd
- Peter Drucker
- Andy Grove
- Michael Porter
- Richard Rumelt
- Clayton Christensen
- Barbara Minto
- Robert Cialdini
- April Dunford
- Chris Voss

In the product, these should appear as reference traditions, reading anchors, prompts, and comparisons, not as a passive library dump.

## User journey

1. The user enters the Executive Formation Path from the main app.
2. The user sees today’s progression card with one primary task and supporting tasks.
3. The user completes a short sequence:
   - theory reading
   - author insight
   - reflection
   - decision memo or business structure analysis
   - communication or argumentation drill
4. The user submits written or spoken output.
5. The AI assistant evaluates structure, clarity, judgment, and progression quality.
6. The system updates XP, streak, weekly path progress, and portfolio artifacts.
7. At the end of the week, the user receives a synthesis review.
8. At the end of the month, the user completes a milestone artifact with higher difficulty and stronger executive framing.

## Core screens

### 1. Formation Home

Purpose:
- show the current week, current theme, active streak, XP, milestone status, and today’s primary action

Key elements:
- current formation stage
- today’s task card
- weekly structure theme
- progression meter
- latest artifact
- next milestone

### 2. Daily Session

Purpose:
- run one focused progression session from beginning to end

Key elements:
- today’s objective
- relevant structure tags
- reading excerpt or theory summary
- author lens
- reflection prompt
- memo or analysis task
- spoken or written executive communication task
- submit and review state

### 3. Weekly Review

Purpose:
- consolidate what the user learned, what patterns emerged, and what needs reinforcement

Key elements:
- week theme
- concepts practiced
- strongest outputs
- recurring weaknesses
- structure coverage
- recommended next focus

### 4. Monthly Milestone

Purpose:
- produce a more serious artifact that demonstrates cumulative executive development

Key elements:
- milestone brief
- success rubric
- required deliverables
- deadline and progress
- final evaluation

### 5. Author Map

Purpose:
- show the intellectual threads behind the path

Key elements:
- authors grouped by theme
- structure categories connected to each author
- completed readings
- notes and extracted insights

### 6. Portfolio

Purpose:
- collect final artifacts the user can refine and reuse

Key elements:
- memos
- structure analyses
- founder theses
- executive briefings
- communication recordings
- monthly milestone outputs

## Data model

The module can be implemented with additive collections and fields without redesigning the app.

### `formationPaths`

- `id`
- `slug`
- `title`
- `description`
- `active`
- `targetProfile`
- `mission`
- `createdAt`
- `updatedAt`

### `formationStages`

- `id`
- `pathId`
- `title`
- `order`
- `theme`
- `description`
- `weekCount`
- `createdAt`
- `updatedAt`

### `formationWeeks`

- `id`
- `pathId`
- `stageId`
- `order`
- `theme`
- `primaryStructure`
- `secondaryStructures`
- `learningGoals`
- `authorFocus`
- `milestoneType`
- `createdAt`
- `updatedAt`

### `formationTasks`

- `id`
- `pathId`
- `stageId`
- `weekId`
- `dayIndex`
- `title`
- `objective`
- `taskType`
  - `theory_reading`
  - `author_study`
  - `reflection`
  - `decision_memo`
  - `structure_analysis`
  - `speech_drill`
  - `negotiation_drill`
  - `business_case`
- `primaryStructure`
- `secondaryStructures`
- `authorReferences`
- `sourceText`
- `prompt`
- `instructions`
- `difficulty`
- `estimatedMinutes`
- `xpReward`
- `artifactType`
- `createdAt`
- `updatedAt`

### `formationEnrollments`

- `id`
- `userId`
- `pathId`
- `currentStageId`
- `currentWeekId`
- `currentDayIndex`
- `xp`
- `level`
- `streakDays`
- `weeklyCompletion`
- `monthlyMilestoneStatus`
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
- `attachments`
- `selfAssessment`
- `aiEvaluationId`
- `score`
- `xpEarned`
- `completedAt`
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
- `sourceTaskIds`
- `milestoneMonth`
- `status`
  - `draft`
  - `reviewed`
  - `final`
- `createdAt`
- `updatedAt`

## Gamification model

Gamification should feel disciplined and professional, not playful or childish.

Use:

- XP for completed tasks
- levels for progression visibility
- streaks for continuity
- weekly completion score
- structure coverage score
- artifact completion count
- milestone badges with restrained naming

Avoid:

- cartoon badges
- loot-box behavior
- noisy animations
- artificial urgency loops

Recommended progression signals:

- `XP`: earned for completion quality, not just clicking through
- `Level`: reflects cumulative executive formation progress
- `Streak`: daily continuity
- `Structure coverage`: indicates breadth across economic, legal, political, organizational, symbolic, operational, and technological structures
- `Artifact score`: indicates how many reusable portfolio outputs the user has produced

## Learning progression model

The path should work in nested loops:

- daily progression
- weekly synthesis
- monthly milestone
- final portfolio accumulation

### Daily

One primary task, optionally one secondary reinforcement task.

### Weekly

Each week has:

- one structure theme
- one author cluster
- one practical business or institutional lens
- one communication emphasis

### Monthly

Each month should culminate in one serious artifact.

### Stage progression

Possible MVP stage sequence:

1. Structural Thinking Foundations
2. Economic and Political Interpretation
3. Organizational and Strategic Judgment
4. Executive Communication and Persuasion
5. Founder Thinking and Market Positioning

## AI assistant behavior

The AI assistant should act as:

- a demanding study guide
- a memo reviewer
- a structure classifier
- a communication evaluator
- a progression coach

It should not act as:

- a motivational cheerleader
- an overprotective tutor
- a vague summarizer
- a replacement for difficult reading

AI tasks:

- convert raw reading notes into structured learning items
- generate author comparison prompts
- evaluate reflections for depth and clarity
- evaluate decision memos for judgment and structure awareness
- evaluate communication drills for executive tone and argumentation
- identify which structures the user is missing
- suggest the next most useful practice

AI feedback should emphasize:

- structural clarity
- conceptual precision
- argument quality
- executive usefulness
- blind spots
- actionable improvement

## Daily task format

Each daily task should follow a stable pattern:

1. Objective
One sentence describing the executive capability being trained.

2. Structure lens
One primary structure plus optional secondary structures.

3. Reading input
Short reading excerpt, concept summary, or author position.

4. Interpretation prompt
The user explains what the text means in practical executive terms.

5. Application prompt
The user connects it to business, institutions, markets, organizations, or founder decisions.

6. Output task
One concrete output:
- short memo
- structure map
- decision note
- spoken explanation
- positioning statement

7. Review
Self-score plus AI evaluation.

## Weekly review format

The weekly review should include:

- what structures were practiced
- what authors were studied
- what outputs were completed
- strongest insight from the week
- weakest recurring pattern
- one rewritten or refined artifact
- recommended next week focus

The weekly review should produce one concise synthesis note that becomes part of profile memory.

## Monthly milestone format

Each monthly milestone should feel like a serious executive checkpoint.

Examples:

- write an executive memo on a market or institutional structure
- analyze a company through structural lenses
- produce a founder thesis about a sector
- record a 5-minute briefing on a strategic position
- write a decision document for a high-stakes scenario

Monthly milestone evaluation should use:

- clarity
- structural depth
- practical relevance
- strategic judgment
- communication quality
- originality of synthesis

## Final deliverables

The path should accumulate reusable outputs, not only scores.

Target deliverables:

- executive reading notes
- structure analysis briefs
- author comparison memos
- decision memos
- market and business structure analyses
- founder thesis documents
- executive communication transcripts
- monthly milestone artifacts
- final curated portfolio

The final portfolio should demonstrate that the user can think, write, and communicate above the level of a purely technical operator.

## Edge cases

- User skips days:
  Resume without punitive reset. Preserve streak logic with mild decay rather than harsh restart.

- User completes tasks but with low-quality output:
  Award reduced XP and surface revision tasks.

- User reads but does not submit output:
  Mark partial completion and schedule a follow-up task.

- User focuses too narrowly on one structure:
  Increase structure balancing recommendations.

- User produces verbose but weak writing:
  Shift AI feedback toward concision and argument discipline.

- User tries to treat the module like passive content consumption:
  Re-center the flow on required output and review.

- Backend AI unavailable:
  Allow self-assessment and delayed evaluation fallback.

## MVP scope

The first private prototype should include:

- one formation path
- 4 to 8 weeks of structured progression
- daily task engine
- weekly review screen
- one monthly milestone flow
- structure tagging
- author tagging
- written outputs
- optional speech outputs
- XP, streak, and level tracking
- portfolio artifact collection
- AI feedback on reflection, memo, and speech tasks

MVP should not include:

- multiple parallel formation tracks
- social/community features
- complex cohort competition
- overbuilt curriculum authoring tools
- desktop-heavy dashboarding

## Future improvements

- adaptive path branching based on strengths and weaknesses
- more robust author graph and concept graph
- cohort mode for private leadership groups
- mentor review layer
- artifact export and presentation mode
- deeper structure comparison exercises
- founder simulation track
- company diagnosis labs
- negotiation simulation workflows
- milestone benchmarking against role archetypes
- long-term executive identity map

## Reference rule

When deciding how to build this module, prefer the option that makes it feel more like a disciplined progression engine for executive formation, and less like a course platform, note-taking tool, or generic flashcard feature.
