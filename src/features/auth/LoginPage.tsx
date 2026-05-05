import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';

export function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-shell flex-col gap-6 px-4 pb-10 pt-8 sm:px-6">
      <PageHeader
        title="Welcome back"
        description="Authentication will plug into Firebase Auth later. This placeholder keeps the route and layout ready."
      />

      <Card elevated className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full rounded-2xl border border-white/10 bg-surfaceMuted px-4 py-3 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            placeholder="name@example.com"
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="w-full rounded-2xl border border-white/10 bg-surfaceMuted px-4 py-3 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            placeholder="••••••••"
            type="password"
          />
        </div>
        <Button fullWidth>Continue</Button>
      </Card>
    </div>
  );
}
