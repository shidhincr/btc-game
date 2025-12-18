import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { GuessCard } from './GuessCard';
import type { Guess } from '../types';

const createMockGuess = (overrides?: Partial<Guess>): Guess => ({
  id: 'guess-1',
  startPrice: 50000,
  direction: 'UP',
  status: 'PENDING',
  resolvedPrice: null,
  score: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

const getDesktopLayout = (container: HTMLElement) => {
  return container.querySelector('.md\\:grid') as HTMLElement;
};

describe('GuessCard', () => {
  describe('pending guess', () => {
    it('should display pending status with clock icon', () => {
      const guess = createMockGuess({ status: 'PENDING' });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('Pending')).toBeInTheDocument();
      const clockIcon = container.querySelector('.lucide-clock');
      expect(clockIcon).toBeInTheDocument();
    });

    it('should render both mobile and desktop layouts', () => {
      const guess = createMockGuess({ status: 'PENDING' });
      const { container } = render(<GuessCard guess={guess} />);

      const mobileLayout = container.querySelector('.md\\:hidden');
      const desktopLayout = container.querySelector('.hidden.md\\:grid');
      expect(mobileLayout).toBeInTheDocument();
      expect(desktopLayout).toBeInTheDocument();
    });
  });

  describe('resolved guess - win', () => {
    it('should display win status with check icon', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: 1,
        resolvedPrice: 51000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('Won')).toBeInTheDocument();
      const checkIcon = container.querySelector('.lucide-circle-check-big');
      expect(checkIcon).toBeInTheDocument();
    });

    it('should render desktop layout for win', () => {
      const guess = createMockGuess({ status: 'RESOLVED', score: 1 });
      const { container } = render(<GuessCard guess={guess} />);

      const desktopLayout = container.querySelector('.hidden.md\\:grid');
      expect(desktopLayout).toBeInTheDocument();
    });

    it('should display positive score with plus sign', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: 5,
        resolvedPrice: 51000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('+5')).toBeInTheDocument();
    });
  });

  describe('resolved guess - loss', () => {
    it('should display loss status with X icon', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: -1,
        resolvedPrice: 49000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('Lost')).toBeInTheDocument();
      const xIcon = container.querySelector('.lucide-circle-x');
      expect(xIcon).toBeInTheDocument();
    });

    it('should render desktop layout for loss', () => {
      const guess = createMockGuess({ status: 'RESOLVED', score: -1 });
      const { container } = render(<GuessCard guess={guess} />);

      const desktopLayout = container.querySelector('.hidden.md\\:grid');
      expect(desktopLayout).toBeInTheDocument();
    });

    it('should display negative score without plus sign', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: -3,
        resolvedPrice: 49000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('-3')).toBeInTheDocument();
    });
  });

  describe('resolved guess - tie', () => {
    it('should display tie status', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: 0,
        resolvedPrice: 50000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('Tie')).toBeInTheDocument();
    });

    it('should render desktop layout for tie', () => {
      const guess = createMockGuess({ status: 'RESOLVED', score: 0 });
      const { container } = render(<GuessCard guess={guess} />);

      const desktopLayout = container.querySelector('.hidden.md\\:grid');
      expect(desktopLayout).toBeInTheDocument();
    });

    it('should display zero score', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: 0,
        resolvedPrice: 50000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('0')).toBeInTheDocument();
    });
  });

  describe('direction display', () => {
    it('should display UP direction with ArrowUp icon', () => {
      const guess = createMockGuess({ direction: 'UP' });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('UP')).toBeInTheDocument();
      const arrowUpIcon = container.querySelector('.lucide-arrow-up');
      expect(arrowUpIcon).toBeInTheDocument();
    });

    it('should display DOWN direction with ArrowDown icon', () => {
      const guess = createMockGuess({ direction: 'DOWN' });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('DOWN')).toBeInTheDocument();
      const arrowDownIcon = container.querySelector('.lucide-arrow-down');
      expect(arrowDownIcon).toBeInTheDocument();
    });
  });

  describe('price display', () => {
    it('should always display start price', () => {
      const guess = createMockGuess({ startPrice: 50000 });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('$50,000.00')).toBeInTheDocument();
    });

    it('should display resolved price when resolved', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        resolvedPrice: 51000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('$51,000.00')).toBeInTheDocument();
    });

    it('should show skeleton placeholder for resolved price when pending', () => {
      const guess = createMockGuess({ status: 'PENDING' });
      const { container } = render(<GuessCard guess={guess} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(1);
    });

    it('should not display resolved price when null', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        resolvedPrice: null,
      });
      render(<GuessCard guess={guess} />);

      expect(screen.getAllByText('—')).toHaveLength(2);
    });
  });

  describe('score display', () => {
    it('should display score when resolved with score', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: 1,
        resolvedPrice: 51000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('+1')).toBeInTheDocument();
    });

    it('should show skeleton placeholder for score when pending', () => {
      const guess = createMockGuess({ status: 'PENDING' });
      const { container } = render(<GuessCard guess={guess} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(2);
    });

    it('should display zero when score is null', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: null,
        resolvedPrice: 51000,
      });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      expect(within(desktop).getByText('0')).toBeInTheDocument();
    });
  });

  describe('timestamp display', () => {
    it('should display timestamp when createdAt exists', () => {
      const guess = createMockGuess({ createdAt: '2024-01-01T12:00:00Z' });
      const { container } = render(<GuessCard guess={guess} />);
      const desktop = getDesktopLayout(container);

      const timestamp = within(desktop).getByText(/\d{2}:\d{2}:\d{2}/);
      expect(timestamp).toBeInTheDocument();
    });

    it('should display dash when createdAt is null', () => {
      const guess = createMockGuess({ createdAt: null });
      render(<GuessCard guess={guess} />);

      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  describe('custom className', () => {
    it('should apply custom className to both layouts', () => {
      const guess = createMockGuess();
      const { container } = render(<GuessCard guess={guess} className="custom-class" />);

      const mobileLayout = container.querySelector('.md\\:hidden');
      const desktopLayout = container.querySelector('.hidden.md\\:grid');
      expect(mobileLayout).toHaveClass('custom-class');
      expect(desktopLayout).toHaveClass('custom-class');
    });
  });
});

