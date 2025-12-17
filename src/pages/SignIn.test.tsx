import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignIn } from './SignIn';
import { AuthCheckRoute } from '@/features/auth-flow/AuthCheckRoute';
import { useSessionStore } from '@/entities/session/store';

vi.mock('@/entities/session/store', () => ({
  useSessionStore: vi.fn(),
}));

vi.mock('@/features/auth-flow/SignInForm', () => ({
  SignInForm: () => <div data-testid="sign-in-form">SignInForm</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">Navigate to {to}</div>,
  };
});

describe('SignIn', () => {
  const mockCheckAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSessionStore).mockReturnValue({
      isAuthenticated: false,
      checkAuth: mockCheckAuth,
    } as ReturnType<typeof useSessionStore>);
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={['/sign-in']}>
        <AuthCheckRoute>
          <SignIn />
        </AuthCheckRoute>
      </MemoryRouter>
    );
  };

  describe('rendering', () => {
    it('should render SignInForm component', () => {
      renderWithRouter();
      expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    });
  });

  describe('authentication check', () => {
    it('should call checkAuth on mount', () => {
      renderWithRouter();
      expect(mockCheckAuth).toHaveBeenCalledTimes(1);
    });
  });

  describe('redirect behavior', () => {
    it('should not redirect when not authenticated', () => {
      vi.mocked(useSessionStore).mockReturnValue({
        isAuthenticated: false,
        checkAuth: mockCheckAuth,
      } as ReturnType<typeof useSessionStore>);

      renderWithRouter();
      expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('should redirect to home when authenticated', async () => {
      vi.mocked(useSessionStore).mockReturnValue({
        isAuthenticated: true,
        checkAuth: mockCheckAuth,
      } as ReturnType<typeof useSessionStore>);

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toBeInTheDocument();
        expect(screen.getByText('Navigate to /')).toBeInTheDocument();
      });
    });
  });
});

