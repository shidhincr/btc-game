import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { Bitcoin, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/lib/cn';

export function SignUpForm() {
  const navigate = useNavigate();
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
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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
        setIsConfirmed(true);
        setTimeout(() => {
          navigate('/sign-in');
        }, 2000);
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

  const handleResendCode = async () => {
    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await resendSignUpCode({ username: email });
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to resend confirmation code'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center mb-6">
        <div className="flex gap-3 items-center mb-4">
          <div className="flex justify-center items-center w-12 h-12 text-white bg-orange-500 rounded-lg shadow-md">
            <Bitcoin className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="dark:text-white">Btc</span><span className="text-orange-500">Guesser</span>
          </h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Sign Up
      </h2>
      </div>

      <Card className="w-full">
      {isConfirmed ? (
        <div className="flex flex-col gap-4 items-center py-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Email Confirmed!
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Redirecting you to sign in...
            </p>
          </div>
        </div>
      ) : (
        <>
      {error && (
        <div
          className="p-3 mb-4 text-red-800 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
              'px-3 py-2 w-full rounded-md border border-gray-300',
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
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                <ul className="mt-1 text-sm list-disc list-inside text-red-600 dark:text-red-400">
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
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
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
                'px-3 py-2 w-full rounded-md border border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              placeholder="Enter confirmation code from email"
            />
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <p>
                Check your email for the confirmation code.{' '}
                {resendSuccess ? (
                  <span className="text-green-600 dark:text-green-400">
                    Code sent!
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="font-medium text-orange-500 transition-colors hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 disabled:opacity-50"
                  >
                    {isResending ? 'Sending...' : 'Resend code'}
                  </button>
                )}
              </p>
            </div>
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

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="font-medium text-orange-500 transition-colors hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
          >
            Sign In
          </Link>
        </p>
      </div>
        </>
      )}
    </Card>
    </div>
  );
}

