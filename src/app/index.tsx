import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from '@/features/toggle-theme/store';

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;

