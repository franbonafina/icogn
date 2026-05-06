import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import { loadFormationOverview, type FormationOverview } from '@/features/formation/formationService';

export function FormationPage() {
  const [overview, setOverview] = useState<FormationOverview | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadOverview() {
    try {
      setErrorMessage('');
      const nextOverview = await loadFormationOverview();
      setOverview(nextOverview);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'The formation path could not be loaded.',
      );
    }
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Formation Path"
        description="A private progression engine for structural reading, executive judgment, and founder-grade output."
        action={
          <Link to="/app/formation/daily">
            <Button>Open today</Button>
          </Link>
        }
      />

      {errorMessage ? (
        <ScreenState
          eyebrow="Formation error"
          title="The formation path could not load."
          description={errorMessage}
          actionLabel="Try again"
          onAction={() => void loadOverview()}
          tone="error"
        />
      ) : !overview ? (
        <div className="space-y-4">
          <Card elevated className="space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 rounded-3xl" />
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-28 rounded-[1.75rem]" />
            <Skeleton className="h-28 rounded-[1.75rem]" />
            <Skeleton className="h-28 rounded-[1.75rem]" />
            <Skeleton className="h-28 rounded-[1.75rem]" />
          </div>
        </div>
      ) : (
        <>
          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Current module</p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                {overview.currentModule.title}
              </h2>
              <p className="text-sm leading-6 text-textMuted">{overview.currentModule.description}</p>
            </div>

            {overview.currentTask ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Today</p>
                <p className="mt-2 text-lg font-semibold text-text">{overview.currentTask.title}</p>
                <p className="mt-2 text-sm leading-6 text-textMuted">{overview.currentTask.objective}</p>
                <div className="mt-4">
                  <Link to="/app/formation/daily">
                    <Button fullWidth>Continue today&apos;s formation</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <ScreenState
                eyebrow="Daily path"
                title="No active daily task."
                description="Your current track is seeded, but there is no active task assigned yet."
              />
            )}
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">XP</p>
              <p className="text-3xl font-semibold tracking-tight text-text">{overview.progress.xp}</p>
            </Card>
            <Card className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Level</p>
              <p className="text-3xl font-semibold tracking-tight text-text">{overview.progress.level}</p>
            </Card>
            <Card className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Streak</p>
              <p className="text-3xl font-semibold tracking-tight text-text">{overview.progress.streakDays}</p>
            </Card>
            <Card className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Week completion</p>
              <p className="text-3xl font-semibold tracking-tight text-text">
                {overview.progress.weeklyCompletionRate}%
              </p>
            </Card>
          </div>

          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Track surface</p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                Work across study, output, and structural reading.
              </h2>
            </div>

            <div className="grid gap-3">
              <Link to="/app/formation/daily">
                <Button fullWidth className="h-14">
                  Daily formation
                </Button>
              </Link>
              <Link to="/app/formation/library">
                <Button fullWidth className="h-14" variant="secondary">
                  Author library
                </Button>
              </Link>
              <Link to="/app/formation/memos">
                <Button fullWidth className="h-14" variant="secondary">
                  Decision Memo Lab
                </Button>
              </Link>
              <Link to="/app/formation/progression">
                <Button fullWidth className="h-14" variant="secondary">
                  Progression map
                </Button>
              </Link>
            </div>
          </Card>

          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Monthly milestone</p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                {overview.milestone?.title ?? 'Month 1 strategic memo'}
              </h2>
            </div>
            <p className="text-sm leading-6 text-textMuted">
              {overview.milestone?.brief ??
                'Consolidate the first month into one serious strategic artifact.'}
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
