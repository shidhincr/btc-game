import { useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useMakeGuess } from './hooks';
import { useBitcoinStore } from '@/entities/bitcoin/store';
import { useGuessStore } from '@/entities/guess/store';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { Timer } from './Timer';
import { GuessResult } from './GuessResult';

interface GameInteractionZoneProps {
  className?: string;
}

export function GameInteractionZone({ className }: GameInteractionZoneProps) {
  const { createGuess, isLoading } = useMakeGuess();
  const { price: currentPrice, fetchPrice, isLoading: isPriceLoading } =
    useBitcoinStore();
  const { currentGuess, fetchGuesses } = useGuessStore();

  useEffect(() => {
    fetchGuesses();
  }, [fetchGuesses]);

  const isPending = currentGuess?.status === 'PENDING';
  const isResolved = currentGuess?.status === 'RESOLVED';
  const isButtonDisabled =
    isPending || isLoading || isPriceLoading || currentPrice === null;

  const handleGuess = async (direction: 'UP' | 'DOWN') => {
    if (isPending) return;

    await fetchPrice();
    const latestPrice = useBitcoinStore.getState().price;

    if (latestPrice === null) return;
    await createGuess(direction, latestPrice);
  };

  const isUpActive = isPending && currentGuess?.direction === 'UP';
  const isDownActive = isPending && currentGuess?.direction === 'DOWN';

  return (
    <div className={cn('flex flex-col gap-6 items-center', className)}>
      <div
        className={cn(
          'flex flex-col gap-6 items-center py-8 sm:flex-row sm:justify-center'
        )}
      >
        <div
          onClick={() => !isButtonDisabled && !isDownActive && handleGuess('UP')}
          className={cn(
            'flex h-32 w-32 flex-col items-center justify-center gap-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer',
            isUpActive
              ? 'bg-green-500 text-white ring-4 ring-green-300 dark:ring-green-600'
              : isDownActive
                ? 'bg-gray-100 text-gray-400 opacity-50 dark:bg-gray-800 cursor-not-allowed'
                : 'bg-green-100 text-green-600 hover:scale-105 hover:bg-green-50 dark:bg-green-900/30 dark:hover:bg-green-900/40 dark:text-green-400',
            isButtonDisabled && !isDownActive && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ArrowUp className="w-10 h-10" />
          <span className="text-base font-bold uppercase">UP</span>
        </div>

        {isPending ? (
          <Timer />
        ) : isResolved ? (
          <GuessResult />
        ) : (
          <Timer />
        )}

        <div
          onClick={() => !isButtonDisabled && !isUpActive && handleGuess('DOWN')}
          className={cn(
            'flex h-32 w-32 flex-col items-center justify-center gap-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer',
            isDownActive
              ? 'bg-red-500 text-white ring-4 ring-red-300 dark:ring-red-600'
              : isUpActive
                ? 'bg-gray-100 text-gray-400 opacity-50 dark:bg-gray-800 cursor-not-allowed'
                : 'bg-red-100 text-red-600 hover:scale-105 hover:bg-red-50 dark:bg-red-900/30 dark:hover:bg-red-900/40 dark:text-red-400',
            isButtonDisabled && !isUpActive && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ArrowDown className="w-10 h-10" />
          <span className="text-base font-bold uppercase">DOWN</span>
        </div>
      </div>

      <div className="flex justify-center items-center max-w-md text-center min-h-20 sm:min-h-14">
        {isPending && currentGuess?.startPrice ? (
          <div className="flex gap-3 items-center px-4 py-3 text-gray-700 bg-gray-50 rounded-xl transition-all duration-300 dark:bg-gray-800/50 dark:text-gray-300">
            <span className="text-sm font-semibold tracking-wider uppercase opacity-70">
              Locked At
            </span>
            <span className="text-lg font-bold tabular-nums">
              {formatCurrency(currentGuess.startPrice)}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Predict whether BTC price will go <span className="font-semibold">UP</span> or{' '}
            <span className="font-semibold">DOWN</span> in the next 60 seconds. Correct predictions earn +1 point, incorrect ones lose -1 point.
          </p>
        )}
      </div>
    </div>
  );
}
