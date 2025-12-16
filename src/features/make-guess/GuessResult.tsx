import { CheckCircle, XCircle, Minus } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/lib/cn';
import { useGuessStore } from '@/entities/guess/store';

interface GuessResultProps {
  className?: string;
}

export function GuessResult({
  className,
}: GuessResultProps) {
  const { currentGuess } = useGuessStore();

  if (!currentGuess || currentGuess.status !== 'RESOLVED') {
    return null;
  }

  const score = currentGuess.score ?? 0;
  const isWin = score > 0;
  const isLoss = score < 0;
  const isTie = score === 0;

  return (
    <Card
      className={cn(
        'fixed top-4 right-4 z-50 animate-in slide-in-from-top-5',
        isWin && 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/20',
        isLoss && 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20',
        isTie && 'border-gray-400 bg-gray-50 dark:border-gray-500 dark:bg-gray-900/20',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {isWin && (
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
        )}
        {isLoss && (
          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        )}
        {isTie && (
          <Minus className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        )}

        <div className="flex flex-col">
          <span
            className={cn(
              'font-semibold',
              isWin && 'text-green-800 dark:text-green-200',
              isLoss && 'text-red-800 dark:text-red-200',
              isTie && 'text-gray-800 dark:text-gray-200'
            )}
          >
            {isWin ? 'Win!' : isLoss ? 'Loss' : 'Tie'}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Score: {score > 0 ? '+' : ''}
            {score}
          </span>
        </div>
      </div>
    </Card>
  );
}

