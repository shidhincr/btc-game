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
        'grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-gray-700',
        className
      )}
    >
      {/* Prediction */}
      <div className="flex items-center">
        <span
          className={cn(
            'inline-flex gap-1 items-center px-3 py-1 text-xs font-semibold rounded-full',
            isUp
              ? 'text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
              : 'text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isUp ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
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

      <div className="font-mono text-sm text-slate-800 dark:text-slate-100">
        {isPending ? (
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
        ) : guess.resolvedPrice ? (
          formatCurrency(guess.resolvedPrice)
        ) : (
          '—'
        )}
      </div>

      <div>
        {isPending ? (
          <div className="flex gap-1 items-center text-yellow-600 dark:text-yellow-400">
            <Clock className="w-4 h-4 animate-pulse" />
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
                <CheckCircle className="w-4 h-4" />
                <span>Won</span>
              </>
            ) : isLoss ? (
              <>
                <XCircle className="w-4 h-4" />
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
        {isPending ? (
          <div className="ml-auto w-6 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
        ) : (
          <>
            {score > 0 ? '+' : ''}
            {score}
          </>
        )}
      </div>
    </div>
  );
}

