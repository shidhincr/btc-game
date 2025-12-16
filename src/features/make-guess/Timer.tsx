import { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { parseISO, differenceInMilliseconds } from 'date-fns';
import { Card } from '@/shared/ui/Card';
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
    if (!hasActiveGuess || !currentGuess.createdAt) {
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

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [hasActiveGuess, currentGuess, resolveGuess]);

  if (!hasActiveGuess) {
    return null;
  }

  const seconds = Math.max(0, Math.ceil(timeRemaining / 1000));
  const progress = Math.max(0, Math.min(100, (timeRemaining / 60000) * 100));

  return (
    <Card
      className={cn(
        'flex flex-col items-center gap-3 p-4',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <TimerIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Time Remaining
        </span>
      </div>

      <>
        <div className="relative flex items-center justify-center">
          <svg className="h-24 w-24 -rotate-90 transform">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
              className="text-yellow-600 dark:text-yellow-400 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {seconds}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              seconds
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Waiting for{' '}
          <span className="font-semibold uppercase">
            {currentGuess.direction}
          </span>{' '}
          prediction to resolve
        </div>
      </>
    </Card>
  );
}

