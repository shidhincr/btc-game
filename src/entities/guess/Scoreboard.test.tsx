import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Scoreboard } from './Scoreboard';
import { useGuessStore } from './store';
import type { Guess } from './types';

vi.mock('./store', () => ({
  useGuessStore: vi.fn(),
}));

const createMockGuess = (overrides?: Partial<Guess>): Guess => ({
  id: 'guess-1',
  startPrice: 50000,
  direction: 'UP',
  status: 'RESOLVED',
  resolvedPrice: 51000,
  score: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('Scoreboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockStore = (overrides: Partial<ReturnType<typeof useGuessStore>> = {}) => {
    vi.mocked(useGuessStore).mockReturnValue({
      guesses: [],
      isLoading: false,
      error: null,
      ...overrides,
    } as ReturnType<typeof useGuessStore>);
  };

  describe('score display', () => {
    it('should display positive score', () => {
      mockStore({
        guesses: [
          createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: 5 }),
        ],
      });
      render(<Scoreboard />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should display negative score', () => {
      mockStore({
        guesses: [
          createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: -3 }),
        ],
      });
      render(<Scoreboard />);

      expect(screen.getByText('-3')).toBeInTheDocument();
    });

    it('should display zero score', () => {
      mockStore({
        guesses: [
          createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: 0 }),
        ],
      });
      render(<Scoreboard />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should calculate score from resolved guesses', () => {
      mockStore({
        guesses: [
          createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: 5 }),
          createMockGuess({ id: 'guess-2', status: 'RESOLVED', score: -2 }),
          createMockGuess({ id: 'guess-3', status: 'PENDING', score: null }),
        ],
      });
      render(<Scoreboard />);

      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when loading', () => {
      mockStore({ isLoading: true });
      const { container } = render(<Scoreboard />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not show score when loading', () => {
      mockStore({
        isLoading: true,
        guesses: [
          createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: 5 }),
        ],
      });
      render(<Scoreboard />);

      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should display error message when error exists', () => {
      mockStore({ error: 'Error message' });
      render(<Scoreboard />);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should not show score when error exists', () => {
      mockStore({
        error: 'Error message',
        guesses: [
          createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: 5 }),
        ],
      });
      render(<Scoreboard />);

      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('should apply custom className', () => {
      mockStore({
        guesses: [
          createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: 0 }),
        ],
      });
      const { container } = render(<Scoreboard className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});

