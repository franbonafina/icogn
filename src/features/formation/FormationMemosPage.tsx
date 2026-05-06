import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import {
  finalizeDecisionMemo,
  publishDecisionMemoToPortfolio,
  saveDecisionMemoDraft,
  type DecisionMemoLabFormData,
  type DecisionMemoScoreSet,
} from '@/features/formation/decisionMemoLab';
import {
  evaluateDecisionMemoWithFunction,
  type FormationDecisionMemoEvaluation,
} from '@/features/formation/formationAiService';
import {
  loadFormationDecisionMemos,
  loadFormationMemoList,
} from '@/features/formation/formationService';
import type { DecisionMemo, PortfolioArtifact } from '@/types/firestore';

const defaultMemoForm: DecisionMemoLabFormData = {
  moduleId: 'formation-module-month-1',
  taskId: null,
  title: 'Executive decision memo',
  decisionTitle: '',
  context: '',
  actorsInvolved: [],
  interests: [],
  dignityRecognitionAtStake: '',
  legalInstitutionalFrame: '',
  economicFrame: '',
  politicalFrame: '',
  operationalFrame: '',
  technologicalFrame: '',
  options: [],
  decisionCriteria: [],
  recommendedDecision: '',
  rejectedAlternatives: [],
  risks: [],
  evidenceThatCouldChangeDecision: [],
  reviewMetrics30_60_90: {
    day30: [],
    day60: [],
    day90: [],
  },
  userReflection: '',
  relatedAuthors: ['Peter Drucker', 'Clausewitz', 'Barbara Minto'],
  relatedConcepts: ['judgment', 'structure', 'risk'],
  primaryStructures: ['economic_structure', 'political_structure', 'operational_structure'],
  secondaryStructures: ['legal_structure', 'technological_structure', 'symbolic_structure'],
  difficulty: 4,
};

function listToText(values: string[]) {
  return values.join(', ');
}

function textToList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function scoreSetToRecord(scores: DecisionMemoScoreSet) {
  return {
    clarity: scores.clarity,
    judgment: scores.judgment,
    structure: scores.structure,
    riskAwareness: scores.riskAwareness,
    executiveLanguage: scores.executiveLanguage,
  };
}

function toFormData(memo: DecisionMemo): DecisionMemoLabFormData {
  return {
    moduleId: memo.moduleId,
    taskId: memo.taskId,
    title: memo.title,
    decisionTitle: memo.decisionTitle,
    context: memo.context,
    actorsInvolved: memo.actorsInvolved,
    interests: memo.interests,
    dignityRecognitionAtStake: memo.dignityRecognitionAtStake,
    legalInstitutionalFrame: memo.legalInstitutionalFrame,
    economicFrame: memo.economicFrame,
    politicalFrame: memo.politicalFrame,
    operationalFrame: memo.operationalFrame,
    technologicalFrame: memo.technologicalFrame,
    options: memo.options,
    decisionCriteria: memo.decisionCriteria,
    recommendedDecision: memo.recommendedDecision,
    rejectedAlternatives: memo.rejectedAlternatives,
    risks: memo.risks,
    evidenceThatCouldChangeDecision: memo.evidenceThatCouldChangeDecision,
    reviewMetrics30_60_90: memo.reviewMetrics30_60_90,
    userReflection: memo.userReflection,
    relatedAuthors: memo.relatedAuthors,
    relatedConcepts: memo.relatedConcepts,
    primaryStructures: memo.primaryStructures,
    secondaryStructures: memo.secondaryStructures,
    difficulty: memo.difficulty,
  };
}

function InputBlock({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-text">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
      />
    </label>
  );
}

export function FormationMemosPage() {
  const [formData, setFormData] = useState<DecisionMemoLabFormData>(defaultMemoForm);
  const [memoId, setMemoId] = useState<string>();
  const [memos, setMemos] = useState<DecisionMemo[]>([]);
  const [artifacts, setArtifacts] = useState<PortfolioArtifact[]>([]);
  const [evaluation, setEvaluation] = useState<FormationDecisionMemoEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  async function loadWorkspace() {
    try {
      setLoading(true);
      setErrorMessage('');
      const [nextMemos, nextArtifacts] = await Promise.all([
        loadFormationDecisionMemos(),
        loadFormationMemoList(),
      ]);
      setMemos(nextMemos);
      setArtifacts(nextArtifacts);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The memo workspace could not load.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkspace();
  }, []);

  const averageMemoScore = useMemo(() => {
    if (!evaluation) {
      return null;
    }

    const values = Object.values(evaluation.rubricScores);
    return (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1);
  }, [evaluation]);

  async function handleSaveDraft() {
    try {
      setSaving(true);
      setErrorMessage('');
      const saved = await saveDecisionMemoDraft(formData, memoId);
      if (saved) {
        setMemoId(saved.id);
      }
      await loadWorkspace();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The draft could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAiReview() {
    try {
      setSaving(true);
      setErrorMessage('');
      const result = await evaluateDecisionMemoWithFunction(formData);
      setEvaluation(result.evaluation);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The memo could not be reviewed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleFinalizeAndPublish() {
    if (!memoId || !evaluation) {
      return;
    }

    try {
      setPublishing(true);
      setErrorMessage('');
      await finalizeDecisionMemo(memoId, evaluation.rubricScores as DecisionMemoScoreSet, {
        provider: 'groq',
        model: 'configured',
        summary: evaluation.summary,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestedNextSteps: evaluation.suggestedNextSteps,
        rubricScores: scoreSetToRecord(evaluation.rubricScores),
        generatedAt: null,
      });
      await publishDecisionMemoToPortfolio(memoId);
      await loadWorkspace();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The memo could not be published.');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Decision Memo Lab"
        description="Write executive decision memos with structural framing, deliberate review, and portfolio-grade output."
        action={
          <Button
            variant="secondary"
            onClick={() => {
              setMemoId(undefined);
              setEvaluation(null);
              setFormData(defaultMemoForm);
            }}
          >
            New memo
          </Button>
        }
      />

      {errorMessage ? (
        <ScreenState
          eyebrow="Memo error"
          title="The memo workspace hit a problem."
          description={errorMessage}
          tone="error"
          actionLabel="Reload"
          onAction={() => void loadWorkspace()}
        />
      ) : null}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-[1.75rem]" />
          <Skeleton className="h-72 rounded-[1.75rem]" />
        </div>
      ) : (
        <>
          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Guided form</p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                Build one executive call with visible structure.
              </h2>
            </div>

            <InputBlock
              label="Decision title"
              value={formData.decisionTitle}
              onChange={(decisionTitle) => setFormData((current) => ({ ...current, decisionTitle, title: decisionTitle || current.title }))}
              rows={2}
              placeholder="Short, serious title for the executive call"
            />
            <InputBlock label="Context" value={formData.context} onChange={(context) => setFormData((current) => ({ ...current, context }))} rows={5} />
            <InputBlock label="Actors involved" value={listToText(formData.actorsInvolved)} onChange={(value) => setFormData((current) => ({ ...current, actorsInvolved: textToList(value) }))} rows={2} />
            <InputBlock label="Interests" value={listToText(formData.interests)} onChange={(value) => setFormData((current) => ({ ...current, interests: textToList(value) }))} rows={2} />
            <InputBlock label="Dignity / recognition at stake" value={formData.dignityRecognitionAtStake} onChange={(dignityRecognitionAtStake) => setFormData((current) => ({ ...current, dignityRecognitionAtStake }))} rows={3} />
            <InputBlock label="Legal or institutional frame" value={formData.legalInstitutionalFrame} onChange={(legalInstitutionalFrame) => setFormData((current) => ({ ...current, legalInstitutionalFrame }))} />
            <InputBlock label="Economic frame" value={formData.economicFrame} onChange={(economicFrame) => setFormData((current) => ({ ...current, economicFrame }))} />
            <InputBlock label="Political frame" value={formData.politicalFrame} onChange={(politicalFrame) => setFormData((current) => ({ ...current, politicalFrame }))} />
            <InputBlock label="Operational frame" value={formData.operationalFrame} onChange={(operationalFrame) => setFormData((current) => ({ ...current, operationalFrame }))} />
            <InputBlock label="Technological frame" value={formData.technologicalFrame} onChange={(technologicalFrame) => setFormData((current) => ({ ...current, technologicalFrame }))} />
            <InputBlock label="Options" value={listToText(formData.options)} onChange={(value) => setFormData((current) => ({ ...current, options: textToList(value) }))} rows={3} />
            <InputBlock label="Decision criteria" value={listToText(formData.decisionCriteria)} onChange={(value) => setFormData((current) => ({ ...current, decisionCriteria: textToList(value) }))} rows={3} />
            <InputBlock label="Recommended decision" value={formData.recommendedDecision} onChange={(recommendedDecision) => setFormData((current) => ({ ...current, recommendedDecision }))} rows={4} />
            <InputBlock label="Rejected alternatives" value={listToText(formData.rejectedAlternatives)} onChange={(value) => setFormData((current) => ({ ...current, rejectedAlternatives: textToList(value) }))} rows={3} />
            <InputBlock label="Risks" value={listToText(formData.risks)} onChange={(value) => setFormData((current) => ({ ...current, risks: textToList(value) }))} rows={3} />
            <InputBlock label="Evidence that could change the decision" value={listToText(formData.evidenceThatCouldChangeDecision)} onChange={(value) => setFormData((current) => ({ ...current, evidenceThatCouldChangeDecision: textToList(value) }))} rows={3} />
            <InputBlock label="30-day review metrics" value={listToText(formData.reviewMetrics30_60_90.day30)} onChange={(value) => setFormData((current) => ({ ...current, reviewMetrics30_60_90: { ...current.reviewMetrics30_60_90, day30: textToList(value) } }))} rows={2} />
            <InputBlock label="60-day review metrics" value={listToText(formData.reviewMetrics30_60_90.day60)} onChange={(value) => setFormData((current) => ({ ...current, reviewMetrics30_60_90: { ...current.reviewMetrics30_60_90, day60: textToList(value) } }))} rows={2} />
            <InputBlock label="90-day review metrics" value={listToText(formData.reviewMetrics30_60_90.day90)} onChange={(value) => setFormData((current) => ({ ...current, reviewMetrics30_60_90: { ...current.reviewMetrics30_60_90, day90: textToList(value) } }))} rows={2} />
            <InputBlock label="Reflection" value={formData.userReflection} onChange={(userReflection) => setFormData((current) => ({ ...current, userReflection }))} rows={4} />

            <div className="grid gap-3">
              <Button fullWidth onClick={() => void handleSaveDraft()} disabled={saving}>
                {saving ? 'Saving...' : 'Save draft'}
              </Button>
              <Button fullWidth variant="secondary" onClick={() => void handleAiReview()} disabled={saving}>
                Request AI feedback
              </Button>
              <Button fullWidth variant="secondary" onClick={() => void handleFinalizeAndPublish()} disabled={!memoId || !evaluation || publishing}>
                {publishing ? 'Publishing...' : 'Finalize and add to portfolio'}
              </Button>
            </div>
          </Card>

          {evaluation ? (
            <Card elevated className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">AI review</p>
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  Average score {averageMemoScore ?? 'N/A'}
                </h2>
              </div>
              <p className="text-sm leading-6 text-textMuted">{evaluation.summary}</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(evaluation.rubricScores).map(([key, value]) => (
                  <Card key={key} className="space-y-1 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-textMuted">{key}</p>
                    <p className="text-3xl font-semibold tracking-tight text-text">{value}</p>
                  </Card>
                ))}
              </div>
            </Card>
          ) : null}

          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Saved drafts</p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">Draft inventory</h2>
            </div>
            {memos.length === 0 ? (
              <p className="text-sm leading-6 text-textMuted">No drafts yet. Save the current memo to establish the workspace.</p>
            ) : (
              <div className="grid gap-3">
                {memos.map((memo) => (
                  <button
                    key={memo.id}
                    type="button"
                    onClick={() => {
                      setMemoId(memo.id);
                      setEvaluation(null);
                      setFormData(toFormData(memo));
                    }}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-left"
                  >
                    <p className="text-sm font-medium text-text">{memo.decisionTitle || memo.title}</p>
                    <p className="mt-2 text-sm text-textMuted">Status: {memo.status} · Draft v{memo.draftVersion}</p>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card elevated className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Portfolio outputs</p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">Published artifacts</h2>
            </div>
            {artifacts.length === 0 ? (
              <p className="text-sm leading-6 text-textMuted">No memo artifacts published yet.</p>
            ) : (
              <div className="grid gap-3">
                {artifacts.map((artifact) => (
                  <div key={artifact.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-medium text-text">{artifact.title}</p>
                    <p className="mt-2 text-sm text-textMuted">{artifact.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
