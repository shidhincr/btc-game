import { create } from 'zustand';
import { getBitcoinPrice } from '@/shared/api/coinbase';

interface BitcoinState {
  price: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface BitcoinStore extends BitcoinState {
  fetchPrice: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Zustand store for Bitcoin price state
 * Manages the current BTC/USD price and provides methods to fetch and update it
 */
export const useBitcoinStore = create<BitcoinStore>((set) => ({
  price: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchPrice: async () => {
    set({ isLoading: true, error: null });
    try {
      const price = await getBitcoinPrice();
      set({
        price,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch Bitcoin price';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  setError: (error) => set({ error }),

  setLoading: (isLoading) => set({ isLoading }),
}));

