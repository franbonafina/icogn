import { NavLink } from 'react-router-dom';

import { cn } from '@/components/utils';

const navItems = [
  { to: '/app', label: 'Home', icon: '⌂' },
  { to: '/app/learn', label: 'Learn', icon: '◫' },
  { to: '/app/speech', label: 'Speech', icon: '◎' },
  { to: '/app/decision', label: 'Decide', icon: '◇' },
  { to: '/app/profile', label: 'Profile', icon: '◌' },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-shell grid-cols-5 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition',
                isActive ? 'bg-surface text-text' : 'text-textMuted',
              )
            }
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
