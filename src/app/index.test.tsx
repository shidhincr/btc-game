import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './index';

describe('App', () => {
  it('should render the app', () => {
    render(<App />);
    expect(screen.getByText('Vite + React')).toBeInTheDocument();
  });
});

