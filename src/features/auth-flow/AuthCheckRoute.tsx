import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSessionStore } from '@/entities/session/store';

interface AuthCheckRouteProps {
  children: React.ReactNode;
}

export function AuthCheckRoute({ children }: AuthCheckRouteProps) {
  const { isAuthenticated, isLoading, checkAuth } = useSessionStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  // If on sign-in page and user is authenticated, redirect to home
  if (location.pathname === '/sign-in' && isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If on any other page and user is not authenticated, redirect to sign-in
  if (location.pathname !== '/sign-in' && !isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

