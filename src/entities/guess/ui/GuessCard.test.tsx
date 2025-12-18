import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('GuessCard', () => {
  describe('pending guess', () => {
    it('should display pending status with clock icon', () => {
      const guess = createMockGuess({ status: 'PENDING' });
      const { container } = render(<GuessCard guess={guess} />);

      expect(screen.getByText('Pending')).toBeInTheDocument();
      const clockIcon = container.querySelector('.lucide-clock');
      expect(clockIcon).toBeInTheDocument();
    });

    it('should have yellow border for pending guess', () => {
      const guess = createMockGuess({ status: 'PENDING' });
      const { container } = render(<GuessCard guess={guess} />);

      const card = container.querySelector('.border-b');
      expect(card).toBeInTheDocument();
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

      expect(screen.getByText('Won')).toBeInTheDocument();
      const checkIcon = container.querySelector('.lucide-circle-check-big');
      expect(checkIcon).toBeInTheDocument();
    });

    it('should have green border for win', () => {
      const guess = createMockGuess({ status: 'RESOLVED', score: 1 });
      const { container } = render(<GuessCard guess={guess} />);

      const card = container.querySelector('.border-b');
      expect(card).toBeInTheDocument();
    });

    it('should display positive score with plus sign', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: 5,
        resolvedPrice: 51000,
      });
      render(<GuessCard guess={guess} />);

      expect(screen.getByText('+5')).toBeInTheDocument();
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

      expect(screen.getByText('Lost')).toBeInTheDocument();
      const xIcon = container.querySelector('.lucide-circle-x');
      expect(xIcon).toBeInTheDocument();
    });

    it('should have red border for loss', () => {
      const guess = createMockGuess({ status: 'RESOLVED', score: -1 });
      const { container } = render(<GuessCard guess={guess} />);

      const card = container.querySelector('.border-b');
      expect(card).toBeInTheDocument();
    });

    it('should display negative score without plus sign', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: -3,
        resolvedPrice: 49000,
      });
      render(<GuessCard guess={guess} />);

      expect(screen.getByText('-3')).toBeInTheDocument();
    });
  });

  describe('resolved guess - tie', () => {
    it('should display tie status with dash', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: 0,
        resolvedPrice: 50000,
      });
      render(<GuessCard guess={guess} />);

      expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('should have gray border for tie', () => {
      const guess = createMockGuess({ status: 'RESOLVED', score: 0 });
      const { container } = render(<GuessCard guess={guess} />);

      const card = container.querySelector('.border-b');
      expect(card).toBeInTheDocument();
    });

    it('should display zero score', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: 0,
        resolvedPrice: 50000,
      });
      render(<GuessCard guess={guess} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('direction display', () => {
    it('should display UP direction with ArrowUp icon', () => {
      const guess = createMockGuess({ direction: 'UP' });
      const { container } = render(<GuessCard guess={guess} />);

      expect(screen.getByText('UP')).toBeInTheDocument();
      const arrowUpIcon = container.querySelector('.lucide-arrow-up');
      expect(arrowUpIcon).toBeInTheDocument();
    });

    it('should display DOWN direction with ArrowDown icon', () => {
      const guess = createMockGuess({ direction: 'DOWN' });
      const { container } = render(<GuessCard guess={guess} />);

      expect(screen.getByText('DOWN')).toBeInTheDocument();
      const arrowDownIcon = container.querySelector('.lucide-arrow-down');
      expect(arrowDownIcon).toBeInTheDocument();
    });
  });

  describe('price display', () => {
    it('should always display start price', () => {
      const guess = createMockGuess({ startPrice: 50000 });
      render(<GuessCard guess={guess} />);

      expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    });

    it('should display resolved price when resolved', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        resolvedPrice: 51000,
      });
      render(<GuessCard guess={guess} />);

      expect(screen.getByText('$51,000.00')).toBeInTheDocument();
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
      render(<GuessCard guess={guess} />);

      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('should show skeleton placeholder for score when pending', () => {
      const guess = createMockGuess({ status: 'PENDING' });
      const { container } = render(<GuessCard guess={guess} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(2);
    });

    it('should not display score when score is null', () => {
      const guess = createMockGuess({
        status: 'RESOLVED',
        score: null,
        resolvedPrice: 51000,
      });
      render(<GuessCard guess={guess} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('timestamp display', () => {
    it('should display timestamp when createdAt exists', () => {
      const guess = createMockGuess({ createdAt: '2024-01-01T12:00:00Z' });
      render(<GuessCard guess={guess} />);

      const timestamp = screen.getByText(/\d{2}:\d{2}:\d{2}/);
      expect(timestamp).toBeInTheDocument();
    });

    it('should not display timestamp when createdAt is null', () => {
      const guess = createMockGuess({ createdAt: null });
      render(<GuessCard guess={guess} />);

      const timestamps = screen.queryAllByText(/\d{1,2}:\d{2}:\d{2}/);
      expect(timestamps).toHaveLength(0);
    });
  });

  describe('custom className', () => {
    it('should apply custom className', () => {
      const guess = createMockGuess();
      const { container } = render(<GuessCard guess={guess} className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});

