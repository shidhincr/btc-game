import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  let originalDate: typeof Date;

  beforeEach(() => {
    originalDate = global.Date;
  });

  afterEach(() => {
    global.Date = originalDate;
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render footer element', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should render copyright text', () => {
      render(<Footer />);
      expect(screen.getByText(/Bitcoin Prediction Game/i)).toBeInTheDocument();
    });

    it('should display current year in copyright', () => {
      const currentYear = new Date().getFullYear();
      render(<Footer />);
      const copyrightText = screen.getByText(new RegExp(currentYear.toString()));
      expect(copyrightText).toBeInTheDocument();
    });
  });

  describe('year calculation', () => {
    it('should display correct year for 2024', () => {
      global.Date = class extends originalDate {
        constructor() {
          super();
        }
        getFullYear() {
          return 2024;
        }
      } as typeof Date;
      render(<Footer />);
      expect(screen.getByText(/2024/)).toBeInTheDocument();
    });

    it('should display correct year for 2025', () => {
      global.Date = class extends originalDate {
        constructor() {
          super();
        }
        getFullYear() {
          return 2025;
        }
      } as typeof Date;
      render(<Footer />);
      expect(screen.getByText(/2025/)).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(<Footer className="custom-footer-class" />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('custom-footer-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(<Footer className="custom-class" />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('custom-class');
    });
  });

  describe('structure', () => {
    it('should have correct semantic structure', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should contain paragraph with copyright text', () => {
      render(<Footer />);
      const paragraph = screen.getByText(/Bitcoin Prediction Game/i);
      expect(paragraph.tagName).toBe('P');
    });
  });
});

