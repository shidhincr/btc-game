import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SignUpForm } from './SignUpForm';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import type { SignUpOutput, ConfirmSignUpOutput } from 'aws-amplify/auth';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('aws-amplify/auth', () => ({
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  describe('rendering', () => {
    it('should render sign up form', () => {
      renderWithRouter(<SignUpForm />);
      expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('should show confirmation code input when needsConfirmation is true', async () => {
      vi.mocked(signUp).mockResolvedValue({} as SignUpOutput);
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.getByLabelText('Confirmation Code')).toBeInTheDocument();
        expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
      });
    });
  });

  describe('password validation', () => {
    it('should show password errors on blur', async () => {
      renderWithRouter(<SignUpForm />);
      const passwordInput = screen.getByLabelText('Password');

      await userEvent.type(passwordInput, 'weak');
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText(/At least 8 characters/)).toBeInTheDocument();
        expect(screen.getByText(/At least 1 digit/)).toBeInTheDocument();
        expect(screen.getByText(/At least 1 uppercase letter/)).toBeInTheDocument();
        expect(screen.getByText(/At least 1 symbol/)).toBeInTheDocument();
      });
    });

    it('should show success message when password meets all requirements', async () => {
      renderWithRouter(<SignUpForm />);
      const passwordInput = screen.getByLabelText('Password');

      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText('Password meets all requirements')).toBeInTheDocument();
      });
    });

    it('should show required message when password is empty after blur', async () => {
      renderWithRouter(<SignUpForm />);
      const passwordInput = screen.getByLabelText('Password');

      await userEvent.click(passwordInput);
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('should validate password on submit', async () => {
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'weak');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'weak');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.getByText(/Password must contain:/)).toBeInTheDocument();
        expect(signUp).not.toHaveBeenCalled();
      });
    });
  });

  describe('confirm password validation', () => {
    it('should show error when passwords do not match after blur', async () => {
      renderWithRouter(<SignUpForm />);
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');

      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.type(confirmPasswordInput, 'Different123!');
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should show success when passwords match after blur', async () => {
      renderWithRouter(<SignUpForm />);
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');

      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.type(confirmPasswordInput, 'Password123!');
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText('Passwords match')).toBeInTheDocument();
      });
    });

    it('should prevent submission when passwords do not match', async () => {
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Different123!');

      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getAllByText('Passwords do not match').length).toBeGreaterThan(0);
      });

      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(signUp).not.toHaveBeenCalled();
      });
    });
  });

  describe('form submission - initial sign up', () => {
    it('should call signUp with correct data on submit', async () => {
      vi.mocked(signUp).mockResolvedValue({} as SignUpOutput);
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(signUp).toHaveBeenCalledWith({
          username: 'test@example.com',
          password: 'Password123!',
          options: {
            userAttributes: {
              email: 'test@example.com',
            },
          },
        });
      });
    });

    it('should show confirmation code input after successful sign up', async () => {
      vi.mocked(signUp).mockResolvedValue({} as SignUpOutput);
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.getByLabelText('Confirmation Code')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm Sign Up' })).toBeInTheDocument();
      });
    });

    it('should disable email input when confirmation is needed', async () => {
      vi.mocked(signUp).mockResolvedValue({} as SignUpOutput);
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        const emailInput = screen.getByLabelText('Email');
        expect(emailInput).toBeDisabled();
      });
    });
  });

  describe('form submission - confirmation', () => {
    beforeEach(async () => {
      vi.mocked(signUp).mockResolvedValue({} as SignUpOutput);
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.getByLabelText('Confirmation Code')).toBeInTheDocument();
      });
    });

    it('should call confirmSignUp with correct code', async () => {
      vi.mocked(confirmSignUp).mockResolvedValue({} as ConfirmSignUpOutput);

      await userEvent.type(screen.getByLabelText('Confirmation Code'), '123456');
      await userEvent.click(screen.getByRole('button', { name: 'Confirm Sign Up' }));

      await waitFor(() => {
        expect(confirmSignUp).toHaveBeenCalledWith({
          username: 'test@example.com',
          confirmationCode: '123456',
        });
      });
    });

    it('should show success message after confirmation', async () => {
      vi.mocked(confirmSignUp).mockResolvedValue({} as ConfirmSignUpOutput);

      await userEvent.type(screen.getByLabelText('Confirmation Code'), '123456');
      await userEvent.click(screen.getByRole('button', { name: 'Confirm Sign Up' }));

      await waitFor(() => {
        expect(screen.getByText('Email Confirmed!')).toBeInTheDocument();
        expect(screen.getByText('Redirecting you to sign in...')).toBeInTheDocument();
      });
    });

    it('should redirect to sign-in after successful confirmation', async () => {
      vi.mocked(confirmSignUp).mockResolvedValue({} as ConfirmSignUpOutput);

      await userEvent.type(screen.getByLabelText('Confirmation Code'), '123456');
      await userEvent.click(screen.getByRole('button', { name: 'Confirm Sign Up' }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
      }, { timeout: 3000 });
    });

    it('should display error on confirmation failure', async () => {
      const errorMessage = 'Invalid confirmation code';
      vi.mocked(confirmSignUp).mockRejectedValue(new Error(errorMessage));

      await userEvent.type(screen.getByLabelText('Confirmation Code'), 'wrong');
      await userEvent.click(screen.getByRole('button', { name: 'Confirm Sign Up' }));

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should display error message on sign up failure', async () => {
      const errorMessage = 'Email already exists';
      vi.mocked(signUp).mockRejectedValue(new Error(errorMessage));
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should clear password errors on submit', async () => {
      vi.mocked(signUp).mockResolvedValue({} as SignUpOutput);
      renderWithRouter(<SignUpForm />);
      const passwordInput = screen.getByLabelText('Password');

      await userEvent.type(passwordInput, 'weak');
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText(/At least 8 characters/)).toBeInTheDocument();
      });

      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.queryByText(/At least 8 characters/)).not.toBeInTheDocument();
      });
    });
  });

  describe('loading states', () => {
    it('should show loading state during sign up', async () => {
      vi.mocked(signUp).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      expect(screen.getByRole('button', { name: 'Processing...' })).toBeInTheDocument();
    });

    it('should show loading state during confirmation', async () => {
      vi.mocked(signUp).mockResolvedValue({} as SignUpOutput);
      vi.mocked(confirmSignUp).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderWithRouter(<SignUpForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
      await userEvent.type(screen.getByLabelText('Confirm Password'), 'Password123!');
      await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

      await waitFor(() => {
        expect(screen.getByLabelText('Confirmation Code')).toBeInTheDocument();
      });

      await userEvent.type(screen.getByLabelText('Confirmation Code'), '123456');
      await userEvent.click(screen.getByRole('button', { name: 'Confirm Sign Up' }));

      expect(screen.getByRole('button', { name: 'Processing...' })).toBeInTheDocument();
    });
  });
});

