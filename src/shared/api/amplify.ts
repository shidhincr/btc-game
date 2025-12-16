import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

/**
 * Amplify Data client instance
 * Provides type-safe access to the data models (Guess, etc.)
 * Uses the Schema type from the Amplify data resource
 */
export const client = generateClient<Schema>({
  authMode: 'userPool',
});

