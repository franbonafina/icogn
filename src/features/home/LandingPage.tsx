import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { LineArtPeople, FloatingPerson } from '@/components/LineArtPeople';
import { useLanguage } from '@/lib/useLanguage';

export function LandingPage() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_50%)]" />
      
      {/* Animated floating people */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <FloatingPerson delay={0} style={{ top: '10%', left: '5%' }} />
        <FloatingPerson delay={0.5} style={{ top: '20%', right: '8%' }} />
        <FloatingPerson delay={1} style={{ bottom: '30%', left: '12%' }} />
        <FloatingPerson delay={1.5} style={{ bottom: '15%', right: '15%' }} />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-6 sm:px-6 md:px-8">
        <header className="flex items-center justify-between py-4">
          <div className="animate-slide-up">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-textMuted">
              icogn
            </p>
            <p className="mt-2 text-sm text-textMuted">
              {t.landing.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
            <Link to="/login" className="shrink-0">
              <Button variant="ghost">{t.navigation.access}</Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-8 py-8 md:gap-10 md:py-12">
          {/* Hero Section with Line Art */}
          <section className="space-y-6 rounded-[2rem] border border-white/10 bg-black/20 px-5 py-8 backdrop-blur-sm sm:px-6 animate-fade-in">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted animate-slide-up">
                {language === 'es' ? 'Para líderes, operadores y equipos exigentes' : 'For leaders, operators, and demanding teams'}
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-text sm:text-5xl md:text-6xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {t.landing.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-textMuted sm:text-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {t.landing.description}
              </p>
            </div>

            {/* Line Art People Animation */}
            <div className="my-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <LineArtPeople />
            </div>

            <div className="flex flex-col gap-3 pt-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/login" className="sm:w-auto">
                <Button className="w-full px-6 sm:w-auto">{t.landing.enterWithCode}</Button>
              </Link>
              <p className="text-sm leading-6 text-textMuted">
                {t.landing.builtFor}
              </p>
            </div>
            <div className="grid gap-2 pt-1 sm:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              {t.landing.benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-textMuted hover:bg-white/[0.06] transition-colors"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <Card elevated className="space-y-5 p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                  {language === 'es' ? 'Qué entrena' : 'What it trains'}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  {t.landing.whatItTrains.title}
                </h2>
                <p className="text-sm text-textMuted">
                  {t.landing.whatItTrains.description}
                </p>
              </div>

              <div className="grid gap-3">
                {t.landing.trainingAreas.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 hover:bg-white/[0.06] transition-colors"
                  >
                    <p className="text-sm font-medium text-text">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="flex flex-col justify-between gap-8 p-6 animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                  {language === 'es' ? 'Posicionamiento' : 'Positioning'}
                </p>
                <p className="text-xl font-medium leading-8 text-text">
                  {language === 'es' 
                    ? 'icogn convierte lecturas, notas, discursos y experiencia en entrenamiento repetible para memoria, juicio, argumentación, toma de decisiones y expresión pública.'
                    : 'icogn turns raw reading, notes, speeches, and hard-won experience into repeatable training for memory, judgment, argumentation, decision-making, and public expression.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm leading-6 text-textMuted">
                  {language === 'es'
                    ? 'Posicionado como un entorno de aprendizaje privado y de alta disciplina en lugar de un producto educativo casual.'
                    : 'Positioned as a private, high-discipline learning environment rather than a casual education product.'}
                </p>
              </div>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
            <Card className="space-y-5 p-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                  {t.landing.learningMethods.title}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  {language === 'es' 
                    ? 'Construido sobre bucles de práctica probados, no consumo pasivo.'
                    : 'Built on proven practice loops, not passive consumption.'}
                </h2>
                <p className="text-sm text-textMuted">
                  {t.landing.learningMethods.description}
                </p>
              </div>

              <div className="grid gap-3">
                {t.landing.methods.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="pt-0.5 text-xs font-medium uppercase tracking-[0.2em] text-textMuted">
                      0{index + 1}
                    </span>
                    <p className="text-sm font-medium text-text">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card elevated className="space-y-5 p-6 animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                  {language === 'es' ? 'Uso interno' : 'Internal use'}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  {language === 'es'
                    ? 'Diseñado para cohortes privadas, entrenamiento interno y desarrollo personal continuo.'
                    : 'Designed for private cohorts, internal training, and continuous personal development.'}
                </h2>
              </div>

              <p className="text-sm leading-7 text-textMuted">
                {language === 'es'
                  ? 'Construido para organizaciones y cohortes curadas que buscan mejora medible en recuerdo, razonamiento, comunicación y comportamiento de liderazgo con el tiempo.'
                  : 'Built for organizations and curated cohorts that want measurable improvement in recall, reasoning, communication, and leadership behavior over time.'}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors">
                  <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                    {language === 'es' ? 'Cohortes privadas' : 'Private cohorts'}
                  </p>
                  <p className="mt-2 text-sm text-text">
                    {language === 'es'
                      ? 'Acceso controlado, grupos enfocados, estándares compartidos.'
                      : 'Controlled access, focused groups, shared standards.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors">
                  <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                    {language === 'es' ? 'Desarrollo continuo' : 'Continuous development'}
                  </p>
                  <p className="mt-2 text-sm text-text">
                    {language === 'es'
                      ? 'Repetición diaria, reflexión y práctica guiada de decisiones.'
                      : 'Daily repetition, reflection, and guided decision practice.'}
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </main>

        <footer className="border-t border-white/10 py-8">
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                {language === 'es' ? 'Acceso por invitación' : 'Access by invitation'}
              </p>
              <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-text">
                {language === 'es'
                  ? 'icogn es para personas cuyo rendimiento depende de lo que recuerdan, cómo razonan y cómo se comunican en público.'
                  : 'icogn is for people whose performance depends on what they remember, how they reason, and how they communicate in public.'}
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="sm:w-auto">
                <Button className="w-full px-6 sm:w-auto">{t.landing.enterWithCode}</Button>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
