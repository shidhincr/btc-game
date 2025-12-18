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

  const hasActiveGuess = currentGuess !== null;
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
          'flex gap-2 justify-center items-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
          className
        )}
      >
        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 animate-spin dark:text-gray-400" />
        <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
          Loading price...
        </span>
      </div>
    );
  }

  if (error || price === null) {
    return (
      <div
        className={cn(
          'flex gap-2 justify-center items-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
          className
        )}
      >
        <span className="text-base sm:text-lg text-red-500 dark:text-red-400">
          {error || 'No price data'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden relative p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-full opacity-50 blur-2xl dark:from-green-900/20" />
      <div className="flex relative flex-col gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="relative">
            <div className="absolute h-2 w-2 sm:h-2.5 sm:w-2.5 animate-ping rounded-full bg-green-500 opacity-75" />
            <div className="relative h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-600 uppercase dark:text-gray-300">
            <span className="hidden sm:inline">btc/usd (updated every 10 seconds)</span>
            <span className="sm:hidden">btc/usd • live</span>
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className={cn('text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tabular-nums tracking-tight transition-colors duration-300', priceColorClass)}>
            {formatCurrency(price)}
          </div>
          {showTrendIcon && (
            <div className={cn('flex items-center justify-center transition-colors duration-300', priceColorClass)}>
              {isTrendingUp ? (
                <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
              ) : (
                <TrendingDown className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

