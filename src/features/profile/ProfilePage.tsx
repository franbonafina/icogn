import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { AIModelSelector } from '@/components/AIModelSelector';
import { useLanguage } from '@/lib/useLanguage';
import { getCurrentAuthUser, signOut } from '@/lib/auth/authService';
import { loadAiSettings, saveAiSettings } from '@/lib/ai/settings';

export function ProfilePage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<{ uid: string; displayName: string; email: string; accessCode: string } | null>(null);
  const [selectedModel, setSelectedModel] = useState('groq-llama3-70b');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentAuthUser();
      setUser(currentUser);
      
      // Load AI settings
      const settings = loadAiSettings();
      setSelectedModel(settings.model || 'groq-llama3-70b');
    }

    loadUser();
  }, []);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    saveAiSettings({ model: modelId, provider: 'groq' });
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-textMuted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={language === 'es' ? 'Perfil' : 'Profile'}
        description={language === 'es' 
          ? 'Gestiona tu configuración de IA y preferencias de aprendizaje.'
          : 'Manage your AI settings and learning preferences.'
        }
      />

      {/* User Info Card */}
      <Card elevated className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
            {language === 'es' ? 'Información de usuario' : 'User Information'}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {user.displayName}
          </h2>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
              {language === 'es' ? 'Correo electrónico' : 'Email'}
            </p>
            <p className="text-sm text-text">{user.email}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
              {language === 'es' ? 'Código de acceso' : 'Access Code'}
            </p>
            <p className="text-sm font-mono text-text">{user.accessCode}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
              {language === 'es' ? 'ID de usuario' : 'User ID'}
            </p>
            <p className="text-sm font-mono text-textMuted">{user.uid}</p>
          </div>
        </div>
      </Card>

      {/* AI Model Selector */}
      <Card elevated className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
            {language === 'es' ? 'Modelo de IA' : 'AI Model'}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {language === 'es' ? 'Elige tu modelo de IA' : 'Choose your AI model'}
          </h2>
          <p className="text-sm text-textMuted">
            {language === 'es' 
              ? 'Selecciona el modelo que mejor se adapte a tus necesidades de aprendizaje.'
              : 'Select the model that best fits your learning needs.'
            }
          </p>
        </div>

        <AIModelSelector
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      </Card>

      {/* Quick Actions */}
      <Card elevated className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
            {language === 'es' ? 'Acciones rápidas' : 'Quick Actions'}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {language === 'es' ? 'Gestionar tu cuenta' : 'Manage your account'}
          </h2>
        </div>

        <div className="grid gap-3">
          <Link to="/app">
            <Button fullWidth variant="secondary">
              {language === 'es' ? 'Volver al dashboard' : 'Back to dashboard'}
            </Button>
          </Link>
          
          <Button 
            fullWidth 
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {isLoading 
              ? (language === 'es' ? 'Cerrando sesión...' : 'Signing out...')
              : (language === 'es' ? 'Cerrar sesión' : 'Sign out')
            }
          </Button>
        </div>
      </Card>
    </div>
  );
}
