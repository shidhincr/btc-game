import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Ticker } from './Ticker';
import { useBitcoinStore } from './store';

vi.mock('./store', () => ({
  useBitcoinStore: vi.fn(),
}));

describe('Ticker', () => {
  const mockFetchPrice = vi.fn();
  const mockSetPrice = vi.fn();
  const mockSetError = vi.fn();
  const mockSetLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockStore = (overrides: Partial<ReturnType<typeof useBitcoinStore>> = {}) => {
    vi.mocked(useBitcoinStore).mockReturnValue({
      price: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
      fetchPrice: mockFetchPrice,
      setPrice: mockSetPrice,
      setError: mockSetError,
      setLoading: mockSetLoading,
      ...overrides,
    } as ReturnType<typeof useBitcoinStore>);
  };

  describe('loading state', () => {
    it('should show loading spinner when loading and price is null', () => {
      mockStore({ isLoading: true, price: null });
      const { container } = render(<Ticker />);

      expect(screen.getByText('Loading price...')).toBeInTheDocument();
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should display error message when error exists', () => {
      mockStore({ error: 'Network error' });
      render(<Ticker />);

      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  describe('null price state', () => {
    it('should show "No price data" when price is null and not loading', () => {
      mockStore({ price: null, isLoading: false, error: null });
      render(<Ticker />);

      expect(screen.getByText('No price data')).toBeInTheDocument();
    });
  });

  describe('price display', () => {
    it('should display formatted price', () => {
      mockStore({ price: 50000 });
      render(<Ticker />);

      expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    });

    it('should display BTC/USD label', () => {
      mockStore({ price: 50000 });
      render(<Ticker />);

      expect(screen.getByText(/btc\/usd/i)).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      mockStore({ price: 50000 });
      const { container } = render(<Ticker className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('auto-refresh', () => {
    it('should fetch price on mount', () => {
      mockStore();
      render(<Ticker />);

      expect(mockFetchPrice).toHaveBeenCalledTimes(1);
    });

    it('should set up auto-refresh interval when autoRefresh is true', () => {
      mockStore();
      render(<Ticker autoRefresh={true} refreshInterval={1000} />);

      expect(mockFetchPrice).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(mockFetchPrice).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(1000);
      expect(mockFetchPrice).toHaveBeenCalledTimes(3);
    });

    it('should not set up interval when autoRefresh is false', () => {
      mockStore();
      render(<Ticker autoRefresh={false} />);

      expect(mockFetchPrice).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(60000);
      expect(mockFetchPrice).toHaveBeenCalledTimes(1);
    });

    it('should use default refresh interval of 10000ms', () => {
      mockStore();
      render(<Ticker />);

      expect(mockFetchPrice).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(10000);
      expect(mockFetchPrice).toHaveBeenCalledTimes(2);
    });

    it('should cleanup interval on unmount', () => {
      mockStore();
      const { unmount } = render(<Ticker autoRefresh={true} refreshInterval={1000} />);

      expect(mockFetchPrice).toHaveBeenCalledTimes(1);

      unmount();

      vi.advanceTimersByTime(1000);
      expect(mockFetchPrice).toHaveBeenCalledTimes(1);
    });
  });
});

