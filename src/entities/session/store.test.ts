import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSessionStore } from './store';
import { getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';

type MockCurrentUser = {
  userId: string;
  signInDetails?: {
    loginId?: string;
  };
};

vi.mock('aws-amplify/auth', () => ({
  getCurrentUser: vi.fn(),
  signOut: vi.fn(),
}));

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useSessionStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(true);
    });
  });

  describe('setUser', () => {
    it('should set user and mark as authenticated', () => {
      const user = { userId: 'user-1', email: 'test@example.com' };
      useSessionStore.getState().setUser(user);

      const state = useSessionStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear authentication when user is null', () => {
      useSessionStore.setState({
        user: { userId: 'user-1' },
        isAuthenticated: true,
      });

      useSessionStore.getState().setUser(null);

      const state = useSessionStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      useSessionStore.getState().setLoading(true);
      expect(useSessionStore.getState().isLoading).toBe(true);

      useSessionStore.getState().setLoading(false);
      expect(useSessionStore.getState().isLoading).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('should set user when authenticated', async () => {
      const mockUser: MockCurrentUser = {
        userId: 'user-1',
        signInDetails: { loginId: 'test@example.com' },
      };
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>);

      await useSessionStore.getState().checkAuth();

      const state = useSessionStore.getState();
      expect(state.user).toEqual({
        userId: 'user-1',
        email: 'test@example.com',
      });
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should handle user without email', async () => {
      const mockUser: MockCurrentUser = {
        userId: 'user-1',
        signInDetails: {},
      };
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>);

      await useSessionStore.getState().checkAuth();

      const state = useSessionStore.getState();
      expect(state.user).toEqual({
        userId: 'user-1',
        email: undefined,
      });
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear user when not authenticated', async () => {
      useSessionStore.setState({
        user: { userId: 'user-1' },
        isAuthenticated: true,
      });

      vi.mocked(getCurrentUser).mockRejectedValue(new Error('Not authenticated'));

      await useSessionStore.getState().checkAuth();

      const state = useSessionStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should handle any error during checkAuth', async () => {
      useSessionStore.setState({
        user: { userId: 'user-1' },
        isAuthenticated: true,
      });

      vi.mocked(getCurrentUser).mockRejectedValue('String error');

      await useSessionStore.getState().checkAuth();

      const state = useSessionStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      useSessionStore.setState({
        user: { userId: 'user-1' },
        isAuthenticated: true,
      });

      vi.mocked(amplifySignOut).mockResolvedValue(undefined);

      await useSessionStore.getState().signOut();

      const state = useSessionStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should clear state even if signOut fails', async () => {
      useSessionStore.setState({
        user: { userId: 'user-1' },
        isAuthenticated: true,
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(amplifySignOut).mockRejectedValue(new Error('Sign out failed'));

      await useSessionStore.getState().signOut();

      const state = useSessionStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should handle non-Error rejections', async () => {
      useSessionStore.setState({
        user: { userId: 'user-1' },
        isAuthenticated: true,
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(amplifySignOut).mockRejectedValue('String error');

      await useSessionStore.getState().signOut();

      const state = useSessionStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

