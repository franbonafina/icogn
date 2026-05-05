import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/components/utils';

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
  label?: string;
};

export function Toggle({
  checked,
  className,
  label = 'Toggle option',
  ...props
}: ToggleProps) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      role="switch"
      className={cn(
        'relative inline-flex h-7 w-12 items-center rounded-full border border-white/10 transition',
        checked ? 'bg-text' : 'bg-surfaceMuted',
        className,
      )}
      type="button"
      {...props}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 rounded-full bg-background transition',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}
