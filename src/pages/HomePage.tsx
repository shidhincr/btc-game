import { Header } from '@/shared/ui/Header';
import { Footer } from '@/shared/ui/Footer';
import { GameBoard } from '@/widgets/game-board/GameBoard';
import { HistoryPanel } from '@/widgets/history-panel/HistoryPanel';

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto grid grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <GameBoard />
          </div>
          <div className="lg:col-span-1">
            <HistoryPanel className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

