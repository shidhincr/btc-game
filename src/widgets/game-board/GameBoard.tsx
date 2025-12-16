import { Ticker } from '@/entities/bitcoin/Ticker';
import { Scoreboard } from '@/entities/guess/Scoreboard';
import { MakeGuessButtons } from '@/features/make-guess/MakeGuessButtons';
import { Timer } from '@/features/make-guess/Timer';
import { GuessResult } from '@/features/make-guess/GuessResult';
import { cn } from '@/shared/lib/cn';

interface GameBoardProps {
  className?: string;
}

export function GameBoard({ className }: GameBoardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 p-4 md:p-6 lg:p-8',
        className
      )}
    >
      <GuessResult />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1" />
        <Scoreboard className="shrink-0" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <Ticker className="w-full max-w-2xl" />

        <div className="flex w-full max-w-2xl flex-col gap-6">
          <Timer />

          <MakeGuessButtons />
        </div>
      </div>
    </div>
  );
}

