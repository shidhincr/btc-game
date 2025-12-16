import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  describe('rendering', () => {
    it('should render home page content', () => {
      render(<HomePage />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });


  });

  describe('structure', () => {
    it('should have a single root container', () => {
      const { container } = render(<HomePage />);
      expect(container.children).toHaveLength(1);
    });

    it('should contain nested div structure', () => {
      const { container } = render(<HomePage />);
      const rootDiv = container.firstChild as HTMLElement;
      expect(rootDiv.children.length).toBeGreaterThan(0);
    });
  });
});

