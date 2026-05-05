import { Card } from '@/components/Card';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export function HomePage() {
  return (
    <PlaceholderScreen
      title="Daily command center"
      description="A compact overview of active learning streaks, current exercises, and AI-assisted coaching."
      eyebrow="Today"
      metric="3 focus tracks"
      highlights={[
        'Memory lane: review recent facts, names, and structured recall prompts.',
        'Reasoning lab: continue a guided breakdown of a policy or argument.',
      ]}
      extra={
        <Card>
          <p className="text-sm leading-6 text-textMuted">
            Leadership practice and decision journals will surface here once the data
            layer is connected.
          </p>
        </Card>
      }
    />
  );
}
