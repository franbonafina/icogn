import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import {
  loadFormationProgressionMap,
  type FormationProgressionMapData,
} from '@/features/formation/formationService';

function statusStyles(status: 'locked' | 'active' | 'completed') {
  if (status === 'completed') {
    return 'border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-200';
  }

  if (status === 'active') {
    return 'border-white/20 bg-white/[0.08] text-text';
  }

  return 'border-white/10 bg-white/[0.03] text-textMuted';
}

function artifactLabel(status: 'not_started' | 'in_progress' | 'completed') {
  if (status === 'completed') {
    return 'Completed';
  }

  if (status === 'in_progress') {
    return 'In progress';
  }

  return 'Not started';
}

export function FormationProgressionPage() {
  const [data, setData] = useState<FormationProgressionMapData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadData() {
    try {
      setErrorMessage('');
      const nextData = await loadFormationProgressionMap();
      setData(nextData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'The progression map could not be loaded.',
      );
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progression Map"
        description="A 12-month operating view of the formation path, from structural reading to founder-grade synthesis."
        action={
          <Link to="/app/formation">
            <Button variant="secondary">Formation hub</Button>
          </Link>
        }
      />

      {errorMessage ? (
        <ScreenState
          eyebrow="Progression error"
          title="The progression map could not load."
          description={errorMessage}
          actionLabel="Try again"
          onAction={() => void loadData()}
          tone="error"
        />
      ) : !data ? (
        <div className="space-y-4">
          <Card elevated className="grid grid-cols-3 gap-3 p-4">
            <Skeleton className="h-24 rounded-[1.5rem]" />
            <Skeleton className="h-24 rounded-[1.5rem]" />
            <Skeleton className="h-24 rounded-[1.5rem]" />
          </Card>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-[1.75rem]" />
            ))}
          </div>
        </div>
      ) : data.months.length === 0 ? (
        <ScreenState
          eyebrow="Progression"
          title="No progression data yet."
          description="Seed the formation path or complete the first daily task to establish the 12-month map."
        />
      ) : (
        <>
          <Card elevated className="grid grid-cols-3 gap-3 p-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Total XP</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-text">{data.totalXp}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Level</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-text">{data.currentLevel}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Streak</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-text">{data.streakDays}</p>
            </div>
          </Card>

          <div className="space-y-4">
            {data.months.map((month, index) => (
              <div key={month.monthIndex} className="space-y-3">
                <Card
                  elevated={month.status === 'active'}
                  className={`space-y-4 ${month.status === 'locked' ? 'opacity-80' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                        {month.quarterLabel} · Month {month.monthIndex}
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-text">
                        {month.title}
                      </h2>
                    </div>
                    <div
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${statusStyles(
                        month.status,
                      )}`}
                    >
                      {month.status}
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-textMuted">{month.coreQuestion}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-textMuted">
                      <span>Progress</span>
                      <span>{month.progressPercentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06]">
                      <div
                        className={`h-2 rounded-full ${
                          month.status === 'completed'
                            ? 'bg-emerald-300'
                            : month.status === 'active'
                              ? 'bg-white'
                              : 'bg-white/20'
                        }`}
                        style={{ width: `${month.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Authors</p>
                      <p className="mt-2 text-lg font-semibold tracking-tight text-text">
                        {month.authorsCovered.length}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Concepts</p>
                      <p className="mt-2 text-lg font-semibold tracking-tight text-text">
                        {month.conceptsMastered.length}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Exercises</p>
                      <p className="mt-2 text-lg font-semibold tracking-tight text-text">
                        {month.exercisesCompleted}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Artifact</p>
                      <p className="mt-2 text-sm font-medium text-text">
                        {artifactLabel(month.portfolioArtifactStatus)}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-textMuted">XP</p>
                      <p className="mt-2 text-lg font-semibold tracking-tight text-text">
                        {month.xpEarned}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Badges</p>
                      <p className="mt-2 text-lg font-semibold tracking-tight text-text">
                        {month.badgesUnlocked.length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Authors covered</p>
                      <p className="mt-2 text-sm leading-6 text-text">
                        {month.authorsCovered.length > 0
                          ? month.authorsCovered.join(', ')
                          : 'No authors covered yet.'}
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Target artifact</p>
                      <p className="mt-2 text-sm leading-6 text-text">{month.targetArtifact}</p>
                    </div>
                  </div>
                </Card>

                {index < data.months.length - 1 ? (
                  <div className="mx-auto h-6 w-px bg-white/10" />
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
