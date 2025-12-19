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
        'flex overflow-hidden relative justify-center items-center p-4 from-blue-50 to-indigo-50 rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 bg-linear-to-br sm:p-6 md:p-8 dark:border-slate-700 dark:from-blue-900/20 dark:to-indigo-900/20',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-16 h-16 from-blue-200 to-transparent rounded-full opacity-40 blur-xl sm:h-24 sm:w-24 bg-linear-to-br dark:from-blue-800/30" />
      <div className="flex relative flex-col justify-center items-center">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300">
          <span className="hidden sm:inline">Total Score</span>
          <span className="sm:hidden">Score</span>
        </span>
        <div className="flex justify-center items-center mt-2 min-h-8 sm:mt-3 sm:min-h-10 md:min-h-12">
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-gray-500 animate-spin sm:h-8 sm:w-8 dark:text-gray-400" />
          ) : error ? (
            <span className="text-xs font-semibold text-red-600 sm:text-sm dark:text-red-400">
              Error
            </span>
          ) : (
            <span className="text-2xl font-black tabular-nums tracking-tight text-blue-700 sm:text-4xl md:text-5xl dark:text-blue-400">
              {score}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

