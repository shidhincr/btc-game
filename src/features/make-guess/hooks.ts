import { useCallback } from 'react';
import { formatISO } from 'date-fns';
import { client } from '@/shared/api/amplify';
import { getBitcoinPrice } from '@/shared/api/coinbase';
import { useGuessStore } from '@/entities/guess/store';
import type { Guess, GuessDirection, GuessResult } from '@/entities/guess/types';

function calculateGuessResult(
  direction: 'UP' | 'DOWN',
  startPrice: number,
  resolvedPrice: number
): GuessResult {
  const priceChange = resolvedPrice - startPrice;

  if (Math.abs(priceChange) < 0.01) {
    return { result: 'TIE', score: 0 };
  }

  const isUpCorrect = direction === 'UP' && priceChange > 0;
  const isDownCorrect = direction === 'DOWN' && priceChange < 0;

  if (isUpCorrect || isDownCorrect) {
    return { result: 'WIN', score: 1 };
  } else {
    return { result: 'LOSS', score: -1 };
  }
}

export function useMakeGuess() {
  const { setCurrentGuess, setLoading, setError, clearGuess, fetchGuesses, isLoading, error } = useGuessStore();

  const createGuess = useCallback(
    async (direction: GuessDirection, startPrice: number) => {
      setError(null);

      try {
        const now = formatISO(new Date());
        const result = await client.models.Guess.create({
          startPrice,
          direction,
          status: 'PENDING',
          createdAt: now,
        });

        if (result.data) {
          const guess = result.data;
          setCurrentGuess(guess);
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
    [setCurrentGuess, setLoading, setError]
  );

  const resolveGuess = useCallback(
    async (guess: Guess) => {
      if (guess.status === 'RESOLVED') {
        return guess;
      }

      if (!guess.direction || (guess.direction !== 'UP' && guess.direction !== 'DOWN')) {
        throw new Error('Invalid guess direction');
      }

      setError(null);

      try {
        const resolvedPrice = await getBitcoinPrice();

        const result = calculateGuessResult(
          guess.direction,
          guess.startPrice,
          resolvedPrice
        );

        const updateResult = await client.models.Guess.update({
          id: guess.id,
          status: 'RESOLVED',
          resolvedPrice,
          score: result.score,
        });

        if (updateResult.data) {
          const updatedGuess = updateResult.data;
          setCurrentGuess(updatedGuess);

          await fetchGuesses();

          setTimeout(() => {
            clearGuess();
          }, 5000);

          return updatedGuess;
        } else {
          throw new Error('Failed to update guess: No data returned');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to resolve guess. Please try again.';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setCurrentGuess, clearGuess, fetchGuesses]
  );

  return {
    createGuess,
    resolveGuess,
    isLoading,
    error,
  };
}

