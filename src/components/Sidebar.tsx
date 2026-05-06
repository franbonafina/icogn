import { Brand } from '@/components/Brand';
import { NavLink } from 'react-router-dom';

import { cn } from '@/components/utils';

const navItems = [
  { to: '/app', label: 'Home' },
  { to: '/app/formation', label: 'Formation' },
  { to: '/app/learn', label: 'Learning' },
  { to: '/app/speech', label: 'Speech' },
  { to: '/app/decision', label: 'Decision' },
  { to: '/app/profile', label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col justify-between border-r border-white/10 bg-black/20 px-6 py-8 md:flex">
      <div className="space-y-8">
        <div className="space-y-2">
          <Brand />
          <h2 className="pt-2 text-2xl font-semibold tracking-tight text-text">
            Train better judgment.
          </h2>
          <p className="max-w-xs text-sm leading-6 text-textMuted">
            A private operating system for memory, argumentation, communication, and executive judgment.
          </p>
        </div>

        <nav aria-label="Sidebar" className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                cn(
                  'block rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-surface text-text'
                    : 'text-textMuted hover:bg-surface/60 hover:text-text',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <p className="text-sm leading-6 text-textMuted">
        Server-side AI evaluation, deliberate practice, and steady profile memory over time.
      </p>
    </aside>
  );
}
