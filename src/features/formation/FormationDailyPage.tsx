import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import {
  completeFormationDailyTask,
  getFormationLessonById,
  loadFormationDailyTask,
} from '@/features/formation/formationService';
import {
  evaluateFormationReflectionWithFunction,
  type FormationReflectionEvaluation,
} from '@/features/formation/formationAiService';
import type { DailyTask } from '@/types/firestore';

export function FormationDailyPage() {
  const [task, setTask] = useState<DailyTask | null>(null);
  const [response, setResponse] = useState('');
  const [reflection, setReflection] = useState('');
  const [evaluation, setEvaluation] = useState<FormationReflectionEvaluation | null>(null);
  const [feedbackSummary, setFeedbackSummary] = useState<DailyTask['aiFeedback'] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function loadTask() {
    try {
      setErrorMessage('');
      const nextTask = await loadFormationDailyTask();
      setTask(nextTask);
      setResponse(nextTask?.userResponse ?? '');
      setReflection(nextTask?.userReflection ?? '');
      setFeedbackSummary(nextTask?.aiFeedback ?? null);
      setCompleted(nextTask?.status === 'completed');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Daily formation could not load.');
    }
  }

  useEffect(() => {
    void loadTask();
  }, []);

  const lesson = useMemo(() => {
    if (!task) {
      return null;
    }

    return getFormationLessonById(task.lessonId);
  }, [task]);

  async function handleEvaluate() {
    if (!lesson || !response.trim()) {
      return;
    }

    try {
      setEvaluating(true);
      setErrorMessage('');
      const result = await evaluateFormationReflectionWithFunction(lesson, response, reflection);
      setEvaluation(result.evaluation);
      setFeedbackSummary(result.aiFeedback);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The formation response could not be evaluated.');
    } finally {
      setEvaluating(false);
    }
  }

  async function handleComplete() {
    if (!task || !evaluation || !feedbackSummary) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      await completeFormationDailyTask({
        taskId: task.id,
        userResponse: response,
        userReflection: reflection,
        score: evaluation.score,
        aiFeedback: feedbackSummary,
      });
      setCompleted(true);
      await loadTask();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The daily formation task could not be completed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Formation"
        description="One serious lesson at a time: concept, reading, translation, and output."
        action={
          <Link to="/app/formation">
            <Button variant="secondary">Formation hub</Button>
          </Link>
        }
      />

      {errorMessage ? (
        <ScreenState
          eyebrow="Daily formation error"
          title="This task could not be loaded."
          description={errorMessage}
          actionLabel="Try again"
          onAction={() => void loadTask()}
          tone="error"
        />
      ) : !task || !lesson ? (
        <Card elevated className="space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-32 rounded-[1.5rem]" />
        </Card>
      ) : (
        <>
          <Card elevated className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Opening frame</p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">{lesson.title}</h2>
              <p className="text-sm leading-6 text-textMuted">{lesson.openingFrame}</p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Author reference</p>
              <p className="mt-2 text-sm font-medium text-text">
                {lesson.authorReference.name}
                {lesson.authorReference.workTitle ? ` · ${lesson.authorReference.workTitle}` : ''}
              </p>
              <p className="mt-2 text-sm leading-6 text-textMuted">{lesson.authorReference.summary}</p>
            </div>

            <div className="space-y-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Core idea</p>
                <p className="mt-2 text-sm leading-6 text-text">{lesson.coreIdea}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Practical translation</p>
                <p className="mt-2 text-sm leading-6 text-text">{lesson.practicalTranslation}</p>
              </div>
            </div>
          </Card>

          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Reading</p>
              <h2 className="text-xl font-semibold tracking-tight text-text">{lesson.reading.title}</h2>
            </div>
            <p className="text-sm leading-6 text-textMuted">{lesson.reading.excerpt}</p>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Guiding question</p>
              <p className="mt-2 text-sm leading-6 text-text">{lesson.reading.guidingQuestion}</p>
            </div>
          </Card>

          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Practice</p>
              <h2 className="text-xl font-semibold tracking-tight text-text">{lesson.practice.title}</h2>
              <p className="text-sm leading-6 text-textMuted">{lesson.practice.prompt}</p>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Your answer</span>
              <textarea
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                rows={8}
                className="w-full rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
                placeholder="Write the practical response here."
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Reflection</span>
              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                rows={4}
                className="w-full rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
                placeholder={lesson.reflectionPrompt}
              />
            </label>

            <div className="grid gap-3">
              <Button fullWidth onClick={() => void handleEvaluate()} disabled={evaluating || !response.trim()}>
                {evaluating ? 'Reviewing...' : 'Request AI feedback'}
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => void handleComplete()}
                disabled={saving || !evaluation || completed}
              >
                {completed ? 'Task completed' : saving ? 'Saving...' : 'Complete daily task'}
              </Button>
            </div>
          </Card>

          {evaluation ? (
            <Card elevated className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">AI review</p>
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  Score {evaluation.score}/5
                </h2>
              </div>
              <p className="text-sm leading-6 text-textMuted">{evaluation.summary}</p>

              <div className="grid gap-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Strengths</p>
                  <ul className="mt-2 space-y-2 text-sm text-text">
                    {evaluation.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Revision</p>
                  <ul className="mt-2 space-y-2 text-sm text-text">
                    {[...evaluation.weaknesses, ...evaluation.revisionAdvice].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
