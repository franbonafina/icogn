import { getOrCreateAiSettings } from '@/features/settings/aiSettingsService';
import { callGroqJson } from '@/lib/ai/groqBrowser';
import { learningItemsRepository } from '@/lib/firebase/repositories';
import type { LearningItem, LearningItemType, LearningMode } from '@/types/firestore';

export type LearningItemDraft = {
  rawText: string;
  title: string;
  type: LearningItemType;
  content: string;
  explanation: string;
  sourceText: string;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  learningMode: LearningMode;
};

type ExtractLearningItemsResult = {
  items: Array<{
    title: string;
    type: LearningItemType;
    content: string;
    explanation: string;
    tags: string[];
    difficulty: 1 | 2 | 3 | 4 | 5;
    suggestedLearningMode: LearningMode;
  }>;
};

export type CreateLearningItemInput = {
  userId: string;
  rawText: string;
  title?: string;
  type: LearningItemType;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  learningMode: LearningMode;
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildTitle(rawText: string, explicitTitle?: string) {
  const normalizedTitle = normalizeWhitespace(explicitTitle ?? '');

  if (normalizedTitle) {
    return normalizedTitle;
  }

  const firstLine = rawText
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return 'Untitled learning item';
  }

  return firstLine.length > 72 ? `${firstLine.slice(0, 69).trim()}...` : firstLine;
}

function splitRawText(rawText: string) {
  const trimmed = rawText.trim();
  const paragraphs = trimmed.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const content = paragraphs[0] ?? trimmed;
  const explanation = paragraphs.slice(1).join('\n\n');

  return {
    content: normalizeWhitespace(content),
    explanation: normalizeWhitespace(explanation || `Practice recalling and applying: ${content}`),
    sourceText: trimmed,
  };
}

export function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

export function createDraftFromRawText(
  rawText: string,
  overrides: Partial<Omit<LearningItemDraft, 'rawText' | 'sourceText'>> = {},
): LearningItemDraft {
  const cleanedText = rawText.trim();
  const { content, explanation, sourceText } = splitRawText(cleanedText);

  return {
    rawText: cleanedText,
    title: buildTitle(cleanedText, overrides.title),
    type: overrides.type ?? 'concept',
    content,
    explanation: overrides.explanation ?? explanation,
    sourceText,
    tags: overrides.tags ?? [],
    difficulty: overrides.difficulty ?? 3,
    learningMode: overrides.learningMode ?? 'active_recall',
  };
}

export function mockExtractLearningItems(
  rawText: string,
  overrides: Partial<Omit<LearningItemDraft, 'rawText' | 'sourceText'>> = {},
) {
  const baseDraft = createDraftFromRawText(rawText, overrides);
  const fragments = rawText
    .split(/\n\s*\n|[.;]\s+/)
    .map((part) => normalizeWhitespace(part))
    .filter((part) => part.length > 24);

  const uniqueDrafts = new Map<string, LearningItemDraft>();

  uniqueDrafts.set(
    baseDraft.title,
    baseDraft,
  );

  fragments.slice(0, 2).forEach((fragment, index) => {
    const derivedDraft = createDraftFromRawText(fragment, {
      ...overrides,
      title:
        index === 0
          ? baseDraft.title
          : buildTitle(fragment, overrides.title ? `${overrides.title} ${index + 1}` : undefined),
    });

    uniqueDrafts.set(`${derivedDraft.title}-${index}`, derivedDraft);
  });

  return Array.from(uniqueDrafts.values());
}

export async function extractLearningItems(
  rawText: string,
  overrides: Partial<Omit<LearningItemDraft, 'rawText' | 'sourceText'>> = {},
) {
  const settings = await getOrCreateAiSettings();

  if (settings.provider !== 'groq') {
    return mockExtractLearningItems(rawText, overrides);
  }

  try {
    const { parsed: payload } = await callGroqJson<ExtractLearningItemsResult>(
      [
        {
          role: 'system',
          content:
            'You are a curriculum structuring assistant. Return strict JSON only and never include commentary.',
        },
        {
          role: 'user',
          content: [
            'Convert the source text into learning item drafts.',
            'Return strict JSON only.',
            'Top-level schema: {"items":[{"title","type","content","explanation","tags","difficulty","suggestedLearningMode"}]}',
            'Allowed type values: term, concept, quote, principle, framework, case.',
            'Allowed suggestedLearningMode values: spaced_repetition, active_recall, interleaving, deliberate_practice.',
            'Difficulty must be an integer from 1 to 5.',
            overrides.type ? `Preferred type: ${overrides.type}` : '',
            overrides.tags?.length ? `Preferred tags: ${overrides.tags.join(', ')}` : '',
            `Source text:\n${rawText}`,
          ]
            .filter(Boolean)
            .join('\n\n'),
        },
      ],
      settings.modelName,
      settings.temperature,
      settings.maxTokens,
    );

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return mockExtractLearningItems(rawText, overrides);
    }

    return payload.items.map((item) => ({
      rawText,
      sourceText: rawText.trim(),
      title: buildTitle(rawText, item.title || overrides.title),
      type: item.type ?? overrides.type ?? 'concept',
      content: normalizeWhitespace(item.content || rawText),
      explanation: normalizeWhitespace(
        item.explanation || overrides.explanation || `Practice recalling and applying: ${item.content || rawText}`,
      ),
      tags: item.tags?.length ? item.tags : overrides.tags ?? [],
      difficulty: item.difficulty ?? overrides.difficulty ?? 3,
      learningMode:
        item.suggestedLearningMode ?? overrides.learningMode ?? 'active_recall',
    }));
  } catch {
    return mockExtractLearningItems(rawText, overrides);
  }
}

export async function saveLearningItem(input: CreateLearningItemInput) {
  const draft = createDraftFromRawText(input.rawText, {
    title: input.title,
    type: input.type,
    tags: input.tags,
    difficulty: input.difficulty,
    learningMode: input.learningMode,
  });

  const payload: Omit<LearningItem, 'id'> = {
    userId: input.userId,
    title: draft.title,
    type: draft.type,
    content: draft.content,
    explanation: draft.explanation,
    sourceText: draft.sourceText,
    tags: draft.tags,
    difficulty: draft.difficulty,
    learningMode: draft.learningMode,
    nextReviewAt: null,
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lastScore: null,
    createdAt: null as never,
    updatedAt: null as never,
  };

  return learningItemsRepository.create(payload);
}

export async function getLearningItemDetail(itemId: string) {
  return learningItemsRepository.getById(itemId);
}
