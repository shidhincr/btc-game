import { ArrowUp, ArrowDown, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { cn } from '@/shared/lib/cn';
import { useMakeGuess } from './hooks';
import { useBitcoinStore } from '@/entities/bitcoin/store';
import { useGuessStore } from '@/entities/guess/store';

interface MakeGuessButtonsProps {
  className?: string;
}

/**
 * Make guess buttons component
 * Provides UP/DOWN buttons to create guesses and displays locked price when active
 */
export function MakeGuessButtons({ className }: MakeGuessButtonsProps) {
  const { createGuess, isLoading } = useMakeGuess();
  const { price: currentPrice, fetchPrice, isLoading: isPriceLoading } = useBitcoinStore();
  const { currentGuess } = useGuessStore();

  const hasActiveGuess = currentGuess !== null && currentGuess.status === 'PENDING';
  const lockedPrice = hasActiveGuess ? currentGuess.startPrice : null;
  const isButtonDisabled = hasActiveGuess || isLoading || isPriceLoading || currentPrice === null;

  const handleGuess = async (direction: 'UP' | 'DOWN') => {
    if (hasActiveGuess) return;

    await fetchPrice();
    const latestPrice = useBitcoinStore.getState().price;

    if (latestPrice === null) return;
    await createGuess(direction, latestPrice);
  };

  return (
    <Card className={cn('flex flex-col gap-4', className)}>
      {lockedPrice !== null && (
        <div className="flex items-center justify-center gap-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
          <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-yellow-700 dark:text-yellow-300">
              Locked Price
            </span>
            <span className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
              {formatCurrency(lockedPrice)}
            </span>
          </div>
        </div>
      )}

      {lockedPrice === null && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {isPriceLoading ? 'Fetching latest price...' : 'Current Price'}
          </span>
          {isPriceLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                Loading...
              </span>
            </div>
          ) : currentPrice !== null ? (
            <span className="text-lg font-semibold">
              {formatCurrency(currentPrice)}
            </span>
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              No price available
            </span>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="primary"
          size="lg"
          className={cn(
            'flex-1 bg-green-600 hover:bg-green-700 focus-visible:ring-green-600 dark:bg-green-500 dark:hover:bg-green-600',
            isButtonDisabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => handleGuess('UP')}
          disabled={isButtonDisabled}
        >
          {isPriceLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ArrowUp className="mr-2 h-5 w-5" />
          )}
          UP
        </Button>

        <Button
          variant="primary"
          size="lg"
          className={cn(
            'flex-1 bg-red-600 hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-500 dark:hover:bg-red-600',
            isButtonDisabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => handleGuess('DOWN')}
          disabled={isButtonDisabled}
        >
          {isPriceLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ArrowDown className="mr-2 h-5 w-5" />
          )}
          DOWN
        </Button>
      </div>

      {hasActiveGuess && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Wait for the current guess to resolve before making a new one
        </p>
      )}
    </Card>
  );
}

