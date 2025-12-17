import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useGuessStore } from '@/entities/guess/store';
import { GuessCard } from '@/entities/guess/ui/GuessCard';

interface HistoryListProps {
  className?: string;
}

export function HistoryList({ className }: HistoryListProps) {
  const { guesses, isLoading, fetchGuesses, currentGuess } = useGuessStore();

  useEffect(() => {
    fetchGuesses();
  }, [fetchGuesses]);

  const resolvedGuesses = guesses.filter(
    (guess) => guess.status === 'RESOLVED'
  );

  if (isLoading && !currentGuess) {
    return (
      <div className={cn('flex justify-center items-center p-8', className)}>
        <Loader2 className="w-6 h-6 text-gray-500 animate-spin dark:text-gray-400" />
      </div>
    );
  }

  if (resolvedGuesses.length === 0) {
    return (
      <div className={cn('flex flex-col gap-2 items-center p-8', className)}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No history yet. Make your first guess to get started!
        </p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="text-xs font-medium tracking-wider text-left uppercase text-slate-500">
          Prediction
        </div>
        <div className="text-xs font-medium tracking-wider text-left uppercase text-slate-500">
          Time
        </div>
        <div className="text-xs font-medium tracking-wider text-left uppercase text-slate-500">
          Locked Price
        </div>
        <div className="text-xs font-medium tracking-wider text-left uppercase text-slate-500">
          Resolved Price
        </div>
        <div className="text-xs font-medium tracking-wider text-left uppercase text-slate-500">
          Result
        </div>
        <div className="text-xs font-medium tracking-wider text-right uppercase text-slate-500">
          Score
        </div>
      </div>

      {/* Guess rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {resolvedGuesses.map((guess) => (
          <GuessCard key={guess.id} guess={guess} />
        ))}
      </div>
    </div>
  );
}
