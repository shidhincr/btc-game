import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { SignIn } from '@/pages/SignIn';
import { SignUp } from '@/pages/SignUp';
import { ErrorPage } from '@/pages/ErrorPage';
import { AuthCheckRoute } from '@/features/auth-flow/AuthCheckRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthCheckRoute>
        <HomePage />
      </AuthCheckRoute>
    ),
  },
  {
    path: '/sign-in',
    element: (
      <AuthCheckRoute>
        <SignIn />
      </AuthCheckRoute>
    ),
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  }
]);

