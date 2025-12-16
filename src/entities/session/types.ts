/**
 * Session entity types
 * Defines types for authentication state
 */

export interface User {
  userId: string;
  email?: string;
}

export interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

