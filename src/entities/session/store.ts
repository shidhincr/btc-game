import { create } from 'zustand';
import { getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import type { User, SessionState } from './types';

interface SessionStore extends SessionState {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Zustand store for authentication session state
 * Manages user authentication state and provides methods to check auth and sign out
 */
export const useSessionStore = create<SessionStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  checkAuth: async () => {
    try {
      const currentUser = await getCurrentUser();
      set({
        user: {
          userId: currentUser.userId,
          email: currentUser.signInDetails?.loginId,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  signOut: async () => {
    try {
      await amplifySignOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local state even if signOut fails
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

