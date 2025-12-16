import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useGuessStore } from '@/entities/guess/store';

interface GuessResultProps {
  className?: string;
}

export function GuessResult({ className }: GuessResultProps) {
  const { currentGuess } = useGuessStore();

  if (!currentGuess || currentGuess.status !== 'RESOLVED') {
    return null;
  }

  const score = currentGuess.score ?? 0;
  const isWin = score > 0;
  const isLoss = score < 0;

  return (
    <div className={cn('flex h-32 w-32 flex-col items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-2 transition-all duration-300">
        {isWin ? (
          <>
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              You Won
            </span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              +{score}
            </span>
          </>
        ) : isLoss ? (
          <>
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
              You Lost
          </span>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
            {score}
          </span>
          </>
        ) : (
          <>
            <Clock className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
              Tie
            </span>
          </>
        )}
      </div>
    </div>
  );
}

