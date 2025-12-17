import { SignInForm } from '@/features/auth-flow/SignInForm';

export function SignIn() {
  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <SignInForm />
    </div>
  );
}

