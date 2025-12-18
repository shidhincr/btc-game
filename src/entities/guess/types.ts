import type { Schema } from '@amplify/data/resource';

/**
 * Guess entity types
 * Defines types for guess data based on the Amplify schema
 */

export type Guess = Schema['Guess']['type'];
export type GuessDirection = 'UP' | 'DOWN';
export type GuessStatus = 'PENDING' | 'RESOLVED';

export interface GuessResult {
  result: 'WIN' | 'LOSS' | 'TIE';
  score: number;
}

export interface GuessState {
  guesses: Guess[];
  currentGuess: Guess | null;
  isLoading: boolean;
  error: string | null;
}

