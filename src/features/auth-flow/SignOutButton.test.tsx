import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SignOutButton } from './SignOutButton';
import { useSessionStore } from '@/entities/session/store';

vi.mock('@/entities/session/store', () => ({
  useSessionStore: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignOutButton', () => {
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    vi.mocked(useSessionStore).mockReturnValue({
      signOut: mockSignOut,
    } as ReturnType<typeof useSessionStore>);
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <SignOutButton />
      </MemoryRouter>
    );
  };

  describe('rendering', () => {
    it('should render sign out button', () => {
      renderWithRouter();
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
    });

    it('should display LogOut icon', () => {
      const { container } = renderWithRouter();
      const icon = container.querySelector('.lucide-log-out');
      expect(icon).toBeInTheDocument();
    });

    it('should have correct button variant and size', () => {
      const { container } = renderWithRouter();
      const button = container.querySelector('button');
      expect(button).toHaveClass('border');
    });
  });

  describe('sign out flow', () => {
    it('should call signOut when button is clicked', async () => {
      mockSignOut.mockResolvedValue(undefined);
      renderWithRouter();

      const button = screen.getByRole('button', { name: /Sign Out/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledTimes(1);
      });
    });

    it('should navigate to home after successful sign out', async () => {
      mockSignOut.mockResolvedValue(undefined);
      renderWithRouter();

      const button = screen.getByRole('button', { name: /Sign Out/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should navigate to home even if sign out fails', async () => {
      mockSignOut.mockRejectedValue(new Error('Sign out failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderWithRouter();

      const button = screen.getByRole('button', { name: /Sign Out/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('loading state', () => {
    it('should show loading text during sign out', async () => {
      mockSignOut.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderWithRouter();

      const button = screen.getByRole('button', { name: /Sign Out/i });
      await userEvent.click(button);

      expect(screen.getByText('Signing out...')).toBeInTheDocument();
    });

    it('should disable button during sign out', async () => {
      mockSignOut.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderWithRouter();

      const button = screen.getByRole('button', { name: /Sign Out/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });

    it('should restore button text after sign out completes', async () => {
      mockSignOut.mockResolvedValue(undefined);
      renderWithRouter();

      const button = screen.getByRole('button', { name: /Sign Out/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should log error to console on sign out failure', async () => {
      const error = new Error('Sign out failed');
      mockSignOut.mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderWithRouter();

      const button = screen.getByRole('button', { name: /Sign Out/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', error);
      });

      consoleSpy.mockRestore();
    });

    it('should still navigate to home on error', async () => {
      mockSignOut.mockRejectedValue(new Error('Sign out failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderWithRouter();

      const button = screen.getByRole('button', { name: /Sign Out/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      consoleSpy.mockRestore();
    });
  });
});

