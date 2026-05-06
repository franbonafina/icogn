import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import { loadFormationAuthorBySlug } from '@/features/formation/formationService';
import type { Author } from '@/types/firestore';

export function FormationAuthorDetailPage() {
  const { authorSlug = '' } = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadAuthor() {
      try {
        setErrorMessage('');
        const nextAuthor = await loadFormationAuthorBySlug(authorSlug);
        setAuthor(nextAuthor);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'The author profile could not be loaded.');
      }
    }

    void loadAuthor();
  }, [authorSlug]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={author?.name ?? 'Author profile'}
        description={author?.practicalRelevance ?? 'Practical study notes for executive formation.'}
        action={
          <Link to="/app/formation/library">
            <Button variant="secondary">Back to library</Button>
          </Link>
        }
      />

      {errorMessage ? (
        <ScreenState
          eyebrow="Author error"
          title="This author profile could not be loaded."
          description={errorMessage}
          tone="error"
        />
      ) : !author ? (
        <div className="space-y-4">
          <Card elevated className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-20 rounded-3xl" />
          </Card>
        </div>
      ) : (
        <>
          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">{author.schoolOrTradition}</p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">Historical context</h2>
            </div>
            <p className="text-sm leading-6 text-textMuted">{author.historicalContext}</p>
          </Card>

          <Card elevated className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-text">Core concepts</h2>
            <div className="flex flex-wrap gap-2">
              {author.coreConcepts.map((concept) => (
                <span key={concept} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-textMuted">
                  {concept}
                </span>
              ))}
            </div>
          </Card>

          <Card elevated className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-text">Main works</h2>
            <div className="grid gap-3">
              {author.mainWorks.map((work) => (
                <div key={work.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-text">
                    {work.title}
                    {work.year ? ` · ${work.year}` : ''}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-textMuted">{work.note}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card elevated className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-text">Practical relevance</h2>
            <p className="text-sm leading-6 text-textMuted">{author.practicalRelevance}</p>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Warnings</p>
              <ul className="mt-2 space-y-2 text-sm text-text">
                {author.keyWarningsOrLimitations.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
