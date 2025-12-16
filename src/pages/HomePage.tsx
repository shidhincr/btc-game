import { Header } from '@/shared/ui/Header';
import { Footer } from '@/shared/ui/Footer';
import { GameBoard } from '@/widgets/game-board/GameBoard';

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <GameBoard />
      </main>
      <Footer />
    </div>
  );
}

