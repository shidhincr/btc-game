import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

/**
 * Amplify Gen 2 Backend Entry Point
 *
 * This file defines the backend resources for the Bitcoin Prediction Game.
 * Resources (auth, data) will be imported and configured here.
 */
export const backend = defineBackend({
  data,
});

