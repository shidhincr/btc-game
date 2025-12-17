import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUp } from './SignUp';

vi.mock('@/features/auth-flow/SignUpForm', () => ({
  SignUpForm: () => <div data-testid="sign-up-form">SignUpForm</div>,
}));

describe('SignUp', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
  };

  describe('rendering', () => {
    it('should render SignUpForm component', () => {
      renderWithRouter();
      expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
    });
  });
});

