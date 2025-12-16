import { useEffect } from 'react';
import { History, Loader2 } from 'lucide-react';
import { GuessCard } from '@/entities/guess/GuessCard';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/lib/cn';
import { useGuessStore } from '@/entities/guess/store';

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
      <Card className={cn('flex items-center justify-center p-8', className)}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </Card>
    );
  }

  if (resolvedGuesses.length === 0) {
    return (
      <Card className={cn('flex flex-col items-center gap-2 p-8', className)}>
        <History className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No history yet. Make your first guess to get started!
        </p>
      </Card>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {resolvedGuesses.map((guess) => (
        <GuessCard key={guess.id} guess={guess} />
      ))}
    </div>
  );
}

