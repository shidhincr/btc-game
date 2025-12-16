import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useBitcoinStore } from './store';
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
  refreshInterval = 60000,
}: TickerProps) {
  const { price, isLoading, error, fetchPrice } = useBitcoinStore();

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
          'flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
          className
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin text-gray-500 dark:text-gray-400" />
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
          'flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
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
        'relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all duration-300 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900',
        className
      )}
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-green-100 to-transparent opacity-50 blur-2xl dark:from-green-900/20" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-green-500 opacity-75" />
            <div className="relative h-2.5 w-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300">
            btc/usd (updated every 10 seconds)
          </span>
        </div>
        <div className="text-6xl font-black tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
          {formatCurrency(price)}
        </div>
      </div>
    </div>
  );
}

