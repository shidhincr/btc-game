import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useSessionStore } from '@/entities/session/store';

vi.mock('@/entities/session/store', () => ({
  useSessionStore: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">Navigate to {to}</div>,
    useLocation: () => ({ pathname: '/protected' }),
  };
});

describe('ProtectedRoute', () => {
  const mockCheckAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = ({
    isAuthenticated,
    isLoading,
  }: {
    isAuthenticated: boolean;
    isLoading: boolean;
  }) => {
    vi.mocked(useSessionStore).mockReturnValue({
      isAuthenticated,
      isLoading,
      checkAuth: mockCheckAuth,
    } as ReturnType<typeof useSessionStore>);

    return render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
  };

  describe('authentication check', () => {
    it('should call checkAuth on mount', () => {
      renderWithRouter({ isAuthenticated: false, isLoading: false });
      expect(mockCheckAuth).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading state', () => {
    it('should show loading message when isLoading is true', () => {
      renderWithRouter({ isAuthenticated: false, isLoading: true });
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should not show protected content when loading', () => {
      renderWithRouter({ isAuthenticated: true, isLoading: true });
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('unauthenticated state', () => {
    it('should redirect to /sign-in when not authenticated', () => {
      renderWithRouter({ isAuthenticated: false, isLoading: false });
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByText('Navigate to /sign-in')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should not render children when not authenticated', () => {
      renderWithRouter({ isAuthenticated: false, isLoading: false });
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated state', () => {
    it('should render children when authenticated', () => {
      renderWithRouter({ isAuthenticated: true, isLoading: false });
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('should not show loading message when authenticated', () => {
      renderWithRouter({ isAuthenticated: true, isLoading: false });
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should not redirect when authenticated', () => {
      renderWithRouter({ isAuthenticated: true, isLoading: false });
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('state transitions', () => {
    it('should show loading first, then redirect when unauthenticated', () => {
      const { rerender } = renderWithRouter({ isAuthenticated: false, isLoading: true });
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      vi.mocked(useSessionStore).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        checkAuth: mockCheckAuth,
      } as ReturnType<typeof useSessionStore>);

      rerender(
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });

    it('should show loading first, then render content when authenticated', () => {
      const { rerender } = renderWithRouter({ isAuthenticated: false, isLoading: true });
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      vi.mocked(useSessionStore).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        checkAuth: mockCheckAuth,
      } as ReturnType<typeof useSessionStore>);

      rerender(
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});

