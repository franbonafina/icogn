import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export function LearnPage() {
  return (
    <PlaceholderScreen
      title="Learning flows"
      description="Memory, reasoning, and comprehension modules will live here with adaptive AI guidance."
      eyebrow="Learning"
      metric="Memory + reasoning"
      highlights={[
        'Guided recall sets for people, facts, and concepts.',
        'Reasoning drills that break complex issues into smaller claims.',
        'Provider-agnostic AI hooks are prepared for Groq first, then OpenAI and Claude.',
      ]}
    />
  );
}
