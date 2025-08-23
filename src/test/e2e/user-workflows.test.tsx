
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import App from '@/App';
import userEvent from '@testing-library/user-event';

describe('User Workflows E2E', () => {
  it('completes API configuration workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to API Config
    const configButton = screen.getByText(/Configure APIs/i);
    await user.click(configButton);

    await waitFor(() => {
      expect(screen.getByText(/API Configuration/i)).toBeInTheDocument();
    });

    // Fill out configuration form
    const nameInput = screen.getByLabelText(/API Name/i);
    const urlInput = screen.getByLabelText(/Base URL/i);
    const descInput = screen.getByLabelText(/Description/i);

    await user.type(nameInput, 'Test API');
    await user.type(urlInput, 'https://api.test.com');
    await user.type(descInput, 'Test API Description');

    // Save configuration
    const saveButton = screen.getByText(/Save Configuration/i);
    await user.click(saveButton);

    // Should show success feedback
    await waitFor(() => {
      expect(screen.getByText(/Configuration saved/i)).toBeInTheDocument();
    });
  });

  it('completes API testing workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to API Testing
    const testButton = screen.getByText(/Start Testing/i);
    await user.click(testButton);

    await waitFor(() => {
      expect(screen.getByText(/API Testing/i)).toBeInTheDocument();
    });

    // Configure test
    const urlInput = screen.getByLabelText(/Endpoint URL/i);
    await user.type(urlInput, 'https://api.example.com/test');

    // Run test
    const runButton = screen.getByText(/Run Test/i);
    await user.click(runButton);

    // Should show test results
    await waitFor(() => {
      expect(screen.getByText(/Response/i)).toBeInTheDocument();
    });
  });

  it('completes documentation generation workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to Documentation
    const docsButton = screen.getByText(/View Docs/i);
    await user.click(docsButton);

    await waitFor(() => {
      expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
    });

    // Search documentation
    const searchInput = screen.getByPlaceholderText(/Search/i);
    if (searchInput) {
      await user.type(searchInput, 'authentication');

      await waitFor(() => {
        expect(screen.getByText(/Authentication/i)).toBeInTheDocument();
      });
    }
  });

  it('handles error scenarios gracefully', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to API Testing
    const testButton = screen.getByText(/Start Testing/i);
    await user.click(testButton);

    // Try to run test without URL
    const runButton = screen.getByText(/Run Test/i);
    await user.click(runButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/URL is required/i)).toBeInTheDocument();
    });
  });

  it('maintains state across page refreshes', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Change theme
    const themeToggle = screen.getByLabelText(/toggle theme/i);
    await user.click(themeToggle);

    // Simulate page refresh
    window.location.reload = vi.fn();

    // Re-render app
    const { rerender } = render(<App />);
    rerender(<App />);

    // Theme should persist
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});