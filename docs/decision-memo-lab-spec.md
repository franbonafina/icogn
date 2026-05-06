# Decision Memo Lab

## Purpose

Decision Memo Lab is a guided workspace for learning how to write executive decision memos that integrate structural analysis, tradeoff quality, and practical judgment.

It should train the user to move from opinion or technical commentary into an executive decision artifact.

## Memo sections

Each memo must include:

1. Decision title
2. Context
3. Actors involved
4. Interests
5. Dignity / recognition at stake
6. Legal or institutional frame
7. Economic frame
8. Political frame
9. Operational frame
10. Technological frame
11. Options
12. Decision criteria
13. Recommended decision
14. Rejected alternatives
15. Risks
16. Evidence that could change the decision
17. 30/60/90-day review metrics

## Component design

- `DecisionMemoLabPage`
  - route-level container
  - loads draft
  - owns save, review, and publish actions

- `DecisionMemoProgressHeader`
  - memo title
  - status
  - XP potential
  - save state

- `DecisionMemoGuidedForm`
  - main guided form container
  - renders sections in sequence

- `DecisionMemoFrameSection`
  - context
  - actors
  - interests
  - dignity / recognition
  - legal, economic, political, operational, technological frames

- `DecisionMemoOptionSection`
  - options
  - decision criteria
  - recommended decision
  - rejected alternatives

- `DecisionMemoRiskSection`
  - risks
  - evidence that could change the decision
  - 30/60/90-day review metrics

- `DecisionMemoReflectionSection`
  - user reflection
  - related authors
  - related concepts

- `DecisionMemoAiReviewPanel`
  - AI feedback request
  - score display
  - revision guidance

- `DecisionMemoFooterActions`
  - save draft
  - request AI feedback
  - publish to portfolio

## Firestore persistence

Primary collection:

- `formationDecisionMemos`

Draft and final artifacts:

- drafts stay in `formationDecisionMemos`
- final published memos create artifacts in `formationPortfolioArtifacts`

Suggested workflow:

1. Save draft to `formationDecisionMemos`
2. Request AI review
3. Save scores and feedback back to the memo
4. Mark memo completed
5. Publish final artifact to portfolio

## AI feedback prompt

The AI should evaluate the memo with a demanding executive standard.

Prompt goals:

- assess clarity
- assess judgment
- assess structure across frames
- assess risk awareness
- assess executive language
- identify blind spots
- suggest revision

Return:

- summary
- strengths
- weaknesses
- suggested next steps
- rubric scores

## Scoring rubric

### Clarity

Does the memo state the decision, rationale, and implications without ambiguity?

### Judgment

Does the recommendation show serious tradeoff thinking and appropriate executive judgment?

### Structure

Does the memo reason coherently across legal, economic, political, operational, and technological frames?

### Risk awareness

Does the memo identify downside, uncertainty, and disconfirming evidence seriously?

### Executive language

Is the memo concise, legible, practical, and suitable for leadership review?

## Badge rules

- `First Memo Shipped`
  - publish the first final memo

- `Clear Call`
  - clarity score >= 5 on a final memo

- `Cold Risk Reader`
  - risk awareness score >= 5 on a final memo

- `Multi-Frame Operator`
  - complete 3 memos with structure score >= 4

- `Executive Language`
  - complete 3 memos with executive language score >= 4
