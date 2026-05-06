import type { ReactNode } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

type ScreenStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'error';
  icon?: ReactNode;
};

export function ScreenState({
  eyebrow = 'Status',
  title,
  description,
  actionLabel,
  onAction,
  tone = 'neutral',
  icon,
}: ScreenStateProps) {
  return (
    <Card
      elevated
      className={`space-y-4 p-5 ${
        tone === 'error' ? 'border-red-500/20 bg-red-500/[0.07]' : ''
      }`}
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-textMuted">{eyebrow}</p>
        <div className="flex items-start gap-3">
          {icon ? <div className="pt-0.5 text-textMuted">{icon}</div> : null}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-text">{title}</h2>
            <p className="text-sm leading-6 text-textMuted">{description}</p>
          </div>
        </div>
      </div>

      {actionLabel && onAction ? (
        <Button fullWidth onClick={onAction} variant={tone === 'error' ? 'secondary' : 'primary'}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
