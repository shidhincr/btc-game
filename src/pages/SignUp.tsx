import { SignUpForm } from '@/features/auth-flow/SignUpForm';

export function SignUp() {
  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <SignUpForm />
    </div>
  );
}

