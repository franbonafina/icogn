import type { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/components/utils';

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    elevated?: boolean;
  }
>;

export function Card({
  children,
  className,
  elevated = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-surface/85 p-5 backdrop-blur-sm',
        elevated && 'shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
