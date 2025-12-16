import { create } from 'zustand';
import type { Guess, GuessState } from './types';

interface GuessStore extends GuessState {
  setCurrentGuess: (guess: Guess | null) => void;
  setGuesses: (guesses: Guess[]) => void;
  addGuess: (guess: Guess) => void;
  updateGuess: (guessId: string, updates: Partial<Guess>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearGuess: () => void;
  calculateScore: () => number;
}

function calculateScoreFromGuesses(guesses: Guess[]): number {
  return guesses
    .filter((guess) => guess.status === 'RESOLVED' && guess.score !== null)
    .reduce((total, guess) => total + (guess.score ?? 0), 0);
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

  addGuess: (guess) =>
    set((state) => ({
      guesses: [...state.guesses, guess],
      error: null,
    })),

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

  clearGuess: () =>
    set({
      currentGuess: null,
      error: null,
      isLoading: false,
    }),

  calculateScore: () => {
    const { guesses } = get();
    return calculateScoreFromGuesses(guesses);
  },
}));

