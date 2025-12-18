import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthCheckRoute } from '@/features/auth-flow/AuthCheckRoute';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const SignIn = lazy(() => import('@/pages/SignIn').then((m) => ({ default: m.SignIn })));
const SignUp = lazy(() => import('@/pages/SignUp').then((m) => ({ default: m.SignUp })));
const ErrorPage = lazy(() => import('@/pages/ErrorPage').then((m) => ({ default: m.ErrorPage })));

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

