import { Header } from '@/widgets/header/Header';
import { GameBoard } from '@/widgets/game-board/GameBoard';
import { HistoryPanel } from '@/widgets/history-panel/HistoryPanel';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
      <Header />
      <main className="container mx-auto flex max-w-4xl flex-col gap-6 p-4 md:p-6">
            <GameBoard />
        <HistoryPanel />
      </main>
    </div>
  );
}

