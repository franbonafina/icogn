import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/Button';
import { LoginPage } from '@/features/auth/LoginPage';
import { FormationAuthorDetailPage } from '@/features/formation/FormationAuthorDetailPage';
import { FormationDailyPage } from '@/features/formation/FormationDailyPage';
import { FormationLibraryPage } from '@/features/formation/FormationLibraryPage';
import { FormationMemosPage } from '@/features/formation/FormationMemosPage';
import { FormationPage } from '@/features/formation/FormationPage';
import { FormationProgressionPage } from '@/features/formation/FormationProgressionPage';
import { HomePage } from '@/features/home/HomePage';
import { LearnPage } from '@/features/learning/LearnPage';
import { LearningItemDetailPage } from '@/features/learning/LearningItemDetailPage';
import { LearningItemNewPage } from '@/features/learning/LearningItemNewPage';
import { DecisionPage } from '@/features/decision/DecisionPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { AISettingsPage } from '@/features/settings/AISettingsPage';
import { SpeechPage } from '@/features/speech/SpeechPage';
import { LandingPage } from '@/features/home/LandingPage';

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-shell flex-col justify-center gap-5 px-4 pb-10 pt-8 sm:px-6">
      <p className="text-xs uppercase tracking-[0.24em] text-textMuted">Not found</p>
      <h1 className="text-4xl font-semibold tracking-tight text-text">This route does not exist.</h1>
      <p className="text-sm leading-6 text-textMuted">
        Return to the landing page or move back into the app shell.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/">
          <Button>Go home</Button>
        </Link>
        <Link to="/app">
          <Button variant="secondary">Open app</Button>
        </Link>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'learn',
        element: <LearnPage />,
      },
      {
        path: 'learn/new',
        element: <LearningItemNewPage />,
      },
      {
        path: 'learn/:itemId',
        element: <LearningItemDetailPage />,
      },
      {
        path: 'formation',
        element: <FormationPage />,
      },
      {
        path: 'formation/daily',
        element: <FormationDailyPage />,
      },
      {
        path: 'formation/library',
        element: <FormationLibraryPage />,
      },
      {
        path: 'formation/library/:authorSlug',
        element: <FormationAuthorDetailPage />,
      },
      {
        path: 'formation/memos',
        element: <FormationMemosPage />,
      },
      {
        path: 'formation/progression',
        element: <FormationProgressionPage />,
      },
      {
        path: 'speech',
        element: <SpeechPage />,
      },
      {
        path: 'decision',
        element: <DecisionPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings/ai',
        element: <AISettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
