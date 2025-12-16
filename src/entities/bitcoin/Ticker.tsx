import { useEffect } from 'react';
import { useBitcoinStore } from './store';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { cn } from '@/shared/lib/cn';
import { Loader2 } from 'lucide-react';

interface TickerProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * Bitcoin price ticker component
 * Displays the current BTC/USD price with auto-refresh capability
 */
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
          'flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400',
          className
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-lg">Loading price...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-2 text-red-500 dark:text-red-400',
          className
        )}
      >
        <span className="text-lg">Error: {error}</span>
      </div>
    );
  }

  if (price === null) {
    return (
      <div
        className={cn(
          'flex items-center justify-center text-gray-500 dark:text-gray-400',
          className
        )}
      >
        <span className="text-lg">No price data</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {formatCurrency(price)}
        </span>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        BTC/USD
      </span>
    </div>
  );
}

