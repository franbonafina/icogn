import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import { SelectField } from '@/components/SelectField';
import { aiModelCatalog, getDefaultModelForProvider } from '@/lib/ai/catalog';
import { getOrCreateAiSettings, saveAiSettingsConfig, type AiSettingsForm } from '@/features/settings/aiSettingsService';
import type { AIProviderName } from '@/lib/ai/types';
import type { AiEvaluationStyle } from '@/types/firestore';

const evaluationStyles: AiEvaluationStyle[] = ['strict', 'balanced', 'encouraging'];

export function AISettingsPage() {
  const [settings, setSettings] = useState<AiSettingsForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoadError('');
        const current = await getOrCreateAiSettings();
        setSettings({
          provider: current.provider,
          modelName: current.modelName,
          temperature: current.temperature,
          maxTokens: current.maxTokens,
          strictJsonMode: current.strictJsonMode,
          evaluationStyle: current.evaluationStyle,
        });
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : 'Could not load AI settings.',
        );
      }
    }

    void loadSettings();
  }, []);

  function updateSettings(next: Partial<AiSettingsForm>) {
    setSettings((current) => (current ? { ...current, ...next } : current));
  }

  async function handleSave() {
    if (!settings) {
      return;
    }

    setIsSaving(true);
    setStatusMessage('');

    try {
      await saveAiSettingsConfig(settings);
      setStatusMessage('AI settings saved to Firestore for this user.');
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Could not save AI settings.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI model configuration"
        description="Configure provider behavior per user for the current prototype runtime."
      />

      {loadError ? (
        <ScreenState
          eyebrow="Settings error"
          title="AI settings could not load."
          description={loadError}
          tone="error"
        />
      ) : !settings ? (
        <Card className="space-y-4 p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </Card>
      ) : (
        <>
          <Card elevated className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Runtime config
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                Provider and model behavior
              </h2>
            </div>

            <label className="space-y-2">
              <span className="block text-sm text-textMuted">Provider</span>
              <SelectField
                value={settings.provider}
                onChange={(event) => {
                  const provider = event.target.value as AIProviderName;
                  updateSettings({
                    provider,
                    modelName: getDefaultModelForProvider(provider),
                  });
                }}
              >
                <option value="groq">groq</option>
                <option value="openai">openai</option>
                <option value="anthropic">anthropic</option>
              </SelectField>
            </label>

            <label className="space-y-2">
              <span className="block text-sm text-textMuted">Model name</span>
              <SelectField
                value={settings.modelName}
                onChange={(event) => updateSettings({ modelName: event.target.value })}
              >
                {aiModelCatalog[settings.provider].map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label}
                    {model.status === 'planned' ? ' (planned)' : ''}
                  </option>
                ))}
              </SelectField>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="block text-sm text-textMuted">Temperature</span>
                <input
                  className="h-11 w-full rounded-2xl border border-white/10 bg-surfaceMuted px-4 text-sm text-text outline-none transition focus:border-white/20"
                  max="1"
                  min="0"
                  onChange={(event) =>
                    updateSettings({ temperature: Number(event.target.value) })
                  }
                  step="0.1"
                  type="number"
                  value={settings.temperature}
                />
              </label>

              <label className="space-y-2">
                <span className="block text-sm text-textMuted">Max tokens</span>
                <input
                  className="h-11 w-full rounded-2xl border border-white/10 bg-surfaceMuted px-4 text-sm text-text outline-none transition focus:border-white/20"
                  min="128"
                  onChange={(event) =>
                    updateSettings({ maxTokens: Number(event.target.value) })
                  }
                  step="64"
                  type="number"
                  value={settings.maxTokens}
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="block text-sm text-textMuted">Evaluation style</span>
              <SelectField
                value={settings.evaluationStyle}
                onChange={(event) =>
                  updateSettings({
                    evaluationStyle: event.target.value as AiEvaluationStyle,
                  })
                }
              >
                {evaluationStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </SelectField>
            </label>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-text">Enable strict JSON mode</p>
                <p className="text-sm text-textMuted">
                  Keeps evaluators and extractors constrained to structured outputs.
                </p>
              </div>
              <input
                checked={settings.strictJsonMode}
                className="h-5 w-5 accent-white"
                onChange={(event) =>
                  updateSettings({ strictJsonMode: event.target.checked })
                }
                type="checkbox"
              />
            </label>

            {statusMessage ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-textMuted">
                {statusMessage}
              </div>
            ) : null}

            <Button fullWidth className="h-14 text-base" disabled={isSaving} onClick={handleSave}>
              {isSaving ? 'Saving...' : 'Save AI configuration'}
            </Button>
          </Card>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
              Security note
            </p>
            <p className="text-sm leading-6 text-textMuted">
              This prototype can call Groq directly from the browser to remain on Firebase Spark.
              Do not treat the frontend key as secret. This screen stores provider behavior and
              runtime preferences only.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
