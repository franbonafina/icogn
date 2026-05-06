import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import { toAuthorLibraryCard } from '@/features/formation/authorLibrary';
import {
  loadFormationAuthors,
} from '@/features/formation/formationService';
import type { Author } from '@/types/firestore';

import type { AuthorDiscipline, AuthorLibraryFilterState, AuthorPracticalUse } from '@/features/formation/authorLibrary';

const disciplines: Array<AuthorDiscipline | 'all'> = [
  'all',
  'political_economy',
  'economics',
  'philosophy',
  'sociology',
  'strategy',
  'management',
  'communication',
  'negotiation',
  'military_strategy',
  'political_theory',
];

const practicalUses: Array<AuthorPracticalUse | 'all'> = [
  'all',
  'market_analysis',
  'executive_judgment',
  'organizational_design',
  'founder_strategy',
  'commercial_positioning',
  'risk_management',
  'communication',
  'negotiation',
  'power_mapping',
  'institutional_analysis',
];

const initialFilters: AuthorLibraryFilterState = {
  discipline: 'all',
  practicalUse: 'all',
  search: '',
};

export function FormationLibraryPage() {
  const [filters, setFilters] = useState<AuthorLibraryFilterState>(initialFilters);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadAuthors() {
      try {
        setLoading(true);
        setErrorMessage('');
        const nextAuthors = await loadFormationAuthors(filters);
        setAuthors(nextAuthors);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'The author library could not be loaded.');
      } finally {
        setLoading(false);
      }
    }

    void loadAuthors();
  }, [filters]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Author Library"
        description="Study authors as practical lenses for executive work, not as isolated academic profiles."
      />

      <Card elevated className="space-y-4">
        <input
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              search: event.target.value,
            }))
          }
          placeholder="Search by author, concept, school, or work"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-text outline-none placeholder:text-textMuted focus:border-white/20"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={filters.discipline}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                discipline: event.target.value as AuthorLibraryFilterState['discipline'],
              }))
            }
            className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-text outline-none"
          >
            {disciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <select
            value={filters.practicalUse}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                practicalUse: event.target.value as AuthorLibraryFilterState['practicalUse'],
              }))
            }
            className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-text outline-none"
          >
            {practicalUses.map((practicalUse) => (
              <option key={practicalUse} value={practicalUse}>
                {practicalUse.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {errorMessage ? (
        <ScreenState
          eyebrow="Library error"
          title="The author library could not load."
          description={errorMessage}
          tone="error"
        />
      ) : loading ? (
        <div className="grid gap-3">
          <Skeleton className="h-32 rounded-[1.75rem]" />
          <Skeleton className="h-32 rounded-[1.75rem]" />
          <Skeleton className="h-32 rounded-[1.75rem]" />
        </div>
      ) : authors.length === 0 ? (
        <ScreenState
          eyebrow="No matches"
          title="No authors match the current filter."
          description="Clear one filter or broaden the search term."
        />
      ) : (
        <div className="grid gap-3">
          {authors.map((author) => {
            const card = toAuthorLibraryCard(author);

            return (
              <Link key={author.id} to={`/app/formation/library/${author.slug}`}>
                <Card elevated className="space-y-3 transition hover:border-white/20">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.22em] text-textMuted">{card.subtitle}</p>
                    <h2 className="text-xl font-semibold tracking-tight text-text">{card.title}</h2>
                  </div>
                  <p className="text-sm leading-6 text-textMuted">{card.relevanceSnippet}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-textMuted">
                    {card.coreConceptPreview.map((concept) => (
                      <span key={concept} className="rounded-full border border-white/10 px-3 py-1">
                        {concept}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
