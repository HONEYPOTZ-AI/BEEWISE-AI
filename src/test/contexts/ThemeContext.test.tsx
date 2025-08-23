
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '../utils/test-utils';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import React from 'react';

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>);

};

describe('ThemeContext', () => {
  it('provides default theme', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('allows changing theme', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Set Dark');
    fireEvent.click(darkButton);

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('persists theme to localStorage', () => {
    const mockSetItem = vi.fn();
    const mockGetItem = vi.fn(() => 'dark');

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: vi.fn()
      },
      writable: true
    });

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );

    const lightButton = screen.getByText('Set Light');
    fireEvent.click(lightButton);

    expect(mockSetItem).toHaveBeenCalledWith('test-theme', 'light');
  });

  it('loads theme from localStorage', () => {
    const mockGetItem = vi.fn(() => 'dark');

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      writable: true
    });

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockGetItem).toHaveBeenCalledWith('test-theme');
  });

  it('handles system theme', () => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    });

    render(
      <ThemeProvider defaultTheme="system" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  it('applies theme class to document root', () => {
    render(
      <ThemeProvider defaultTheme="dark" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('throws error when used outside provider', () => {
    const ThemeConsumer = () => {
      useTheme();
      return null;
    };

    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<ThemeConsumer />)).toThrow();

    consoleSpy.mockRestore();
  });
});