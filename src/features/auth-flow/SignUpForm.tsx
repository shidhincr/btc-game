import { useState } from 'react';
import type { FormEvent } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useSessionStore } from '@/entities/session/store';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/lib/cn';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [hasPasswordBlurred, setHasPasswordBlurred] = useState(false);
  const [hasConfirmPasswordBlurred, setHasConfirmPasswordBlurred] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const { checkAuth } = useSessionStore();

  const passwordInputClassName = cn(
    'w-full px-3 py-2 border border-gray-300 rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/\d/.test(pwd)) {
      errors.push('At least 1 digit');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('At least 1 uppercase letter');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) {
      errors.push('At least 1 symbol');
    }
    return errors;
  };

  const handlePasswordBlur = () => {
    setHasPasswordBlurred(true);
    if (password.length > 0) {
      setPasswordErrors(validatePassword(password));
    } else {
      setPasswordErrors([]);
    }
  };

  const handleConfirmPasswordBlur = () => {
    setHasConfirmPasswordBlurred(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPasswordErrors([]);
    setIsLoading(true);

    try {
      if (needsConfirmation) {
        await confirmSignUp({
          username: email,
          confirmationCode,
        });
        await signIn({
          username: email,
          password,
        });
        await checkAuth();
      } else {
        const validationErrors = validatePassword(password);
        if (validationErrors.length > 0) {
          setError(`Password must contain: ${validationErrors.join(', ')}`);
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
            },
          },
        });
        setNeedsConfirmation(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during sign up'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Sign Up
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
            disabled={isLoading || needsConfirmation}
            className={cn(
              'w-full px-3 py-2 border border-gray-300 rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            placeholder="Enter your email"
          />
        </div>

        {!needsConfirmation && (
          <>
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
                onBlur={handlePasswordBlur}
                required
                disabled={isLoading}
                minLength={8}
                className={passwordInputClassName}
                placeholder="Enter your password"
              />
              {hasPasswordBlurred && passwordErrors.length > 0 && (
                <ul className="mt-1 text-sm text-red-600 dark:text-red-400 list-disc list-inside">
                  {passwordErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              )}
              {hasPasswordBlurred && password.length > 0 && passwordErrors.length === 0 && (
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  Password meets all requirements
                </p>
              )}
              {hasPasswordBlurred && password.length === 0 && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Password is required
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPasswordBlur}
                required
                disabled={isLoading}
                minLength={8}
                className={passwordInputClassName}
                placeholder="Confirm your password"
              />
              {hasConfirmPasswordBlurred && confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Passwords do not match
                </p>
              )}
              {hasConfirmPasswordBlurred && confirmPassword.length > 0 && password === confirmPassword && password.length > 0 && (
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  Passwords match
                </p>
              )}
            </div>
          </>
        )}

        {needsConfirmation && (
          <div>
            <label
              htmlFor="confirmationCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirmation Code
            </label>
            <input
              id="confirmationCode"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
              disabled={isLoading}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              placeholder="Enter confirmation code from email"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Check your email for the confirmation code
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          variant="primary"
        >
          {isLoading
            ? 'Processing...'
            : needsConfirmation
              ? 'Confirm Sign Up'
              : 'Sign Up'}
        </Button>
      </form>
    </Card>
  );
}

