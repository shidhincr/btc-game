import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useGuessStore } from './store';

interface ScoreboardProps {
  className?: string;
}

export function Scoreboard({ className }: ScoreboardProps) {
  const { guesses, isLoading, error } = useGuessStore();
  const score = guesses
    .filter((guess) => guess.status === 'RESOLVED' && guess.score !== null)
    .reduce((total, guess) => total + (guess.score ?? 0), 0);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-br from-blue-50 to-indigo-50 p-8 shadow-lg transition-all duration-300 dark:border-slate-700 dark:from-blue-900/20 dark:to-indigo-900/20',
        className
      )}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-linear-to-br from-blue-200 to-transparent opacity-40 blur-xl dark:from-blue-800/30" />
      <div className="relative flex flex-col items-center justify-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300">
          Total Score
        </span>
        {isLoading ? (
          <Loader2 className="mt-3 h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
        ) : error ? (
          <span className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">
            Error
          </span>
        ) : (
          <span className="mt-3 text-5xl font-black tabular-nums tracking-tight text-blue-700 dark:text-blue-400">
            {score}
          </span>
        )}
      </div>
    </div>
  );
}

