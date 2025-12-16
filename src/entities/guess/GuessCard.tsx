import { ArrowUp, ArrowDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { cn } from '@/shared/lib/cn';
import type { Guess } from './types';

interface GuessCardProps {
  guess: Guess;
  className?: string;
}

/**
 * Guess card component
 * Displays a single guess with its details (direction, prices, status, score)
 */
export function GuessCard({ guess, className }: GuessCardProps) {
  const isPending = guess.status === 'PENDING';
  const isResolved = guess.status === 'RESOLVED';
  const isUp = guess.direction === 'UP';
  const score = guess.score ?? null;
  const hasResolvedScore = isResolved && score !== null;
  const isWin = hasResolvedScore && score! > 0;
  const isLoss = hasResolvedScore && score! < 0;
  const isTie = hasResolvedScore && score! === 0;

  return (
    <Card
      className={cn(
        'flex flex-col gap-3',
        isPending && 'border-yellow-500 dark:border-yellow-600',
        isWin && 'border-green-500 dark:border-green-600',
        isLoss && 'border-red-500 dark:border-red-600',
        isTie && 'border-gray-400 dark:border-gray-500',
        className
      )}
    >
      {/* Header with direction and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isUp ? (
            <ArrowUp className="h-5 w-5 text-green-500 dark:text-green-400" />
          ) : (
            <ArrowDown className="h-5 w-5 text-red-500 dark:text-red-400" />
          )}
          <span className="font-semibold uppercase">
            {guess.direction}
          </span>
        </div>

        {isPending && (
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Pending</span>
          </div>
        )}

        {isResolved && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm',
              isWin && 'text-green-600 dark:text-green-400',
              isLoss && 'text-red-600 dark:text-red-400',
              isTie && 'text-gray-600 dark:text-gray-400'
            )}
          >
            {isWin && <CheckCircle className="h-4 w-4" />}
            {isLoss && <XCircle className="h-4 w-4" />}
            {isTie && <span className="h-4 w-4">—</span>}
            <span>
              {isWin ? 'Win' : isLoss ? 'Loss' : 'Tie'}
            </span>
          </div>
        )}
      </div>

      {/* Price information */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Start Price:</span>
          <span className="font-medium">
            {formatCurrency(guess.startPrice)}
          </span>
        </div>

        {isResolved && guess.resolvedPrice !== null && guess.resolvedPrice !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Resolved Price:
            </span>
            <span className="font-medium">
              {formatCurrency(guess.resolvedPrice)}
            </span>
          </div>
        )}

        {isResolved && score !== null && (
          <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
            <span className="font-semibold">Score:</span>
            <span
              className={cn(
                'font-bold',
                isWin && 'text-green-600 dark:text-green-400',
                isLoss && 'text-red-600 dark:text-red-400',
                isTie && 'text-gray-600 dark:text-gray-400'
              )}
            >
              {score > 0 ? '+' : ''}
              {score}
            </span>
          </div>
        )}
      </div>

      {/* Timestamp */}
      {guess.createdAt && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(guess.createdAt).toLocaleString()}
        </div>
      )}
    </Card>
  );
}

