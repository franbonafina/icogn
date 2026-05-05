import { useState } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { SelectField } from '@/components/SelectField';
import { Toggle } from '@/components/Toggle';
import { aiModelCatalog, getDefaultModelForProvider } from '@/lib/ai/catalog';
import { loadAiSettings, saveAiSettings } from '@/lib/ai/settings';
import type { AiProvider } from '@/lib/ai/types';

const providerLabels: Record<AiProvider, string> = {
  groq: 'Groq',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
};

export function ProfilePage() {
  const initialSettings = loadAiSettings();
  const [provider, setProvider] = useState<AiProvider>(initialSettings.provider);
  const [model, setModel] = useState(initialSettings.model);
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  const providerOptions = aiModelCatalog[provider];

  function handleProviderChange(nextProvider: AiProvider) {
    const nextModel = getDefaultModelForProvider(nextProvider);
    setProvider(nextProvider);
    setModel(nextModel);
    saveAiSettings({ provider: nextProvider, model: nextModel });
  }

  function handleModelChange(nextModel: string) {
    setModel(nextModel);
    saveAiSettings({ provider, model: nextModel });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Provider and model selection live here so the product stays provider-agnostic as Groq, OpenAI, and Anthropic options evolve."
        action={
          <Toggle
            checked={memoryEnabled}
            label="Profile memory enabled"
            onClick={() => setMemoryEnabled((value) => !value)}
          />
        }
      />

      <Card elevated className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
            AI configuration
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            Select the provider and model per user profile.
          </h2>
        </div>

        <div className="grid gap-4">
          <label className="space-y-2">
            <span className="block text-sm text-textMuted">Provider</span>
            <SelectField
              value={provider}
              onChange={(event) =>
                handleProviderChange(event.target.value as AiProvider)
              }
            >
              {Object.entries(providerLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
          </label>

          <label className="space-y-2">
            <span className="block text-sm text-textMuted">Model</span>
            <SelectField
              value={model}
              onChange={(event) => handleModelChange(event.target.value)}
            >
              {providerOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                  {option.status === 'planned' ? ' (planned)' : ''}
                </option>
              ))}
            </SelectField>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-textMuted">
          Current route uses local profile preferences. The repository and data
          model are already structured so this can move into Firestore-backed user
          settings without changing the UI contract.
        </div>

        <Button variant="secondary">Profile settings saved locally</Button>
      </Card>

      <div className="grid gap-4">
        <Card>
          <p className="text-sm leading-6 text-textMuted">
            Profile memory can later summarize recurring strengths, weak spots, and
            learning patterns using the `profileMemory` collection.
          </p>
        </Card>
        <Card>
          <p className="text-sm leading-6 text-textMuted">
            Groq is the first active provider, but the product remains model-agnostic
            by design. OpenAI and Anthropic entries are already represented in the
            catalog and can be enabled without reshaping the page.
          </p>
        </Card>
      </div>
    </div>
  );
}
