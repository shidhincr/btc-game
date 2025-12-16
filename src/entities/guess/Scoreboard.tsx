import { Trophy, Loader2 } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/lib/cn';
import { useGuessStore } from './store';

interface ScoreboardProps {
  className?: string;
}

export function Scoreboard({ className }: ScoreboardProps) {
  const { calculateScore, isLoading, error } = useGuessStore();
  const score = calculateScore();

  return (
    <Card
      className={cn(
        'flex items-center gap-3 p-4',
        className
      )}
    >
      <Trophy className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Score
        </span>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        ) : error ? (
          <span className="text-sm text-red-500 dark:text-red-400">
            Error
          </span>
        ) : (
          <span
            className={cn(
              'text-2xl font-bold',
              score > 0 && 'text-green-600 dark:text-green-400',
              score < 0 && 'text-red-600 dark:text-red-400',
              score === 0 && 'text-gray-600 dark:text-gray-400'
            )}
          >
            {score > 0 ? '+' : ''}
            {score}
          </span>
        )}
      </div>
    </Card>
  );
}

