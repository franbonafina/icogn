import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router';
import { LanguageProvider } from '@/lib/useLanguage';

export function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
