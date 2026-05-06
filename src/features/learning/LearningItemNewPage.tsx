import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { SelectField } from '@/components/SelectField';
import {
  extractLearningItems,
  parseTags,
  saveLearningItem,
  type LearningItemDraft,
} from '@/features/learning/learningItemsService';
import { getCurrentAppUser } from '@/lib/firebase/currentUser';
import type { LearningItemType, LearningMode } from '@/types/firestore';

const typeOptions: LearningItemType[] = [
  'term',
  'concept',
  'quote',
  'principle',
  'framework',
  'case',
];

const modeOptions: LearningMode[] = [
  'spaced_repetition',
  'active_recall',
  'interleaving',
  'deliberate_practice',
];

export function LearningItemNewPage() {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [type, setType] = useState<LearningItemType>('concept');
  const [learningMode, setLearningMode] = useState<LearningMode>('active_recall');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  const [extractedDrafts, setExtractedDrafts] = useState<LearningItemDraft[]>([]);

  const parsedTags = useMemo(() => parseTags(tagsInput), [tagsInput]);

  function applyDraft(draft: LearningItemDraft) {
    setTitle(draft.title);
    setRawText(draft.sourceText);
    setType(draft.type);
    setLearningMode(draft.learningMode);
    setDifficulty(draft.difficulty);
    setTagsInput(draft.tags.join(', '));
  }

  async function handleSave() {
    if (!rawText.trim()) {
      setError('Raw pasted text is required.');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const { userId } = await getCurrentAppUser();
      const item = await saveLearningItem({
        userId,
        rawText,
        title,
        tags: parsedTags,
        type,
        difficulty,
        learningMode,
      });

      navigate(`/app/learn/${item.id}`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Could not save the learning item.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleExtract() {
    if (!rawText.trim()) {
      setError('Paste text before extracting learning items.');
      return;
    }

    setError('');
    setIsExtracting(true);

    try {
      const drafts = await extractLearningItems(rawText, {
        title,
        tags: parsedTags,
        type,
        difficulty,
        learningMode,
      });

      setExtractedDrafts(drafts);

      if (drafts[0]) {
        applyDraft(drafts[0]);
      }
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New learning item"
        description="Paste raw material from notes, books, speeches, articles, or ChatGPT and turn it into a structured learning item."
      />

      <Card elevated className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="rawText">
            Raw pasted text
          </label>
          <textarea
            id="rawText"
            className="min-h-44 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 py-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            onChange={(event) => setRawText(event.target.value)}
            placeholder="Paste source text here."
            value={rawText}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="title">
            Optional title
          </label>
          <input
            id="title"
            className="h-11 w-full rounded-2xl border border-white/10 bg-surfaceMuted px-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Custom title"
            value={title}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            className="h-11 w-full rounded-2xl border border-white/10 bg-surfaceMuted px-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="memory, rhetoric, policy"
            value={tagsInput}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-sm text-textMuted">Type</span>
            <SelectField
              value={type}
              onChange={(event) => setType(event.target.value as LearningItemType)}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>
          </label>

          <label className="space-y-2">
            <span className="block text-sm text-textMuted">Learning mode</span>
            <SelectField
              value={learningMode}
              onChange={(event) =>
                setLearningMode(event.target.value as LearningMode)
              }
            >
              {modeOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace(/_/g, ' ')}
                </option>
              ))}
            </SelectField>
          </label>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-textMuted">Difficulty</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                  difficulty === value
                    ? 'border-white/20 bg-surface text-text'
                    : 'border-white/10 bg-surfaceMuted text-textMuted'
                }`}
                onClick={() => setDifficulty(value as 1 | 2 | 3 | 4 | 5)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <Button fullWidth onClick={handleExtract} variant="secondary" disabled={isExtracting}>
            {isExtracting ? 'Extracting...' : 'Extract learning items'}
          </Button>
          <Button fullWidth onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save learning item'}
          </Button>
        </div>
      </Card>

      {extractedDrafts.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-textMuted">
            Review the extracted drafts and tap one to apply it to the form.
          </p>
          <div className="grid gap-3">
            {extractedDrafts.map((draft, index) => (
              <button
                key={`${draft.title}-${index}`}
                className="text-left"
                onClick={() => applyDraft(draft)}
                type="button"
              >
                <Card className="space-y-2">
                  <p className="text-sm font-medium text-text">{draft.title}</p>
                  <p className="text-sm leading-6 text-textMuted">{draft.content}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
                    {draft.type} · {draft.learningMode.replace(/_/g, ' ')}
                  </p>
                </Card>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ScreenState
          eyebrow="Extraction"
          title="Paste material and extract structured learning items."
          description="When Groq is configured, extraction runs directly from the app. Otherwise the app falls back to a local draft parser."
        />
      )}
    </div>
  );
}
