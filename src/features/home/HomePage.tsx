import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import { loadHomeDashboard, type DashboardData } from '@/features/home/homeService';

function formatAverage(value: number | null) {
  return value === null ? 'N/A' : value.toFixed(1);
}

export function HomePage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadDashboard() {
    try {
      setErrorMessage('');
      const nextDashboard = await loadHomeDashboard();
      setDashboard(nextDashboard);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not load the home dashboard.',
      );
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={dashboard ? `Good focus, ${dashboard.greetingName}.` : 'Good focus.'}
        description="Your personal operating system for learning, communication, and judgment."
      />

      {errorMessage ? (
        <ScreenState
          eyebrow="Dashboard error"
          title="The home view could not load."
          description={errorMessage}
          actionLabel="Try again"
          onAction={() => void loadDashboard()}
          tone="error"
        />
      ) : !dashboard ? (
        <>
          <Card elevated className="space-y-4 p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <div className="grid gap-3">
              <Skeleton className="h-20 rounded-3xl" />
              <Skeleton className="h-20 rounded-3xl" />
              <Skeleton className="h-20 rounded-3xl" />
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-28 rounded-[1.75rem]" />
            <Skeleton className="h-28 rounded-[1.75rem]" />
            <Skeleton className="h-28 rounded-[1.75rem]" />
            <Skeleton className="h-28 rounded-[1.75rem]" />
          </div>
        </>
      ) : (
        <>
          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Today&apos;s queue
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                Start with the next high-leverage reps.
              </h2>
            </div>

            <div className="grid gap-3">
              {dashboard.dueConcepts.length > 0 ? (
                dashboard.dueConcepts.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <p className="text-sm font-medium text-text">{item.title}</p>
                    <p className="mt-1 text-sm text-textMuted">{item.mode}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-5">
                  <p className="text-sm font-medium text-text">No due concepts right now.</p>
                  <p className="mt-2 text-sm leading-6 text-textMuted">
                    Use today&apos;s speech or decision practice to keep the rhythm without adding clutter.
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-3">
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                  Suggested speech practice
                </p>
                <p className="text-sm leading-6 text-textMuted">
                  {dashboard.suggestedSpeechPractice}
                </p>
              </Card>

              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                  Suggested decision scenario
                </p>
                <p className="text-sm font-medium text-text">
                  {dashboard.suggestedDecisionScenario.title}
                </p>
                <p className="text-sm leading-6 text-textMuted">
                  {dashboard.suggestedDecisionScenario.summary}
                </p>
              </Card>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
                Concepts reviewed
              </p>
              <p className="text-3xl font-semibold tracking-tight text-text">
                {dashboard.progress.conceptsReviewed}
              </p>
            </Card>
            <Card className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
                Recall avg
              </p>
              <p className="text-3xl font-semibold tracking-tight text-text">
                {formatAverage(dashboard.progress.recallScoreAverage)}
              </p>
            </Card>
            <Card className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
                Speech avg
              </p>
              <p className="text-3xl font-semibold tracking-tight text-text">
                {formatAverage(dashboard.progress.speechScoreAverage)}
              </p>
            </Card>
            <Card className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
                Decision avg
              </p>
              <p className="text-3xl font-semibold tracking-tight text-text">
                {formatAverage(dashboard.progress.decisionScoreAverage)}
              </p>
            </Card>
          </div>

          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Profile insight
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                One signal to protect. One weakness to attack.
              </h2>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Strength</p>
                <p className="mt-2 text-sm text-text">{dashboard.insight.strength}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Weakness</p>
                <p className="mt-2 text-sm text-text">{dashboard.insight.weakness}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
                  Recommended action
                </p>
                <p className="mt-2 text-sm text-text">{dashboard.insight.recommendedAction}</p>
              </div>
            </div>
          </Card>

          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Quick actions
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                Move directly into practice.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/app/learn/new">
                <Button fullWidth className="h-14" variant="secondary">
                  Add concept
                </Button>
              </Link>
              <Link to="/app/learn">
                <Button fullWidth className="h-14">
                  Start review
                </Button>
              </Link>
              <Link to="/app/speech">
                <Button fullWidth className="h-14" variant="secondary">
                  Practice speech
                </Button>
              </Link>
              <Link to="/app/decision">
                <Button fullWidth className="h-14">
                  Decision scenario
                </Button>
              </Link>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
