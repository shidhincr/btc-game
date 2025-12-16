import { Bitcoin } from 'lucide-react';
import { SignOutButton } from '@/features/auth-flow/SignOutButton';
import { cn } from '@/shared/lib/cn';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md">
          <Bitcoin className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold">
          Btc<span className="text-orange-500">Guesser</span>
      </h1>
      </div>
      <div className="flex items-center gap-3">
      <SignOutButton />
      </div>
    </header>
  );
}

