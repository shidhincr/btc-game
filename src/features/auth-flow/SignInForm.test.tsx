import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInForm } from './SignInForm';
import { useSessionStore } from '@/entities/session/store';
import { signIn } from 'aws-amplify/auth';
import type { SignInOutput } from 'aws-amplify/auth';

vi.mock('@/entities/session/store', () => ({
  useSessionStore: vi.fn(),
}));

vi.mock('aws-amplify/auth', () => ({
  signIn: vi.fn(),
}));

describe('SignInForm', () => {
  const mockCheckAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSessionStore).mockReturnValue({
      checkAuth: mockCheckAuth,
    } as ReturnType<typeof useSessionStore>);
  });

  describe('rendering', () => {
    it('should render sign in form', () => {
      render(<SignInForm />);
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should render email input with correct attributes', () => {
      render(<SignInForm />);
      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
    });

    it('should render password input with correct attributes', () => {
      render(<SignInForm />);
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
    });
  });

  describe('form interactions', () => {
    it('should update email input value', async () => {
      render(<SignInForm />);
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

      await userEvent.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password input value', async () => {
      render(<SignInForm />);
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

      await userEvent.type(passwordInput, 'password123');

      expect(passwordInput.value).toBe('password123');
    });

    it('should disable inputs when loading', async () => {
      vi.mocked(signIn).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(<SignInForm />);
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
      });
    });
  });

  describe('form submission', () => {
    it('should call signIn with correct credentials on submit', async () => {
      vi.mocked(signIn).mockResolvedValue({} as SignInOutput);
      render(<SignInForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith({
          username: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should call checkAuth after successful sign in', async () => {
      vi.mocked(signIn).mockResolvedValue({} as SignInOutput);
      render(<SignInForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(mockCheckAuth).toHaveBeenCalled();
      });
    });

    it('should show loading state during submission', async () => {
      vi.mocked(signIn).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(<SignInForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument();
    });

    it('should display error message on sign in failure', async () => {
      const errorMessage = 'Invalid credentials';
      vi.mocked(signIn).mockRejectedValue(new Error(errorMessage));
      render(<SignInForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display generic error message for non-Error failures', async () => {
      vi.mocked(signIn).mockRejectedValue('Unknown error');
      render(<SignInForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'password123');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('An error occurred during sign in')).toBeInTheDocument();
      });
    });

    it('should clear error on new submission attempt', async () => {
      vi.mocked(signIn)
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({} as SignInOutput);
      render(<SignInForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('First error')).toBeInTheDocument();
      });

      await userEvent.type(screen.getByLabelText('Password'), 'correctpassword');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument();
      });
    });
  });

  describe('validation', () => {
    it('should prevent submission with empty email', async () => {
      render(<SignInForm />);
      const form = screen.getByRole('button', { name: 'Sign In' }).closest('form');

      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(signIn).not.toHaveBeenCalled();
      expect(form?.checkValidity()).toBe(false);
    });

    it('should prevent submission with empty password', async () => {
      render(<SignInForm />);
      const form = screen.getByRole('button', { name: 'Sign In' }).closest('form');

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(signIn).not.toHaveBeenCalled();
      expect(form?.checkValidity()).toBe(false);
    });
  });
});

