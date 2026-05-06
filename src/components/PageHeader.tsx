import type { ReactNode } from 'react';

import { Brand } from '@/components/Brand';

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <Brand compact />
        <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-text">{title}</h1>
        {description ? (
          <p className="max-w-xl text-sm leading-6 text-textMuted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
