import { describe, it, expect, beforeEach } from 'vitest';
import { useGuessStore } from './store';
import type { Guess } from './types';

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

  describe('addGuess', () => {
    it('should add guess to guesses array', () => {
      const guess1 = createMockGuess({ id: 'guess-1' });
      const guess2 = createMockGuess({ id: 'guess-2' });

      useGuessStore.getState().addGuess(guess1);
      useGuessStore.getState().addGuess(guess2);

      const state = useGuessStore.getState();
      expect(state.guesses).toHaveLength(2);
      expect(state.guesses[0]).toEqual(guess1);
      expect(state.guesses[1]).toEqual(guess2);
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

  describe('calculateScore', () => {
    it('should return 0 for empty guesses', () => {
      const score = useGuessStore.getState().calculateScore();
      expect(score).toBe(0);
    });

    it('should return 0 when no resolved guesses', () => {
      const guesses = [
        createMockGuess({ id: 'guess-1', status: 'PENDING' }),
        createMockGuess({ id: 'guess-2', status: 'PENDING' }),
      ];
      useGuessStore.getState().setGuesses(guesses);

      const score = useGuessStore.getState().calculateScore();
      expect(score).toBe(0);
    });

    it('should calculate score from resolved guesses only', () => {
      const guesses = [
        createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: 1 }),
        createMockGuess({ id: 'guess-2', status: 'PENDING', score: null }),
        createMockGuess({ id: 'guess-3', status: 'RESOLVED', score: -1 }),
        createMockGuess({ id: 'guess-4', status: 'RESOLVED', score: 0 }),
        createMockGuess({ id: 'guess-5', status: 'RESOLVED', score: 2 }),
      ];
      useGuessStore.getState().setGuesses(guesses);

      const score = useGuessStore.getState().calculateScore();
      expect(score).toBe(2);
    });

    it('should ignore null scores in resolved guesses', () => {
      const guesses = [
        createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: 1 }),
        createMockGuess({ id: 'guess-2', status: 'RESOLVED', score: null }),
        createMockGuess({ id: 'guess-3', status: 'RESOLVED', score: -1 }),
      ];
      useGuessStore.getState().setGuesses(guesses);

      const score = useGuessStore.getState().calculateScore();
      expect(score).toBe(0);
    });

    it('should handle negative scores', () => {
      const guesses = [
        createMockGuess({ id: 'guess-1', status: 'RESOLVED', score: -5 }),
        createMockGuess({ id: 'guess-2', status: 'RESOLVED', score: -3 }),
      ];
      useGuessStore.getState().setGuesses(guesses);

      const score = useGuessStore.getState().calculateScore();
      expect(score).toBe(-8);
    });
  });
});

