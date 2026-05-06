import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import {
  evaluateSpeechTranscriptWithFunction,
  saveSpeechSession,
  speechPrompts,
  type SpeechEvaluationResult,
} from '@/features/speech/speechService';

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function SpeechPage() {
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<number | null>(null);

  const [selectedPrompt, setSelectedPrompt] = useState(speechPrompts[0]);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeechEvaluationResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [savedSessionId, setSavedSessionId] = useState('');
  const supportsSpeechRecognition = useMemo(
    () =>
      typeof window !== 'undefined' &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      speechRecognitionRef.current?.stop();
    };
  }, []);

  function startTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setDurationSeconds((value) => value + 1);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startRecording() {
    setStatusMessage('');
    setEvaluation(null);
    setSavedSessionId('');

    if (!supportsSpeechRecognition) {
      setStatusMessage('Speech recognition is not available. Use manual transcript input below.');
      return;
    }

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setStatusMessage('Speech recognition is not available. Use manual transcript input below.');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let nextFinal = '';
      let nextInterim = '';

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcriptChunk = result[0]?.transcript ?? '';

        if (result.isFinal) {
          nextFinal += `${transcriptChunk} `;
        } else {
          nextInterim += transcriptChunk;
        }
      }

      if (nextFinal) {
        setTranscript((value) => `${value} ${nextFinal}`.trim());
      }

      setInterimTranscript(nextInterim.trim());
    };

    recognition.onerror = (event) => {
      setStatusMessage(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
      stopTimer();
    };

    recognition.onend = () => {
      setIsRecording(false);
      stopTimer();
      setInterimTranscript('');
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setDurationSeconds(0);
    startTimer();
  }

  function stopRecording() {
    speechRecognitionRef.current?.stop();
    setIsRecording(false);
    stopTimer();
  }

  async function handleEvaluation() {
    if (!transcript.trim() && !interimTranscript.trim()) {
      setStatusMessage('Add a spoken or manual transcript before evaluation.');
      return;
    }

    setIsEvaluating(true);
    setStatusMessage('');

    try {
      const finalTranscript = `${transcript} ${interimTranscript}`.trim();
      const result = await evaluateSpeechTranscriptWithFunction(
        selectedPrompt,
        finalTranscript,
      );

      setEvaluation(result);

      const saved = await saveSpeechSession(
        selectedPrompt,
        finalTranscript,
        durationSeconds,
        result,
      );

      setSavedSessionId(saved.id);
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Could not evaluate the speech transcript.',
      );
    } finally {
      setIsEvaluating(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Speech practice"
        description="Respond to one prompt, capture the transcript, and review structured feedback on clarity, argument, persuasion, and delivery."
      />

      <Card elevated className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Prompt</p>
          <p className="text-xl font-medium leading-8 text-text">{selectedPrompt}</p>
        </div>

        <div className="grid gap-2">
          {speechPrompts.map((prompt) => (
            <button
              key={prompt}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                selectedPrompt === prompt
                  ? 'border-white/20 bg-surface text-text'
                  : 'border-white/10 bg-surfaceMuted text-textMuted'
              }`}
              onClick={() => setSelectedPrompt(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
      </Card>

      <Card elevated className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Capture</p>
            <p className="text-sm text-textMuted">
              {supportsSpeechRecognition
                ? 'Live transcription available in this browser.'
                : 'Speech recognition unavailable. Manual transcript mode enabled.'}
            </p>
          </div>
          <div className="rounded-full border border-white/10 px-3 py-1 text-sm text-text">
            {formatDuration(durationSeconds)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            fullWidth
            className="h-14 text-base"
            disabled={isRecording}
            onClick={startRecording}
          >
            Start recording
          </Button>
          <Button
            fullWidth
            className="h-14 text-base"
            disabled={!isRecording}
            onClick={stopRecording}
            variant="secondary"
          >
            Stop
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Live transcript</p>
          <div className="min-h-24 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-text">
            {transcript || interimTranscript ? (
              <>
                <span>{transcript}</span>
                {interimTranscript ? (
                  <span className="text-textMuted"> {interimTranscript}</span>
                ) : null}
              </>
            ) : (
              <span className="text-textMuted">
                Your transcript will appear here while speaking. You can also edit it manually below.
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.24em] text-textMuted" htmlFor="manualTranscript">
            Transcript editor
          </label>
          <textarea
            id="manualTranscript"
            className="min-h-40 w-full rounded-3xl border border-white/10 bg-surfaceMuted px-4 py-4 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-white/20"
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Edit or paste the final transcript here."
            value={transcript}
          />
        </div>

        {statusMessage ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-textMuted">
            {statusMessage}
          </div>
        ) : null}

        <Button
          fullWidth
          className="h-14 text-base"
          disabled={isEvaluating}
          onClick={handleEvaluation}
        >
          {isEvaluating ? 'Evaluating...' : 'Submit for evaluation'}
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
            {savedSessionId ? (
              <p className="text-xs text-textMuted">Saved session: {savedSessionId}</p>
            ) : null}
          </Card>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
              Improvement tasks
            </p>
            <div className="space-y-2">
              {evaluation.improvementTasks.map((task) => (
                <div
                  key={task}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-textMuted"
                >
                  {task}
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <ScreenState
          eyebrow="Ready"
          title="Record one response and evaluate the transcript."
          description="Keep it concise. Aim for one clear position, one supporting structure, and one actionable close."
        />
      )}
    </div>
  );
}
