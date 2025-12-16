import { useState } from 'react';
import type { FormEvent } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useSessionStore } from '@/entities/session/store';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/lib/cn';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useSessionStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn({
        username: email,
        password,
      });
      await checkAuth();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during sign in'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Sign In
      </h2>

      {error && (
        <div
          className="mb-4 p-3 rounded-md bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className={cn(
              'w-full px-3 py-2 border border-gray-300 rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className={cn(
              'w-full px-3 py-2 border border-gray-300 rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            placeholder="Enter your password"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          variant="primary"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Card>
  );
}

