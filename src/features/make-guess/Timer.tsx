import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { parseISO, differenceInMilliseconds } from 'date-fns';
import { cn } from '@/shared/lib/cn';
import { useGuessStore } from '@/entities/guess/store';
import { useMakeGuess } from './hooks';

interface TimerProps {
  className?: string;
}

export function Timer({ className }: TimerProps) {
  const { currentGuess } = useGuessStore();
  const { resolveGuess } = useMakeGuess();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const hasActiveGuess =
    currentGuess !== null && currentGuess.status === 'PENDING';

  useEffect(() => {
    if (!hasActiveGuess || !currentGuess?.createdAt) {
      setTimeRemaining(0);
      return;
    }

    const createdAt = parseISO(currentGuess.createdAt);

    const calculateRemaining = () => {
      const now = new Date();
      const elapsed = differenceInMilliseconds(now, createdAt);
      return 60000 - elapsed;
    };

    const updateTimer = () => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        resolveGuess(currentGuess).catch((error) => {
          console.error('Failed to resolve guess:', error);
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [hasActiveGuess, currentGuess, resolveGuess]);

  const seconds = Math.max(0, Math.ceil(timeRemaining / 1000));

  return (
    <div className={cn('flex h-32 w-32 flex-col items-center justify-center', className)}>
      {hasActiveGuess ? (
        <>
          <div className="text-4xl font-black tabular-nums text-slate-800 dark:text-slate-100 transition-all duration-300">
            {seconds}s
          </div>
          <div className="mt-1 animate-pulse text-xs font-medium uppercase text-gray-600 dark:text-gray-400">
            LOCKED: {currentGuess?.direction ?? 'UP'}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            60 Seconds
          </span>
        </div>
      )}
    </div>
  );
}

