import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBitcoinStore } from './store';
import { getBitcoinPrice } from '@/shared/api/coinbase';

vi.mock('@/shared/api/coinbase', () => ({
  getBitcoinPrice: vi.fn(),
}));

describe('useBitcoinStore', () => {
  beforeEach(() => {
    useBitcoinStore.setState({
      price: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useBitcoinStore.getState();
      expect(state.price).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastUpdated).toBeNull();
    });
  });

  describe('setPrice', () => {
    it('should set price and update lastUpdated', () => {
      const beforeTime = Date.now();
      useBitcoinStore.getState().setPrice(50000);
      const afterTime = Date.now();

      const state = useBitcoinStore.getState();
      expect(state.price).toBe(50000);
      expect(state.error).toBeNull();
      expect(state.lastUpdated).toBeGreaterThanOrEqual(beforeTime);
      expect(state.lastUpdated).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      useBitcoinStore.getState().setError('Network error');
      const state = useBitcoinStore.getState();
      expect(state.error).toBe('Network error');
    });

    it('should clear error when set to null', () => {
      useBitcoinStore.setState({ error: 'Previous error' });
      useBitcoinStore.getState().setError(null);
      const state = useBitcoinStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      useBitcoinStore.getState().setLoading(true);
      expect(useBitcoinStore.getState().isLoading).toBe(true);

      useBitcoinStore.getState().setLoading(false);
      expect(useBitcoinStore.getState().isLoading).toBe(false);
    });
  });

  describe('fetchPrice', () => {
    it('should fetch price successfully', async () => {
      const mockPrice = 50000;
      vi.mocked(getBitcoinPrice).mockResolvedValue(mockPrice);

      await useBitcoinStore.getState().fetchPrice();

      const state = useBitcoinStore.getState();
      expect(state.price).toBe(mockPrice);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastUpdated).not.toBeNull();
    });

    it('should set loading state during fetch', async () => {
      vi.mocked(getBitcoinPrice).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(50000), 100))
      );

      const fetchPromise = useBitcoinStore.getState().fetchPrice();
      expect(useBitcoinStore.getState().isLoading).toBe(true);
      expect(useBitcoinStore.getState().error).toBeNull();

      await fetchPromise;
      expect(useBitcoinStore.getState().isLoading).toBe(false);
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Failed to fetch price';
      vi.mocked(getBitcoinPrice).mockRejectedValue(new Error(errorMessage));

      await useBitcoinStore.getState().fetchPrice();

      const state = useBitcoinStore.getState();
      expect(state.price).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle non-Error rejections', async () => {
      vi.mocked(getBitcoinPrice).mockRejectedValue('String error');

      await useBitcoinStore.getState().fetchPrice();

      const state = useBitcoinStore.getState();
      expect(state.error).toBe('Failed to fetch Bitcoin price');
      expect(state.isLoading).toBe(false);
    });
  });
});

