import { createBrowserRouter, Outlet } from 'react-router-dom';

import { AppShell } from '@/components/AppShell';
import { LoginPage } from '@/features/auth/LoginPage';
import { HomePage } from '@/features/home/HomePage';
import { LearnPage } from '@/features/learning/LearnPage';
import { LearningItemDetailPage } from '@/features/learning/LearningItemDetailPage';
import { LearningItemNewPage } from '@/features/learning/LearningItemNewPage';
import { DecisionPage } from '@/features/decision/DecisionPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { SpeechPage } from '@/features/speech/SpeechPage';
import { LandingPage } from '@/features/home/LandingPage';

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
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
    ],
  },
]);
