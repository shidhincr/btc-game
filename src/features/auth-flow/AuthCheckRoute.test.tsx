import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthCheckRoute } from './AuthCheckRoute';
import { useSessionStore } from '@/entities/session/store';

vi.mock('@/entities/session/store', () => ({
  useSessionStore: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">Navigate to {to}</div>,
  };
});

describe('AuthCheckRoute', () => {
  const mockCheckAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = ({
    isAuthenticated,
    isLoading,
    pathname = '/',
  }: {
    isAuthenticated: boolean;
    isLoading: boolean;
    pathname?: string;
  }) => {
    vi.mocked(useSessionStore).mockReturnValue({
      isAuthenticated,
      isLoading,
      checkAuth: mockCheckAuth,
    } as ReturnType<typeof useSessionStore>);

    return render(
      <MemoryRouter initialEntries={[pathname]}>
        <AuthCheckRoute>
          <div>Route Content</div>
        </AuthCheckRoute>
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
      const { container } = renderWithRouter({ isAuthenticated: false, isLoading: true });
      const loader = container.querySelector('.lucide-loader-circle');
      expect(loader).toBeInTheDocument();
      expect(screen.queryByText('Route Content')).not.toBeInTheDocument();
    });

    it('should not show protected content when loading', () => {
      const { container } = renderWithRouter({ isAuthenticated: true, isLoading: true });
      const loader = container.querySelector('.lucide-loader-circle');
      expect(loader).toBeInTheDocument();
      expect(screen.queryByText('Route Content')).not.toBeInTheDocument();
    });
  });

  describe('on protected routes (not /sign-in)', () => {
    it('should redirect to /sign-in when not authenticated', () => {
      renderWithRouter({ isAuthenticated: false, isLoading: false, pathname: '/' });
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByText('Navigate to /sign-in')).toBeInTheDocument();
      expect(screen.queryByText('Route Content')).not.toBeInTheDocument();
    });

    it('should render children when authenticated', () => {
      renderWithRouter({ isAuthenticated: true, isLoading: false, pathname: '/' });
      expect(screen.getByText('Route Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('should redirect to /sign-in for any non-sign-in route when not authenticated', () => {
      renderWithRouter({ isAuthenticated: false, isLoading: false, pathname: '/dashboard' });
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByText('Navigate to /sign-in')).toBeInTheDocument();
    });
  });

  describe('on sign-in page', () => {
    it('should redirect to / when authenticated', () => {
      renderWithRouter({ isAuthenticated: true, isLoading: false, pathname: '/sign-in' });
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByText('Navigate to /')).toBeInTheDocument();
      expect(screen.queryByText('Route Content')).not.toBeInTheDocument();
    });

    it('should render children when not authenticated', () => {
      renderWithRouter({ isAuthenticated: false, isLoading: false, pathname: '/sign-in' });
      expect(screen.getByText('Route Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('state transitions', () => {
    it('should show loading first, then redirect when unauthenticated', () => {
      const { rerender, container } = renderWithRouter({ isAuthenticated: false, isLoading: true });
      expect(container.querySelector('.lucide-loader-circle')).toBeInTheDocument();

      vi.mocked(useSessionStore).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        checkAuth: mockCheckAuth,
      } as ReturnType<typeof useSessionStore>);

      rerender(
        <MemoryRouter>
          <AuthCheckRoute>
            <div>Route Content</div>
          </AuthCheckRoute>
        </MemoryRouter>
      );

      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });

    it('should show loading first, then render content when authenticated', () => {
      const { rerender, container } = renderWithRouter({ isAuthenticated: false, isLoading: true });
      expect(container.querySelector('.lucide-loader-circle')).toBeInTheDocument();

      vi.mocked(useSessionStore).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        checkAuth: mockCheckAuth,
      } as ReturnType<typeof useSessionStore>);

      rerender(
        <MemoryRouter>
          <AuthCheckRoute>
            <div>Route Content</div>
          </AuthCheckRoute>
        </MemoryRouter>
      );

      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument();
      expect(screen.getByText('Route Content')).toBeInTheDocument();
    });
  });
});

