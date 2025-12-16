import { DollarSign } from 'lucide-react';
import { SignOutButton } from '@/features/auth-flow/SignOutButton';
import { cn } from '@/shared/lib/cn';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
        <DollarSign className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
        Bitcoin Prediction Game
      </h1>
      <SignOutButton />
    </header>
  );
}

