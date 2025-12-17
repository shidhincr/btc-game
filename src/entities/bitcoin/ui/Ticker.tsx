import { useEffect } from 'react';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useBitcoinStore } from '../store';
import { useGuessStore } from '@/entities/guess/store';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { cn } from '@/shared/lib/cn';

interface TickerProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function Ticker({
  className,
  autoRefresh = true,
  refreshInterval = 10000,
}: TickerProps) {
  const { price, isLoading, error, fetchPrice } = useBitcoinStore();
  const { currentGuess } = useGuessStore();

  const hasActiveGuess = currentGuess !== null && currentGuess.status === 'PENDING';
  const lockedPrice = hasActiveGuess ? currentGuess.startPrice : null;
  const priceColorClass =
    hasActiveGuess && lockedPrice !== null && price !== null
      ? price > lockedPrice
        ? 'text-green-600 dark:text-green-400'
        : price < lockedPrice
          ? 'text-red-600 dark:text-red-400'
          : 'text-slate-900 dark:text-slate-50'
      : 'text-slate-900 dark:text-slate-50';

  const showTrendIcon = hasActiveGuess && lockedPrice !== null && price !== null && price !== lockedPrice;
  const isTrendingUp = showTrendIcon && price !== null && lockedPrice !== null && price > lockedPrice;

  useEffect(() => {
    fetchPrice();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchPrice();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchPrice]);

  if (isLoading && price === null) {
    return (
      <div
        className={cn(
          'flex gap-2 justify-center items-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
          className
        )}
      >
        <Loader2 className="w-6 h-6 text-gray-500 animate-spin dark:text-gray-400" />
        <span className="text-lg text-gray-500 dark:text-gray-400">
          Loading price...
        </span>
      </div>
    );
  }

  if (error || price === null) {
    return (
      <div
        className={cn(
          'flex gap-2 justify-center items-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
          className
        )}
      >
        <span className="text-lg text-red-500 dark:text-red-400">
          {error || 'No price data'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden relative p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-full opacity-50 blur-2xl dark:from-green-900/20" />
      <div className="flex relative flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-green-500 opacity-75" />
            <div className="relative h-2.5 w-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          </div>
          <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase dark:text-gray-300">
            btc/usd (updated every 10 seconds)
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className={cn('text-6xl font-black tabular-nums tracking-tight transition-colors duration-300', priceColorClass)}>
            {formatCurrency(price)}
          </div>
          {showTrendIcon && (
            <div className={cn('flex flex-1 justify-center items-center transition-colors duration-300', priceColorClass)}>
              {isTrendingUp ? (
                <TrendingUp className="w-20 h-20" />
              ) : (
                <TrendingDown className="w-20 h-20" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

