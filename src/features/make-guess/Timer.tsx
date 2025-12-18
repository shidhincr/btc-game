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

  const isPending = currentGuess?.status === 'PENDING';

  useEffect(() => {
    if (!isPending || !currentGuess?.createdAt) {
      return;
    }

    const createdAt = parseISO(currentGuess.createdAt);

    const calculateRemaining = () => {
      const now = new Date();
      const elapsed = differenceInMilliseconds(now, createdAt);
      return 60000 - elapsed;
    };

    const updateTimer = async () => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        try {
          await resolveGuess(currentGuess);
        } catch (error) {
          console.error('Failed to resolve guess:', error);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [isPending, currentGuess, resolveGuess]);

  const seconds = Math.max(0, Math.ceil(timeRemaining / 1000));

  return (
    <div className={cn('flex flex-col justify-center items-center w-32 h-32', className)}>
      {isPending ? (
        <>
          <div className="text-4xl font-black tabular-nums transition-all duration-300 text-slate-800 dark:text-slate-100">
            {seconds}s
          </div>
          <div className="mt-1 text-xs font-medium text-gray-600 uppercase animate-pulse dark:text-gray-400">
            LOCKED: {currentGuess?.direction ?? 'UP'}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 items-center">
          <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            60 Seconds
          </span>
        </div>
      )}
    </div>
  );
}

