
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ApiTestingPage from '@/pages/ApiTestingPage';
import userEvent from '@testing-library/user-event';

describe('ApiTestingPage', () => {
  it('renders without crashing', () => {
    render(<ApiTestingPage />);
    expect(screen.getByText(/API Testing Hub/i)).toBeInTheDocument();
  });

  it('displays testing tabs', () => {
    render(<ApiTestingPage />);
    expect(screen.getByText(/Manual Testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Tests/i)).toBeInTheDocument();
    expect(screen.getByText(/Load Testing/i)).toBeInTheDocument();
  });

  it('allows switching between tabs', async () => {
    const user = userEvent.setup();
    render(<ApiTestingPage />);

    const automatedTab = screen.getByText(/Automated Tests/i);
    await user.click(automatedTab);

    expect(screen.getByText(/Automated Test Suite/i)).toBeInTheDocument();
  });

  it('displays manual testing form', () => {
    render(<ApiTestingPage />);
    expect(screen.getByLabelText(/Endpoint URL/i)).toBeInTheDocument();
    expect(screen.getByText(/HTTP Method/i)).toBeInTheDocument();
  });

  it('allows user to input test parameters', async () => {
    const user = userEvent.setup();
    render(<ApiTestingPage />);

    const urlInput = screen.getByLabelText(/Endpoint URL/i);
    await user.type(urlInput, 'https://api.example.com/test');

    expect(urlInput).toHaveValue('https://api.example.com/test');
  });

  it('executes test when run button is clicked', async () => {
    const user = userEvent.setup();
    render(<ApiTestingPage />);

    const urlInput = screen.getByLabelText(/Endpoint URL/i);
    await user.type(urlInput, 'https://api.example.com/test');

    const runButton = screen.getByText(/Run Test/i);
    await user.click(runButton);

    await waitFor(() => {
      expect(screen.getByText(/Response/i)).toBeInTheDocument();
    });
  });

  it('displays test results', async () => {
    render(<ApiTestingPage />);

    // Simulate a completed test
    const runButton = screen.getByText(/Run Test/i);
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    });
  });

  it('handles test errors gracefully', async () => {
    const user = userEvent.setup();
    render(<ApiTestingPage />);

    const urlInput = screen.getByLabelText(/Endpoint URL/i);
    await user.type(urlInput, 'invalid-url');

    const runButton = screen.getByText(/Run Test/i);
    await user.click(runButton);

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});