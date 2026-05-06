# CivicMind Product Principles

## Product mission

CivicMind is a private, mobile-first cognitive training system for people whose work depends on remembering clearly, reasoning well, speaking persuasively, and making sound decisions under pressure.

The product should feel like a personal operating system for intellectual and leadership development, not like a consumer learning app.

## Target user

The primary user is an adult operator, leader, founder, manager, public thinker, advisor, or ambitious professional who wants to strengthen:

- conceptual memory
- cultural and civic literacy
- reasoning quality
- argumentation
- oral expression
- decision-making
- leadership judgment

These users are not looking for entertainment. They want disciplined practice, clear feedback, and visible intellectual progress.

## Non-goals

CivicMind is not:

- a generic flashcard app
- a school product for children or classrooms
- a gamified streak machine
- a social feed or community-first product
- a broad knowledge encyclopedia
- a motivational coaching app built on vague encouragement

If a feature makes the product feel childish, noisy, casual, or addictive-by-design, it is probably wrong.

## Core learning loops

The product should reinforce a small number of serious practice loops:

1. Capture
Turn reading, notes, speeches, quotes, arguments, and source material into structured learning items.

2. Recall
Practice retrieval through spaced repetition, active recall, and interleaving.

3. Express
Respond to prompts verbally or in writing and receive structured feedback on clarity, argument, and communication quality.

4. Decide
Work through realistic scenarios that train tradeoff reasoning, risk awareness, ethical judgment, and actionability.

5. Adapt
Use profile memory to identify strengths, weaknesses, recurring errors, and the next most useful practice.

Each loop should be short, repeatable, and usable from a phone without friction.

## UX principles

- Mobile-first by default. The product should work naturally in short, focused sessions on a phone.
- Serious visual tone. Dark, minimal, calm, and intellectually credible.
- One primary action per screen. Reduce branching and cognitive overload.
- Strong hierarchy. The user should always know what matters now, what is optional, and what comes next.
- Minimal clutter. Show only the information needed for the current decision or practice step.
- Large tap targets and stable layouts. The interface should feel deliberate, not dense.
- No childish metaphors. Avoid mascots, badges, confetti, cartoonish visuals, or school-like framing.
- Feedback should be direct and useful. Prefer clarity over cheerleading.

## AI principles

- AI is an evaluator, structuring layer, and practice partner, not the product itself.
- AI should improve discipline, not replace thinking.
- Outputs should be structured, auditable, and easy to inspect.
- Favor precise feedback over flattering feedback.
- Model/provider choice must remain abstracted so the system can evolve without rewriting product flows.
- API keys and model execution stay server-side only.
- AI should support human judgment, not simulate certainty where uncertainty should remain visible.

## Data principles

- Store only what improves training quality, continuity, and personalization.
- Keep user data model simple, explicit, and extensible.
- Separate UI concerns from Firestore access through repositories and services.
- Preserve clean boundaries between source material, practice history, evaluations, and profile memory.
- Treat profile memory as a longitudinal training record, not as a surveillance layer.
- Default toward privacy, constrained access, and internal-use assumptions.

## Decision rule

When making future product decisions, prefer the option that makes CivicMind feel more like a private operating system for intellectual and leadership development, and less like a generic education app.
