import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGuessStore } from './store';
import type { Guess } from './types';
import { client } from '@/shared/api/amplify';

vi.mock('@/shared/api/amplify', () => ({
  client: {
    models: {
      Guess: {
        list: vi.fn(),
      },
    },
  },
}));

const createMockGuess = (overrides?: Partial<Guess>): Guess => ({
  id: 'guess-1',
  startPrice: 50000,
  direction: 'UP',
  status: 'PENDING',
  resolvedPrice: null,
  score: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('useGuessStore', () => {
  beforeEach(() => {
    useGuessStore.setState({
      currentGuess: null,
      guesses: [],
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useGuessStore.getState();
      expect(state.currentGuess).toBeNull();
      expect(state.guesses).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('setCurrentGuess', () => {
    it('should set current guess', () => {
      const guess = createMockGuess();
      useGuessStore.getState().setCurrentGuess(guess);

      const state = useGuessStore.getState();
      expect(state.currentGuess).toEqual(guess);
      expect(state.error).toBeNull();
    });

    it('should clear current guess when set to null', () => {
      const guess = createMockGuess();
      useGuessStore.getState().setCurrentGuess(guess);
      useGuessStore.getState().setCurrentGuess(null);

      const state = useGuessStore.getState();
      expect(state.currentGuess).toBeNull();
    });
  });

  describe('setGuesses', () => {
    it('should set all guesses', () => {
      const guesses = [
        createMockGuess({ id: 'guess-1' }),
        createMockGuess({ id: 'guess-2' }),
      ];
      useGuessStore.getState().setGuesses(guesses);

      const state = useGuessStore.getState();
      expect(state.guesses).toEqual(guesses);
      expect(state.error).toBeNull();
    });

    it('should replace existing guesses', () => {
      const initialGuesses = [createMockGuess({ id: 'guess-1' })];
      useGuessStore.getState().setGuesses(initialGuesses);

      const newGuesses = [createMockGuess({ id: 'guess-2' })];
      useGuessStore.getState().setGuesses(newGuesses);

      const state = useGuessStore.getState();
      expect(state.guesses).toEqual(newGuesses);
      expect(state.guesses).not.toEqual(initialGuesses);
    });
  });

  describe('updateGuess', () => {
    it('should update guess by id', () => {
      const guess = createMockGuess({ id: 'guess-1', status: 'PENDING' });
      useGuessStore.getState().setGuesses([guess]);

      useGuessStore.getState().updateGuess('guess-1', {
        status: 'RESOLVED',
        resolvedPrice: 51000,
        score: 1,
      });

      const state = useGuessStore.getState();
      expect(state.guesses[0].status).toBe('RESOLVED');
      expect(state.guesses[0].resolvedPrice).toBe(51000);
      expect(state.guesses[0].score).toBe(1);
    });

    it('should not update other guesses', () => {
      const guess1 = createMockGuess({ id: 'guess-1' });
      const guess2 = createMockGuess({ id: 'guess-2' });
      useGuessStore.getState().setGuesses([guess1, guess2]);

      useGuessStore.getState().updateGuess('guess-1', { score: 1 });

      const state = useGuessStore.getState();
      expect(state.guesses[0].score).toBe(1);
      expect(state.guesses[1].score).toBeNull();
    });

    it('should update currentGuess if it matches id', () => {
      const guess = createMockGuess({ id: 'guess-1' });
      useGuessStore.getState().setCurrentGuess(guess);

      useGuessStore.getState().updateGuess('guess-1', { score: 1 });

      const state = useGuessStore.getState();
      expect(state.currentGuess?.score).toBe(1);
    });

    it('should not update currentGuess if id does not match', () => {
      const guess = createMockGuess({ id: 'guess-1' });
      useGuessStore.getState().setCurrentGuess(guess);

      useGuessStore.getState().updateGuess('guess-2', { score: 1 });

      const state = useGuessStore.getState();
      expect(state.currentGuess?.score).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      useGuessStore.getState().setLoading(true);
      expect(useGuessStore.getState().isLoading).toBe(true);

      useGuessStore.getState().setLoading(false);
      expect(useGuessStore.getState().isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      useGuessStore.getState().setError('Error message');
      expect(useGuessStore.getState().error).toBe('Error message');
    });

    it('should clear error when set to null', () => {
      useGuessStore.setState({ error: 'Previous error' });
      useGuessStore.getState().setError(null);
      expect(useGuessStore.getState().error).toBeNull();
    });
  });

  describe('clearGuess', () => {
    it('should clear current guess and reset state', () => {
      const guess = createMockGuess();
      useGuessStore.setState({
        currentGuess: guess,
        error: 'Some error',
        isLoading: true,
      });

      useGuessStore.getState().clearGuess();

      const state = useGuessStore.getState();
      expect(state.currentGuess).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });


  describe('fetchGuesses', () => {
    it('should fetch and set guesses successfully', async () => {
      const mockGuesses = [
        createMockGuess({ id: 'guess-1', createdAt: '2024-01-01T00:00:00Z' }),
        createMockGuess({ id: 'guess-2', createdAt: '2024-01-02T00:00:00Z' }),
      ];
      vi.mocked(client.models.Guess.list).mockResolvedValue({
        data: mockGuesses,
      } as any);

      const result = await useGuessStore.getState().fetchGuesses();

      const state = useGuessStore.getState();
      const sortedGuesses = [...mockGuesses].sort(
        (a, b) =>
          new Date(b.createdAt || '').getTime() -
          new Date(a.createdAt || '').getTime()
      );
      expect(state.guesses).toEqual(sortedGuesses);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(result).toEqual(sortedGuesses);
    });

    it('should sort guesses by createdAt descending', async () => {
      const mockGuesses = [
        createMockGuess({ id: 'guess-1', createdAt: '2024-01-01T00:00:00Z' }),
        createMockGuess({ id: 'guess-2', createdAt: '2024-01-03T00:00:00Z' }),
        createMockGuess({ id: 'guess-3', createdAt: '2024-01-02T00:00:00Z' }),
      ];
      vi.mocked(client.models.Guess.list).mockResolvedValue({
        data: mockGuesses,
      } as any);

      await useGuessStore.getState().fetchGuesses();

      const state = useGuessStore.getState();
      expect(state.guesses[0].id).toBe('guess-2');
      expect(state.guesses[1].id).toBe('guess-3');
      expect(state.guesses[2].id).toBe('guess-1');
    });

    it('should set loading state during fetch', async () => {
      vi.mocked(client.models.Guess.list).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: [] } as any), 100))
      );

      const fetchPromise = useGuessStore.getState().fetchGuesses();
      expect(useGuessStore.getState().isLoading).toBe(true);

      await fetchPromise;
      expect(useGuessStore.getState().isLoading).toBe(false);
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Failed to fetch guesses';
      vi.mocked(client.models.Guess.list).mockRejectedValue(new Error(errorMessage));

      await expect(useGuessStore.getState().fetchGuesses()).rejects.toThrow();

      const state = useGuessStore.getState();
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    it('should handle non-Error rejections', async () => {
      vi.mocked(client.models.Guess.list).mockRejectedValue('String error');

      await expect(useGuessStore.getState().fetchGuesses()).rejects.toBe('String error');

      const state = useGuessStore.getState();
      expect(state.error).toBe('Failed to fetch guesses. Please try again.');
      expect(state.isLoading).toBe(false);
    });

    it('should handle null data response', async () => {
      vi.mocked(client.models.Guess.list).mockResolvedValue({
        data: null,
      } as any);

      await expect(useGuessStore.getState().fetchGuesses()).rejects.toThrow(
        'Failed to fetch guesses: No data returned'
      );

      const state = useGuessStore.getState();
      expect(state.error).toBe('Failed to fetch guesses: No data returned');
      expect(state.isLoading).toBe(false);
    });

    it('should clear error before fetching', async () => {
      useGuessStore.setState({ error: 'Previous error' });
      vi.mocked(client.models.Guess.list).mockResolvedValue({
        data: [],
      } as any);

      await useGuessStore.getState().fetchGuesses();

      const state = useGuessStore.getState();
      expect(state.error).toBeNull();
    });
  });
});

