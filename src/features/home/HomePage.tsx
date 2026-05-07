import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { ScreenState } from '@/components/ScreenState';
import { Skeleton } from '@/components/Skeleton';
import { useLanguage } from '@/lib/useLanguage';
import { getCurrentAuthUser } from '@/lib/auth/authService';

function formatAverage(value: number | null) {
  return value === null ? 'N/A' : value.toFixed(1);
}

export function HomePage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<{ uid: string; displayName: string; email: string; accessCode: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentAuthUser();
        if (!currentUser) {
          // Redirect to login if no user
          window.location.href = '/';
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        window.location.href = '/';
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-textMuted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const quickActions = [
    {
      title: language === 'es' ? 'Agregar concepto' : 'Add concept',
      description: language === 'es' ? 'Crear nueva tarjeta de aprendizaje' : 'Create new learning card',
      to: '/app/learn/new',
      variant: 'secondary' as const,
    },
    {
      title: language === 'es' ? 'Iniciar repaso' : 'Start review',
      description: language === 'es' ? 'Practicar conceptos pendientes' : 'Practice pending concepts',
      to: '/app/learn',
      variant: 'primary' as const,
    },
    {
      title: language === 'es' ? 'Práctica de voz' : 'Speech practice',
      description: language === 'es' ? 'Mejorar expresión oral' : 'Improve oral expression',
      to: '/app/speech',
      variant: 'secondary' as const,
    },
    {
      title: language === 'es' ? 'Escenario decisión' : 'Decision scenario',
      description: language === 'es' ? 'Practicar toma de decisiones' : 'Practice decision making',
      to: '/app/decision',
      variant: 'primary' as const,
    },
  ];

  const features = [
    {
      title: language === 'es' ? 'Memoria' : 'Memory',
      description: language === 'es' ? 'Ejercicios de retención y recuerdo' : 'Retention and recall exercises',
      icon: '🧠',
    },
    {
      title: language === 'es' ? 'Argumentación' : 'Argumentation',
      description: language === 'es' ? 'Práctica de razonamiento y debate' : 'Reasoning and debate practice',
      icon: '💬',
    },
    {
      title: language === 'es' ? 'Expresión' : 'Expression',
      description: language === 'es' ? 'Desarrollo de comunicación oral' : 'Oral communication development',
      icon: '🎤',
    },
    {
      title: language === 'es' ? 'Decisión' : 'Decision',
      description: language === 'es' ? 'Simulaciones de liderazgo' : 'Leadership simulations',
      icon: '⚡',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={language === 'es' ? `Buen enfoque, ${user.displayName}.` : `Good focus, ${user.displayName}.`}
        description={language === 'es' 
          ? 'Tu sistema operativo personal para aprendizaje, comunicación y juicio.'
          : 'Your personal operating system for learning, communication, and judgment.'
        }
      />

      {/* Welcome Card */}
      <Card elevated className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {language === 'es' ? 'Bienvenido a icogn' : 'Welcome to icogn'}
          </h2>
          <p className="text-sm leading-6 text-textMuted">
            {language === 'es' 
              ? 'Comienza tu entrenamiento cognitivo con nuestras herramientas de aprendizaje basadas en evidencia.'
              : 'Start your cognitive training with our evidence-based learning tools.'
            }
          </p>
        </div>

        <div className="grid gap-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{feature.icon}</span>
                <div>
                  <p className="text-sm font-medium text-text">{feature.title}</p>
                  <p className="mt-1 text-sm text-textMuted">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card elevated className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
            {language === 'es' ? 'Acciones rápidas' : 'Quick actions'}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {language === 'es' ? 'Inicia directamente la práctica' : 'Move directly into practice'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.to}>
              <Button 
                fullWidth 
                className="h-14" 
                variant={action.variant}
              >
                {action.title}
              </Button>
            </Link>
          ))}
        </div>
      </Card>

      {/* Progress Placeholder */}
      <Card className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
            {language === 'es' ? 'Progreso' : 'Progress'}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {language === 'es' ? 'Tu viaje de aprendizaje' : 'Your learning journey'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
              {language === 'es' ? 'Sesiones' : 'Sessions'}
            </p>
            <p className="text-3xl font-semibold tracking-tight text-text">0</p>
          </div>
          <div className="space-y-1 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
              {language === 'es' ? 'Racha' : 'Streak'}
            </p>
            <p className="text-3xl font-semibold tracking-tight text-text">0</p>
          </div>
        </div>

        <p className="text-sm text-textMuted">
          {language === 'es' 
            ? 'Comienza tu primera sesión para ver tu progreso aquí.'
            : 'Start your first session to see your progress here.'
          }
        </p>
      </Card>
    </div>
  );
}
