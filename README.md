# icogn

icogn is a mobile-first internal leadership learning platform focused on memory, judgment, argumentation, decision-making, and public expression through AI-assisted practice.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase Hosting
- Cloud Firestore
- Firebase Functions
- Groq as the first LLM provider
- Provider-agnostic AI layer prepared for OpenAI and Anthropic

## Product shape

- Public landing page for private/internal cohort access
- Dark, mobile-first interface
- Firestore repositories isolated from UI components
- AI provider and model selection exposed in the profile layer
- Firebase-ready frontend and backend structure

## Project structure

```text
src/
  app/
  components/
  features/
    auth/
    home/
    learning/
    speech/
    decision/
    profile/
  lib/
    ai/
    firebase/
    learning/
  types/
functions/
docs/
```

## Local setup

1. Install dependencies:

```bash
npm install
npm --prefix functions install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in the Firebase web config and default AI settings in `.env.local`.

4. Start the app:

```bash
npm run dev
```

## Firebase

The repo is already configured for the Firebase project:

- `civicmind-ctenucxj`

Helpful commands:

```bash
npm run firebase:build
npm run firebase:deploy:firestore
npm run firebase:deploy:functions
npm run firebase:deploy:hosting
npm run firebase:deploy
```

See [docs/firebase-setup.md](docs/firebase-setup.md) for the CLI flow.

## Secrets and config

- Do not commit `.env.local`
- Do not commit Firebase or Groq secrets
- Keep frontend config in Vite env vars
- Keep backend secrets in Firebase Functions secrets

## Current status

- Firestore database created and deployed
- Firebase Hosting deployed
- Public landing page implemented
- Firestore data model and repositories implemented
- Provider/model selection surfaced in the profile UI
