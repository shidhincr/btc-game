import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Scoreboard } from './Scoreboard';
import { useGuessStore } from './store';

vi.mock('./store', () => ({
  useGuessStore: vi.fn(),
}));

describe('Scoreboard', () => {
  const mockCalculateScore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockStore = (overrides: Partial<ReturnType<typeof useGuessStore>> = {}) => {
    vi.mocked(useGuessStore).mockReturnValue({
      calculateScore: mockCalculateScore,
      isLoading: false,
      error: null,
      ...overrides,
    } as ReturnType<typeof useGuessStore>);
  };

  describe('score display', () => {
    it('should display positive score with plus sign', () => {
      mockStore();
      mockCalculateScore.mockReturnValue(5);
      render(<Scoreboard />);

      expect(screen.getByText('+5')).toBeInTheDocument();
    });

    it('should display negative score without plus sign', () => {
      mockStore();
      mockCalculateScore.mockReturnValue(-3);
      render(<Scoreboard />);

      expect(screen.getByText('-3')).toBeInTheDocument();
    });

    it('should display zero score', () => {
      mockStore();
      mockCalculateScore.mockReturnValue(0);
      render(<Scoreboard />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should call calculateScore from store', () => {
      mockStore();
      mockCalculateScore.mockReturnValue(10);
      render(<Scoreboard />);

      expect(mockCalculateScore).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when loading', () => {
      mockStore({ isLoading: true });
      mockCalculateScore.mockReturnValue(0);
      const { container } = render(<Scoreboard />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not show score when loading', () => {
      mockStore({ isLoading: true });
      mockCalculateScore.mockReturnValue(5);
      render(<Scoreboard />);

      expect(screen.queryByText('+5')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should display error message when error exists', () => {
      mockStore({ error: 'Error message' });
      mockCalculateScore.mockReturnValue(0);
      render(<Scoreboard />);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should not show score when error exists', () => {
      mockStore({ error: 'Error message' });
      mockCalculateScore.mockReturnValue(5);
      render(<Scoreboard />);

      expect(screen.queryByText('+5')).not.toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('should apply custom className', () => {
      mockStore();
      mockCalculateScore.mockReturnValue(0);
      const { container } = render(<Scoreboard className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});

