
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import ThemeToggle from '@/components/ThemeToggle';

// Mock the theme context
const mockSetTheme = vi.fn();
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme
  })
}));

describe('ThemeToggle', () => {
  it('renders without crashing', () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('displays correct icon for light theme', () => {
    render(<ThemeToggle />);
    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toBeInTheDocument();
  });

  it('calls setTheme when clicked', () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    fireEvent.click(toggleButton);
    expect(mockSetTheme).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toHaveAttribute('aria-label', 'Toggle theme');
  });
});