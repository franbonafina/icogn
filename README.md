# icogn

icogn is a mobile-first internal leadership learning platform focused on memory, judgment, argumentation, decision-making, and public expression through AI-assisted practice.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase Hosting
- Cloud Firestore
- Groq as the first LLM provider
- Provider-agnostic AI layer prepared for OpenAI and Anthropic

## Product shape

- Public landing page for private/internal cohort access
- Dark, mobile-first interface
- Firestore repositories isolated from UI components
- AI provider and model selection exposed in the profile layer
- Firebase-ready frontend structure with direct browser AI for the private prototype

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
docs/
```

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in the Firebase web config, `VITE_GROQ_API_KEY`, and default AI settings in `.env.local`.

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
npm run firebase:deploy:hosting
npm run firebase:deploy:all
npm run firebase:deploy
```

## Development seeds

Admin seed scripts are available for local development and use the Firebase Admin SDK.

1. Create a local seed env file:

```bash
cp .env.seeds.example .env.seeds.local
```

2. Fill in:

```bash
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SEED_USER_ID=demo-user
SEED_ACCESS_CODE=CIVIC-DEMO-001
```

3. Run individual scripts:

```bash
npm run seed:access-codes
npm run seed:learning-items
npm run seed:decision-scenarios
npm run seed:profile
```

4. Or run the full development seed:

```bash
npm run seed:dev
```

The seed set includes:

- access code `CIVIC-DEMO-001`
- demo learning items across democracy, leadership, negotiation, public speaking, product strategy, systems thinking, ethics, economics, civic institutions, and argumentation
- demo decision scenarios
- a demo profile memory record

## Secrets and config

- Do not commit `.env.local`
- Do not commit Firebase or Groq secrets
- Keep frontend config in Vite env vars
- For this private prototype, Groq is called directly from the browser via `VITE_GROQ_API_KEY`
- Do not treat `VITE_GROQ_API_KEY` as a long-term secure secret

## Current status

- Firestore database created and deployed
- Firebase Hosting deployed
- Public landing page implemented
- Firestore data model and repositories implemented
- Provider/model selection surfaced in the profile UI
- AI flows run directly against Groq in the browser to remain compatible with Firebase Spark
