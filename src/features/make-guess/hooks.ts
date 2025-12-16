import { useCallback } from 'react';
import { client } from '@/shared/api/amplify';
import { useGuessStore } from '@/entities/guess/store';
import type { GuessDirection } from '@/entities/guess/types';

export function useMakeGuess() {
  const { setCurrentGuess, setLoading, setError, addGuess, isLoading, error } = useGuessStore();

  const createGuess = useCallback(
    async (direction: GuessDirection, startPrice: number) => {
      setLoading(true);
      setError(null);

      try {
        const now = new Date().toISOString();
        const result = await client.models.Guess.create({
          startPrice,
          direction,
          status: 'PENDING',
          createdAt: now,
        });

        if (result.data) {
          const guess = result.data;
          setCurrentGuess(guess);
          addGuess(guess);
          setLoading(false);
          return guess;
        } else {
          throw new Error('Failed to create guess: No data returned');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to create guess. Please try again.';
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    [setCurrentGuess, setLoading, setError, addGuess]
  );

  return {
    createGuess,
    isLoading,
    error,
  };
}

