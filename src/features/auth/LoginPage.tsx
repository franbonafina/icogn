import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';

export function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-shell flex-col gap-6 px-4 pb-10 pt-8 sm:px-6">
      <PageHeader
        title="Private access"
        description="Enter with your internal credentials or access code. Authentication connects to Firebase Auth when the production flow is enabled."
      />

      <Card elevated className="space-y-5 p-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Sign in</p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            Continue into your learning environment.
          </h2>
          <p className="text-sm leading-6 text-textMuted">
            Use the email tied to your cohort. If access is invitation-only, the code can be validated in the next backend pass.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-textMuted" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="h-14 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
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
              className="h-14 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
              placeholder="••••••••"
              type="password"
            />
          </div>
        </div>

        <Button fullWidth className="h-14 text-base">
          Continue
        </Button>
      </Card>

      <ScreenState
        eyebrow="Access notes"
        title="Secure entry is being wired for production."
        description="For now this screen holds the route, form, and tone of the real authentication flow so the rest of the product can be tested end to end."
      />
    </div>
  );
}
