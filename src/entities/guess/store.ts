import { create } from 'zustand';
import { client } from '@/shared/api/amplify';
import type { Guess, GuessState } from './types';

interface GuessStore extends GuessState {
  setCurrentGuess: (guess: Guess | null) => void;
  setGuesses: (guesses: Guess[]) => void;
  updateGuess: (guessId: string, updates: Partial<Guess>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearGuess: () => void;
  fetchGuesses: () => Promise<Guess[]>;
}

export const useGuessStore = create<GuessStore>((set, get) => ({
  currentGuess: null,
  guesses: [],
  isLoading: false,
  error: null,

  setCurrentGuess: (guess) =>
    set({
      currentGuess: guess,
      error: null,
    }),

  setGuesses: (guesses) =>
    set({
      guesses,
      error: null,
    }),

  updateGuess: (guessId, updates) =>
    set((state) => ({
      guesses: state.guesses.map((guess) =>
        guess.id === guessId ? { ...guess, ...updates } : guess
      ),
      currentGuess:
        state.currentGuess?.id === guessId
          ? { ...state.currentGuess, ...updates }
          : state.currentGuess,
      error: null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearGuess: () => set({
      currentGuess: null,
      error: null,
      isLoading: false,
    }),


  fetchGuesses: async () => {
    const { setGuesses, setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      const result = await client.models.Guess.list();

      if (result.data) {
        const sortedGuesses = [...result.data].sort(
          (a, b) =>
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime()
        );
        setGuesses(sortedGuesses);
        setLoading(false);
        return sortedGuesses;
      } else {
        throw new Error('Failed to fetch guesses: No data returned');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch guesses. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },
}));

