import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { useLanguage } from '@/lib/useLanguage';
import { signInWithAccessCode, isValidAccessCode } from '@/lib/auth/authService';
import { getErrorType } from '@/lib/auth/errorHandler';

export function LoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isValidAccessCode(accessCode)) {
        setError(language === 'es' 
          ? 'El código debe comenzar con CIVIC- y tener al menos 6 caracteres'
          : 'Code must start with CIVIC- and be at least 6 characters'
        );
        return;
      }

      const user = await signInWithAccessCode(accessCode);
      if (user) {
        navigate('/app');
      } else {
        setError(t.auth.invalidCode);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.auth.invalidCode;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-shell flex-col gap-6 px-4 pb-10 pt-8 sm:px-6">
      <PageHeader
        title={t.auth.privateAccess}
        description={t.auth.accessDescription}
      />

      <Card elevated className="space-y-5 p-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">{t.auth.signIn}</p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {t.auth.continueToLearning}
          </h2>
          <p className="text-sm leading-6 text-textMuted">
            {language === 'es' 
              ? 'Ingresa el código de acceso proporcionado para tu cohorte.'
              : 'Enter the access code provided for your cohort.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-textMuted" htmlFor="accessCode">
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder={language === 'es' ? 'Ej: CIVIC-999' : 'e.g., CIVIC-999'}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-text placeholder-textMuted focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                disabled={isLoading}
                autoFocus
              />
            </label>
          </div>

          {error && (
            <div className={`rounded-2xl border px-4 py-3 ${
              error.includes('conexión') || error.includes('connection') 
                ? 'border-yellow-500/20 bg-yellow-500/10' 
                : 'border-red-500/20 bg-red-500/10'
            }`}>
              <p className={`text-sm ${
                error.includes('conexión') || error.includes('connection') 
                  ? 'text-yellow-400' 
                  : 'text-red-400'
              }`}>
                {error}
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            className="h-14 text-base"
            disabled={isLoading || !accessCode.trim()}
          >
            {isLoading ? t.auth.validating : t.auth.continue}
          </Button>
        </form>
      </Card>

      <ScreenState
        eyebrow={t.auth.accessRequired}
        title={t.auth.accessInstructions}
        description={t.auth.contactSupport}
      />
    </div>
  );
}
