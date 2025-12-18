import { Ticker } from '@/entities/bitcoin/ui/Ticker';
import { Scoreboard } from '@/entities/guess/Scoreboard';
import { GameInteractionZone } from '@/features/make-guess/GameInteractionZone';
import { cn } from '@/shared/lib/cn';

interface GameBoardProps {
  className?: string;
}

export function GameBoard({ className }: GameBoardProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        <Ticker className="col-span-3" />
        <Scoreboard className="col-span-1" />
      </div>

      <GameInteractionZone />
    </div>
  );
}

