import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import { SelectField } from '@/components/SelectField';
import {
  evaluateDecisionAttemptWithFunction,
  generateScenario,
  saveDecisionAttempt,
  saveScenario,
  type DecisionEvaluationResult,
  type DecisionScenarioDraft,
  type ScenarioType,
} from '@/features/decision/decisionService';

const scenarioTypes: Array<{ id: ScenarioType; label: string }> = [
  { id: 'leadership', label: 'Leadership' },
  { id: 'business', label: 'Business' },
  { id: 'civic', label: 'Civic' },
  { id: 'ethical', label: 'Ethical' },
  { id: 'technical/product', label: 'Technical / product' },
  { id: 'crisis', label: 'Crisis' },
];

export function DecisionPage() {
  const [scenarioType, setScenarioType] = useState<ScenarioType>('leadership');
  const [scenario, setScenario] = useState<DecisionScenarioDraft | null>(null);
  const [scenarioId, setScenarioId] = useState('');
  const [userDecision, setUserDecision] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [risksConsidered, setRisksConsidered] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [evaluation, setEvaluation] = useState<DecisionEvaluationResult | null>(null);
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [savedAttemptId, setSavedAttemptId] = useState('');

  useEffect(() => {
    void loadScenario(scenarioType);
  }, [scenarioType]);

  async function loadScenario(type: ScenarioType) {
    setIsLoadingScenario(true);
    setStatusMessage('');
    setEvaluation(null);
    setSavedAttemptId('');

    try {
      const nextScenario = await generateScenario(type);
      setScenario(nextScenario);
      const savedScenario = await saveScenario(type, nextScenario);
      setScenarioId(savedScenario.id);
      setUserDecision('');
      setReasoning('');
      setRisksConsidered('');
      setExpectedOutcome('');
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Could not generate the scenario.',
      );
    } finally {
      setIsLoadingScenario(false);
    }
  }

  async function handleSubmit() {
    if (!scenario) {
      setStatusMessage('No scenario available.');
      return;
    }

    if (!userDecision.trim() || !reasoning.trim()) {
      setStatusMessage('Decision and reasoning are required.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const nextEvaluation = await evaluateDecisionAttemptWithFunction(
        scenario,
        userDecision,
        reasoning,
        risksConsidered,
        expectedOutcome,
      );

      setEvaluation(nextEvaluation);

      const savedAttempt = await saveDecisionAttempt(
        scenarioId || `local-${Date.now()}`,
        scenario.title,
        scenario.tags,
        userDecision,
        reasoning,
        risksConsidered,
        expectedOutcome,
        nextEvaluation,
      );

      setSavedAttemptId(savedAttempt.id);
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Could not evaluate the decision attempt.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Decision simulator"
        description="Serious scenario practice for leadership, civic, ethical, business, technical, and crisis judgment."
        action={
          <Button
            onClick={() => void loadScenario(scenarioType)}
            variant="secondary"
          >
            New scenario
          </Button>
        }
      />

      <Card elevated className="space-y-5">
        <label className="space-y-2">
          <span className="block text-sm text-textMuted">Scenario type</span>
          <SelectField
            value={scenarioType}
            onChange={(event) => setScenarioType(event.target.value as ScenarioType)}
          >
            {scenarioTypes.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </label>
      </Card>

      <Card elevated className="space-y-5">
        {isLoadingScenario ? (
          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-24 rounded-3xl" />
          </div>
        ) : scenario ? (
          <>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Scenario
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                {scenario.title}
              </h2>
              <p className="text-sm leading-7 text-textMuted">{scenario.summary}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm leading-7 text-text">{scenario.context}</p>
              <p className="mt-4 text-sm font-medium leading-7 text-text">
                {scenario.prompt}
              </p>
            </div>

            <div className="grid gap-4">
              <Card className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                  Constraints
                </p>
                {scenario.constraints.map((item) => (
                  <p key={item} className="text-sm leading-6 text-textMuted">
                    {item}
                  </p>
                ))}
              </Card>

              <Card className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                  Stakeholders
                </p>
                {scenario.stakeholders.map((item) => (
                  <p key={item} className="text-sm leading-6 text-textMuted">
                    {item}
                  </p>
                ))}
              </Card>

              <Card className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                  Available options
                </p>
                {scenario.availableOptions.map((item) => (
                  <p key={item} className="text-sm leading-6 text-textMuted">
                    {item}
                  </p>
                ))}
              </Card>
            </div>
          </>
        ) : (
          <ScreenState
            eyebrow="Scenario unavailable"
            title="No scenario is loaded."
            description="Generate a fresh case to begin a decision run."
            actionLabel="Generate scenario"
            onAction={() => void loadScenario(scenarioType)}
          />
        )}
      </Card>

      <Card elevated className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="decision">
            Decision
          </label>
          <textarea
            id="decision"
            className="min-h-28 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 py-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            onChange={(event) => setUserDecision(event.target.value)}
            placeholder="State the decision clearly."
            value={userDecision}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="reasoning">
            Reasoning
          </label>
          <textarea
            id="reasoning"
            className="min-h-36 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 py-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            onChange={(event) => setReasoning(event.target.value)}
            placeholder="Explain the tradeoffs, sequence, and why this is the best move."
            value={reasoning}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="risks">
            Risks considered
          </label>
          <textarea
            id="risks"
            className="min-h-28 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 py-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            onChange={(event) => setRisksConsidered(event.target.value)}
            placeholder="State the risks, failure modes, and what could go wrong."
            value={risksConsidered}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-textMuted" htmlFor="outcome">
            Expected outcome
          </label>
          <textarea
            id="outcome"
            className="min-h-28 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 py-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            onChange={(event) => setExpectedOutcome(event.target.value)}
            placeholder="Describe what happens next if your decision is executed well."
            value={expectedOutcome}
          />
        </div>

        {statusMessage ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-textMuted">
            {statusMessage}
          </div>
        ) : null}

        <Button fullWidth className="h-14 text-base" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? 'Evaluating...' : 'Submit decision'}
        </Button>
      </Card>

      {evaluation ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(evaluation.scores).map(([label, value]) => (
              <Card key={label} className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
                  {label}
                </p>
                <p className="text-3xl font-semibold tracking-tight text-text">
                  {value}
                </p>
              </Card>
            ))}
          </div>

          <Card elevated className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Feedback</p>
            <p className="text-sm leading-7 text-text">{evaluation.feedback}</p>
            {savedAttemptId ? (
              <p className="text-xs text-textMuted">Saved attempt: {savedAttemptId}</p>
            ) : null}
          </Card>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
              Alternative decision
            </p>
            <p className="text-sm leading-7 text-textMuted">
              {evaluation.alternativeDecision}
            </p>
          </Card>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
              Risks missed
            </p>
            <div className="space-y-2">
              {evaluation.risksMissed.map((risk) => (
                <div
                  key={risk}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-textMuted"
                >
                  {risk}
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <ScreenState
          eyebrow="Evaluation"
          title="Write the decision before you optimize it."
          description="State the call clearly, explain the tradeoffs, note the risks, and then submit one coherent judgment."
        />
      )}
    </div>
  );
}
