import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { SelectField } from '@/components/SelectField';
import { Skeleton } from '@/components/Skeleton';
import { Toggle } from '@/components/Toggle';
import { aiModelCatalog, getDefaultModelForProvider } from '@/lib/ai/catalog';
import { loadAiSettings, saveAiSettings } from '@/lib/ai/settings';
import { getCurrentAppUser } from '@/lib/firebase/currentUser';
import { getOrCreateProfileMemory } from '@/features/profile/profileMemoryService';
import type { AIProviderName } from '@/lib/ai/types';
import type { ProfileMemory } from '@/types/firestore';

const providerLabels: Record<AIProviderName, string> = {
  groq: 'Groq',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
};

export function ProfilePage() {
  const initialSettings = loadAiSettings();
  const [provider, setProvider] = useState<AIProviderName>(initialSettings.provider);
  const [model, setModel] = useState(initialSettings.model);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [profileMemory, setProfileMemory] = useState<ProfileMemory | null>(null);
  const [loadError, setLoadError] = useState('');

  const providerOptions = aiModelCatalog[provider];

  useEffect(() => {
    async function loadMemory() {
      try {
        setLoadError('');
        const { userId } = await getCurrentAppUser();
        const memory = await getOrCreateProfileMemory(userId);
        setProfileMemory(memory);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : 'Could not load profile memory.',
        );
      }
    }

    void loadMemory();
  }, []);

  function handleProviderChange(nextProvider: AIProviderName) {
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
        description="Provider selection, memory preferences, and longitudinal signals that shape what the system suggests next."
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
            Select provider and model per user profile.
          </h2>
        </div>

        <div className="grid gap-4">
          <label className="space-y-2">
            <span className="block text-sm text-textMuted">Provider</span>
            <SelectField
              value={provider}
              onChange={(event) =>
                handleProviderChange(event.target.value as AIProviderName)
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

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4">
          <p className="text-sm leading-6 text-textMuted">
            This private prototype can use a browser-side Groq key. This screen configures provider
            behavior, not credentials.
          </p>
        </div>

        <Button variant="secondary">Profile settings saved locally</Button>
        <Link to="/app/settings/ai">
          <Button fullWidth>Open AI model configuration</Button>
        </Link>
      </Card>

      <Card elevated className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
            Profile memory
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            Training adapts as the system observes your patterns.
          </h2>
        </div>

        {loadError ? (
          <ScreenState
            eyebrow="Profile error"
            title="Profile memory could not load."
            description={loadError}
            tone="error"
          />
        ) : !profileMemory ? (
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-3xl" />
            <Skeleton className="h-24 rounded-3xl" />
            <Skeleton className="h-24 rounded-3xl" />
          </div>
        ) : (
          <div className="grid gap-4">
            <Card className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Strongest topics
              </p>
              <p className="text-sm leading-6 text-textMuted">
                {profileMemory.strengths.length > 0
                  ? profileMemory.strengths.join(', ')
                  : 'Not enough data yet.'}
              </p>
            </Card>

            <Card className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Weakest topics
              </p>
              <p className="text-sm leading-6 text-textMuted">
                {profileMemory.weaknesses.length > 0
                  ? profileMemory.weaknesses.join(', ')
                  : 'Not enough data yet.'}
              </p>
            </Card>

            <Card className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Preferred learning modes
              </p>
              <p className="text-sm leading-6 text-textMuted">
                {profileMemory.preferredModes.length > 0
                  ? profileMemory.preferredModes.map((mode) => mode.replace(/_/g, ' ')).join(', ')
                  : 'No preference detected yet.'}
              </p>
            </Card>

            <Card className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Recurring mistakes
              </p>
              <div className="space-y-2">
                {profileMemory.recurringErrors.length > 0 ? (
                  profileMemory.recurringErrors.map((item) => (
                    <p key={item} className="text-sm leading-6 text-textMuted">
                      {item}
                    </p>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-textMuted">No recurring errors recorded yet.</p>
                )}
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                  Communication weaknesses
                </p>
                <div className="space-y-2">
                  {profileMemory.speechPatterns.length > 0 ? (
                    profileMemory.speechPatterns.map((item) => (
                      <p key={item} className="text-sm leading-6 text-textMuted">
                        {item}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-textMuted">No speech patterns recorded yet.</p>
                  )}
                </div>
              </Card>

              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                  Decision-making patterns
                </p>
                <div className="space-y-2">
                  {profileMemory.decisionPatterns.length > 0 ? (
                    profileMemory.decisionPatterns.map((item) => (
                      <p key={item} className="text-sm leading-6 text-textMuted">
                        {item}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-textMuted">No decision patterns recorded yet.</p>
                  )}
                </div>
              </Card>
            </div>

            <Card className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Recommended next practice
              </p>
              {profileMemory.recommendations.length > 0 ? (
                <div className="space-y-2">
                  {profileMemory.recommendations.map((item) => (
                    <p key={item} className="text-sm leading-6 text-textMuted">
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-textMuted">
                  Complete a few reviews, speech runs, or decision attempts to generate the next recommendation.
                </p>
              )}
            </Card>

            <Card className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                Recent activity
              </p>
              {profileMemory.recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {profileMemory.recentActivity.map((item) => (
                    <p key={item} className="text-sm leading-6 text-textMuted">
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-textMuted">
                  Activity history will appear as the system observes your sessions over time.
                </p>
              )}
            </Card>
          </div>
        )}
      </Card>

      {profileMemory && profileMemory.strengths.length === 0 && profileMemory.weaknesses.length === 0 ? (
        <ScreenState
          eyebrow="Early profile"
          title="The system is still learning your patterns."
          description="A few sessions are enough to start shaping recommendations, preferred modes, and recurring weak spots."
        />
      ) : null}
    </div>
  );
}
