import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { cn } from '@/components/utils';
import { saveLearningSession } from '@/features/learning/learningSessionService';
import {
  calculateNextReview,
  createLearningSession,
  mockLearningItems,
} from '@/lib/learning';
import type { GeneratedLearningSession, ReviewableLearningItem } from '@/lib/learning/scheduler';
import type { LearningMode } from '@/types/firestore';

const learningModes: Array<{ id: LearningMode; label: string }> = [
  { id: 'spaced_repetition', label: 'Spaced' },
  { id: 'active_recall', label: 'Recall' },
  { id: 'interleaving', label: 'Interleave' },
  { id: 'deliberate_practice', label: 'Practice' },
];

function buildSession(mode: LearningMode) {
  return createLearningSession(mockLearningItems, mode);
}

export function LearnPage() {
  const [mode, setMode] = useState<LearningMode>('spaced_repetition');
  const [session, setSession] = useState<GeneratedLearningSession>(() =>
    buildSession('spaced_repetition'),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [draftResponse, setDraftResponse] = useState('');
  const [scoredItems, setScoredItems] = useState<Record<string, number>>({});
  const [reviewState, setReviewState] = useState<Record<string, ReturnType<typeof calculateNextReview>>>({});

  useEffect(() => {
    setSession(buildSession(mode));
    setCurrentIndex(0);
    setAnswerRevealed(false);
    setDraftResponse('');
  }, [mode]);

  const currentCard = session.cards[currentIndex];
  const isLastCard = currentIndex === session.cards.length - 1;

  function findItem(itemId: string) {
    return mockLearningItems.find((item) => item.id === itemId) as ReviewableLearningItem | undefined;
  }

  function advanceCard() {
    if (isLastCard) {
      setCurrentIndex(0);
      setSession(buildSession(mode));
    } else {
      setCurrentIndex((value) => value + 1);
    }

    setAnswerRevealed(false);
    setDraftResponse('');
  }

  async function handleScore(score: number) {
    if (!currentCard) {
      return;
    }

    const item = findItem(currentCard.itemId);

    if (!item) {
      advanceCard();
      return;
    }

    const nextReview = calculateNextReview(item, score);

    setScoredItems((value) => ({ ...value, [currentCard.itemId]: score }));
    setReviewState((value) => ({ ...value, [currentCard.itemId]: nextReview }));
    void saveLearningSession({
      learningItemId: item.id,
      learningMode: item.learningMode,
      prompt: currentCard.prompt,
      response: draftResponse || currentCard.answer,
      score,
      title: item.title,
      tags: item.tags,
    });
    advanceCard();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning engine"
        description="One clear rep at a time across recall, repetition, interleaving, and deliberate practice."
        action={
          <Link to="/app/learn/new">
            <Button variant="secondary">New item</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {learningModes.map((entry) => (
          <button
            key={entry.id}
            className={cn(
              'rounded-2xl border px-3 py-3 text-sm font-medium transition',
              mode === entry.id
                ? 'border-white/20 bg-surface text-text'
                : 'border-white/10 bg-surface/30 text-textMuted',
            )}
            onClick={() => setMode(entry.id)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </div>

      <Card elevated className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
              {mode.split('_').join(' ')}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-text">
              {currentCard?.title ?? 'No items queued'}
            </h2>
          </div>
          <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-textMuted">
            {session.cards.length === 0 ? '0 / 0' : `${currentIndex + 1} / ${session.cards.length}`}
          </div>
        </div>

        {currentCard ? (
          <>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-medium text-text">{currentCard.prompt}</p>
              <p className="mt-3 text-sm leading-6 text-textMuted">
                {currentCard.exercise}
              </p>
            </div>

            {mode === 'deliberate_practice' ? (
              <div className="space-y-4">
                <textarea
                  className="min-h-36 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 py-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
                  onChange={(event) => setDraftResponse(event.target.value)}
                  placeholder="Write your answer here."
                  value={draftResponse}
                />

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                    Targeted improvement
                  </p>
                  <div className="mt-3 space-y-2">
                    {currentCard.improvementFocus.map((focus) => (
                      <p key={focus} className="text-sm leading-6 text-textMuted">
                        {focus}
                      </p>
                    ))}
                  </div>
                </div>

                <Button
                  fullWidth
                  onClick={() => setAnswerRevealed(true)}
                  variant={answerRevealed ? 'secondary' : 'primary'}
                >
                  {answerRevealed ? 'Reference answer visible' : 'Show reference answer'}
                </Button>
              </div>
            ) : (
              <Button
                fullWidth
                onClick={() => setAnswerRevealed((value) => !value)}
                variant={answerRevealed ? 'secondary' : 'primary'}
              >
                {answerRevealed ? 'Hide answer' : 'Reveal answer'}
              </Button>
            )}

            {answerRevealed ? (
              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                    Reference answer
                  </p>
                  <p className="text-sm leading-6 text-text">{currentCard.answer}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                    Context
                  </p>
                  <p className="text-sm leading-6 text-textMuted">
                    {currentCard.sourceText}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <p className="text-sm leading-6 text-textMuted">
                Score the quality of your recall from 0 to 5. Lower scores bring the item back sooner. Higher scores extend the interval.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    className="rounded-2xl border border-white/10 bg-surfaceMuted px-3 py-3 text-sm font-medium text-text transition hover:border-white/20"
                    onClick={() => handleScore(score)}
                    type="button"
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <ScreenState
            eyebrow="Queue empty"
            title="No items are ready in this mode."
            description="Add a concept or switch modes to keep the session moving without forcing low-value repetitions."
          />
        )}
      </Card>

      <div className="grid gap-4">
        <Card>
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Session rules</p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-textMuted">
            <p>`Spaced repetition`: simplified SM-2 with ease factor and next review date.</p>
            <p>`Active recall`: prompt first, answer hidden, self-score after reveal.</p>
            <p>`Interleaving`: due items first, mixed by tag to avoid repetitive runs.</p>
            <p>`Deliberate practice`: produce an answer and review targeted suggestions.</p>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Recent scoring</p>
          {Object.keys(reviewState).length > 0 ? (
            <div className="mt-3 space-y-3">
              {Object.entries(reviewState).map(([itemId, result]) => (
                <div key={itemId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-text">{findItem(itemId)?.title ?? itemId}</p>
                  <p className="mt-1 text-sm text-textMuted">
                    Score {scoredItems[itemId]} · next review in {result.intervalDays} days · EF {result.easeFactor.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-textMuted">
              Complete the first item to start building a review trace for this session.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
