import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/components/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
  }
>;

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-text text-background hover:bg-accentMuted focus-visible:outline-text shadow-[0_10px_30px_rgba(255,255,255,0.08)]',
  secondary:
    'bg-surfaceMuted text-text hover:bg-[#1c1f2a] focus-visible:outline-surfaceMuted',
  ghost:
    'bg-transparent text-textMuted hover:bg-surface/70 hover:text-text focus-visible:outline-border',
};

export function Button({
  children,
  className,
  fullWidth = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-medium transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
