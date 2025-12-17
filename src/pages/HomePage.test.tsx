import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

vi.mock('@/shared/ui/Header', () => ({
  Header: () => <header>Header</header>,
}));

vi.mock('@/widgets/game-board/GameBoard', () => ({
  GameBoard: () => <div>GameBoard</div>,
}));

vi.mock('@/widgets/history-panel/HistoryPanel', () => ({
  HistoryPanel: () => <div>HistoryPanel</div>,
}));

describe('HomePage', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  };

  describe('rendering', () => {
    it('should render home page content', () => {
      renderWithRouter();
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('GameBoard')).toBeInTheDocument();
      expect(screen.getByText('HistoryPanel')).toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('should have a single root container', () => {
      const { container } = renderWithRouter();
      expect(container.children).toHaveLength(1);
    });

    it('should contain nested div structure', () => {
      const { container } = renderWithRouter();
      const rootDiv = container.firstChild as HTMLElement;
      expect(rootDiv.children.length).toBeGreaterThan(0);
    });
  });
});

