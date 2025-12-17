import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

vi.mock('@/features/auth-flow/SignOutButton', () => ({
  SignOutButton: () => <button>Sign Out</button>,
}));

describe('Header', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  };

  describe('rendering', () => {
    it('should render header element', () => {
      const { container } = renderWithRouter();
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render Bitcoin icon', () => {
      const { container } = renderWithRouter();
      const icon = container.querySelector('.lucide-bitcoin');
      expect(icon).toBeInTheDocument();
    });

    it('should render title with BtcGuesser text', () => {
      const { container } = renderWithRouter();
      const title = container.querySelector('h1');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toContain('Btc');
      expect(title?.textContent).toContain('Guesser');
    });

    it('should render SignOutButton component', () => {
      renderWithRouter();
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <MemoryRouter>
          <Header className="custom-header-class" />
        </MemoryRouter>
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-header-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <MemoryRouter>
          <Header className="custom-class" />
        </MemoryRouter>
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('structure', () => {
    it('should have correct semantic structure', () => {
      renderWithRouter();
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should contain logo section with icon and title', () => {
      const { container } = renderWithRouter();
      const title = container.querySelector('h1');
      expect(title).toBeInTheDocument();
      expect(title?.tagName).toBe('H1');
      expect(title?.textContent).toContain('Btc');
      expect(title?.textContent).toContain('Guesser');
    });
  });
});

