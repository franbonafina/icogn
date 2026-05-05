import type { ReactNode } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Toggle } from '@/components/Toggle';

type PlaceholderScreenProps = {
  title: string;
  description: string;
  eyebrow?: string;
  metric?: string;
  highlights?: string[];
  actionLabel?: string;
  extra?: ReactNode;
};

export function PlaceholderScreen({
  title,
  description,
  eyebrow = 'Preview',
  metric = 'Coming next',
  highlights = [],
  actionLabel = 'Explore flow',
  extra,
}: PlaceholderScreenProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={<Toggle checked label={`${title} enabled`} />}
      />

      <Card elevated className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">{eyebrow}</p>
          <p className="text-3xl font-semibold tracking-tight text-text">{metric}</p>
        </div>
        <p className="text-sm leading-6 text-textMuted">
          This screen is a placeholder scaffold for the first icogn release.
        </p>
        <Button>{actionLabel}</Button>
      </Card>

      <div className="grid gap-4">
        {highlights.map((highlight) => (
          <Card key={highlight}>
            <p className="text-sm leading-6 text-textMuted">{highlight}</p>
          </Card>
        ))}
        {extra}
      </div>
    </div>
  );
}
