import { format } from 'date-fns';
import { ArrowUp, ArrowDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { cn } from '@/shared/lib/cn';
import type { Guess } from '../types';

interface GuessCardProps {
  guess: Guess;
  className?: string;
}

/**
 * Guess card component
 * Displays a single guess with its details (direction, prices, status, score)
 */
export function GuessCard({ guess, className }: GuessCardProps) {
  const isUp = guess.direction === 'UP';
  const score = guess.score ?? 0;
  const isWin = score > 0;
  const isLoss = score < 0;
  const isPending = guess.status === 'PENDING';

  return (
    <div
      className={cn(
        'grid grid-cols-6 gap-4 px-4 py-3 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {/* Prediction */}
      <div className="flex items-center">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
            isUp
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isUp ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {guess.direction}
        </span>
      </div>

      {/* Time */}
      <div className="font-mono text-sm text-slate-800 dark:text-slate-100">
        {guess.createdAt ? format(new Date(guess.createdAt), 'HH:mm:ss') : '—'}
      </div>

      {/* Locked Price */}
      <div className="font-mono text-sm text-slate-800 dark:text-slate-100">
        {formatCurrency(guess.startPrice)}
      </div>

      {/* Resolved Price */}
      <div className="font-mono text-sm text-slate-800 dark:text-slate-100">
        {guess.resolvedPrice !== null && guess.resolvedPrice !== undefined
          ? formatCurrency(guess.resolvedPrice)
          : '—'}
      </div>

      {/* Result */}
      <div>
        {isPending ? (
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Pending</span>
          </div>
        ) : (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isWin && 'text-green-600 dark:text-green-400',
              isLoss && 'text-red-600 dark:text-red-400',
              !isWin && !isLoss && 'text-gray-600 dark:text-gray-400'
            )}
          >
            {isWin ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Won</span>
              </>
            ) : isLoss ? (
              <>
                <XCircle className="h-4 w-4" />
                <span>Lost</span>
              </>
            ) : (
              <span>—</span>
            )}
          </div>
        )}
      </div>

      {/* Score */}
      <div
        className={cn(
          'text-right font-mono text-sm font-semibold',
          isWin && 'text-green-600 dark:text-green-400',
          isLoss && 'text-red-600 dark:text-red-400',
          !isWin && !isLoss && 'text-gray-600 dark:text-gray-400'
        )}
      >
        {score > 0 ? '+' : ''}
        {score}
      </div>
    </div>
  );
}

