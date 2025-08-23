
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn()
  }
}));

// Test component that throws an error
const ThrowError = ({ shouldThrow }: {shouldThrow: boolean;}) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('displays error UI when error occurs', () => {
    // Suppress console.error for this test
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('shows retry button on error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Try again/i)).toBeInTheDocument();
  });

  it('resets error state when retry is clicked', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    // Click retry button
    const retryButton = screen.getByText(/Try again/i);
    retryButton.click();

    // Re-render with no error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});