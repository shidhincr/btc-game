import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpForm } from '@/features/auth-flow/SignUpForm';
import { useSessionStore } from '@/entities/session/store';

export function SignUp() {
  const { isAuthenticated, checkAuth } = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <SignUpForm />
    </div>
  );
}

