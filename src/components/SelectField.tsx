import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/components/utils';

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ className, children, ...props }: SelectFieldProps) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-2xl border border-white/10 bg-surfaceMuted px-4 text-sm text-text outline-none transition focus:border-white/20',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
