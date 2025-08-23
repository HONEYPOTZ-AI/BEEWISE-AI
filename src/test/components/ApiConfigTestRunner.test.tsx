
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ApiConfigTestRunner from '@/components/ApiConfigTestRunner';

describe('ApiConfigTestRunner', () => {
  it('renders without crashing', () => {
    render(<ApiConfigTestRunner />);
    expect(screen.getByText(/Test Runner/i)).toBeInTheDocument();
  });

  it('displays run tests button', () => {
    render(<ApiConfigTestRunner />);
    expect(screen.getByText(/Run Tests/i)).toBeInTheDocument();
  });

  it('shows test progress when running', async () => {
    render(<ApiConfigTestRunner />);

    const runButton = screen.getByText(/Run Tests/i);
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('displays test results after completion', async () => {
    render(<ApiConfigTestRunner />);

    const runButton = screen.getByText(/Run Tests/i);
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText(/Test Results/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows individual test status', async () => {
    render(<ApiConfigTestRunner />);

    const runButton = screen.getByText(/Run Tests/i);
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText(/Passed/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('allows stopping test execution', async () => {
    render(<ApiConfigTestRunner />);

    const runButton = screen.getByText(/Run Tests/i);
    fireEvent.click(runButton);

    await waitFor(() => {
      const stopButton = screen.getByText(/Stop/i);
      expect(stopButton).toBeInTheDocument();
    });
  });
});