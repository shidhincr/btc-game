import { useEffect } from 'react';
import { ArrowUp, ArrowDown, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatCurrency';
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
      <div className={cn('flex items-center justify-center p-8', className)}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  if (resolvedGuesses.length === 0) {
    return (
      <div className={cn('flex flex-col items-center gap-2 p-8', className)}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No history yet. Make your first guess to get started!
        </p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Prediction
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Time
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Locked Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Resolved Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Result
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {resolvedGuesses.map((guess) => {
            const isUp = guess.direction === 'UP';
            const score = guess.score ?? 0;
            const isWin = score > 0;
            const isLoss = score < 0;

            return (
              <tr
                key={guess.id}
                className="transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3 font-mono text-sm text-slate-800 dark:text-slate-100">
                  {guess.createdAt
                    ? new Date(guess.createdAt).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                    : '—'}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-slate-800 dark:text-slate-100">
                  {formatCurrency(guess.startPrice)}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-slate-800 dark:text-slate-100">
                  {guess.resolvedPrice !== null &&
                  guess.resolvedPrice !== undefined
                    ? formatCurrency(guess.resolvedPrice)
                    : '—'}
                </td>
                <td className="px-4 py-3">
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
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right font-mono text-sm font-semibold',
                    isWin && 'text-green-600 dark:text-green-400',
                    isLoss && 'text-red-600 dark:text-red-400',
                    !isWin && !isLoss && 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {score > 0 ? '+' : ''}
                  {score}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
