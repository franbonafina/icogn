import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { getLearningItemDetail } from '@/features/learning/learningItemsService';
import type { LearningItem } from '@/types/firestore';

export function LearningItemDetailPage() {
  const { itemId = '' } = useParams();
  const [item, setItem] = useState<LearningItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadItem() {
      if (!itemId) {
        setError('Missing learning item id.');
        setLoading(false);
        return;
      }

      try {
        const nextItem = await getLearningItemDetail(itemId);

        if (!cancelled) {
          if (!nextItem) {
            setError('Learning item not found.');
          } else {
            setItem(nextItem);
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load the learning item.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadItem();

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={item?.title ?? 'Learning item'}
        description="Structured source material saved into the learning system."
      />

      {loading ? (
        <Card>
          <p className="text-sm text-textMuted">Loading learning item...</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-textMuted">{error}</p>
        </Card>
      ) : item ? (
        <>
          <Card elevated className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
              {item.type} · {item.learningMode.replace(/_/g, ' ')}
            </p>
            <p className="text-base leading-7 text-text">{item.content}</p>
          </Card>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
              Explanation
            </p>
            <p className="text-sm leading-6 text-textMuted">{item.explanation}</p>
          </Card>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
              Source text
            </p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-textMuted">
              {item.sourceText}
            </p>
          </Card>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Metadata</p>
            <p className="text-sm leading-6 text-textMuted">
              Tags: {item.tags.length > 0 ? item.tags.join(', ') : 'none'}
            </p>
            <p className="text-sm leading-6 text-textMuted">
              Difficulty: {item.difficulty} / 5
            </p>
          </Card>
        </>
      ) : null}

      <Link to="/app/learn/new">
        <Button fullWidth variant="secondary">
          Add another item
        </Button>
      </Link>
    </div>
  );
}
