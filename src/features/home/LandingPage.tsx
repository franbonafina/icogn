import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

const trainingAreas = [
  'Concepts and vocabulary',
  'Argumentation',
  'Oral expression',
  'Decision-making',
  'Cultural and civic knowledge',
];

const learningMethods = [
  'Spaced repetition',
  'Active recall',
  'Interleaving',
  'Deliberate practice',
  'Scenario-based decision-making',
];

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_50%)]" />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-6 sm:px-6 md:px-8">
        <header className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-textMuted">
              icogn
            </p>
            <p className="mt-2 text-sm text-textMuted">
              Executive cognition, trained deliberately
            </p>
          </div>

          <Link to="/login" className="shrink-0">
            <Button variant="ghost">Access</Button>
          </Link>
        </header>

        <main className="flex flex-1 flex-col gap-8 py-8 md:gap-10 md:py-12">
          <section className="space-y-6 rounded-[2rem] border border-white/10 bg-black/20 px-5 py-8 backdrop-blur-sm sm:px-6">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                For leaders, operators, and demanding teams
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-text sm:text-5xl md:text-6xl">
                Train memory, judgment, and expression every day.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-textMuted sm:text-lg">
                icogn is a mobile-first learning system for people expected to think clearly,
                speak with precision, and make better decisions when the stakes are real.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" className="sm:w-auto">
                <Button className="w-full px-6 sm:w-auto">Enter with access code</Button>
              </Link>
              <p className="text-sm leading-6 text-textMuted">
                Built for internal cohorts, private programs, and high-accountability teams.
              </p>
            </div>
            <div className="grid gap-2 pt-1 sm:grid-cols-3">
              {['Memory under pressure', 'Clearer argumentation', 'Sharper executive judgment'].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-textMuted"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <Card elevated className="space-y-5 p-6">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                  What it trains
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  Cognitive discipline for real-world leadership.
                </h2>
              </div>

              <div className="grid gap-3">
                {trainingAreas.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <p className="text-sm font-medium text-text">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="flex flex-col justify-between gap-8 p-6">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                  Positioning
                </p>
                <p className="text-xl font-medium leading-8 text-text">
                  icogn turns raw reading, notes, speeches, and hard-won experience
                  into repeatable training for memory, judgment, argumentation,
                  decision-making, and public expression.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm leading-6 text-textMuted">
                  Positioned as a private, high-discipline learning environment rather
                  than a casual education product.
                </p>
              </div>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
            <Card className="space-y-5 p-6">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                  Learning methods
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  Built on proven practice loops, not passive consumption.
                </h2>
              </div>

              <div className="grid gap-3">
                {learningMethods.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <span className="pt-0.5 text-xs font-medium uppercase tracking-[0.2em] text-textMuted">
                      0{index + 1}
                    </span>
                    <p className="text-sm font-medium text-text">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card elevated className="space-y-5 p-6">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-textMuted">
                  Internal use
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  Designed for private cohorts, internal training, and continuous
                  personal development.
                </h2>
              </div>

              <p className="text-sm leading-7 text-textMuted">
                Built for organizations and curated cohorts that want measurable improvement
                in recall, reasoning, communication, and leadership behavior over time.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                    Private cohorts
                  </p>
                  <p className="mt-2 text-sm text-text">
                    Controlled access, focused groups, shared standards.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
                    Continuous development
                  </p>
                  <p className="mt-2 text-sm text-text">
                    Daily repetition, reflection, and guided decision practice.
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
                Access by invitation
              </p>
              <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-text">
                icogn is for people whose performance depends on what they remember,
                how they reason, and how they communicate in public.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="sm:w-auto">
                <Button className="w-full px-6 sm:w-auto">Enter with access code</Button>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
