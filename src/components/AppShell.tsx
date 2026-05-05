import type { PropsWithChildren } from 'react';

import { MobileNav } from '@/components/MobileNav';
import { Sidebar } from '@/components/Sidebar';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <Sidebar />
        <main className="w-full">
          <div className="mx-auto flex min-h-screen max-w-shell flex-col gap-6 px-4 pb-28 pt-6 sm:px-6 md:max-w-none md:px-8 md:pb-8 md:pt-8">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
