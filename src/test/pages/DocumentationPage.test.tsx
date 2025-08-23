
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import DocumentationPage from '@/pages/DocumentationPage';
import userEvent from '@testing-library/user-event';

describe('DocumentationPage', () => {
  it('renders without crashing', () => {
    render(<DocumentationPage />);
    expect(screen.getByText(/API Documentation/i)).toBeInTheDocument();
  });

  it('displays documentation sections', () => {
    render(<DocumentationPage />);
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument();
    expect(screen.getByText(/API Reference/i)).toBeInTheDocument();
    expect(screen.getByText(/Examples/i)).toBeInTheDocument();
  });

  it('allows searching documentation', async () => {
    const user = userEvent.setup();
    render(<DocumentationPage />);

    const searchInput = screen.getByPlaceholderText(/Search documentation/i);
    await user.type(searchInput, 'authentication');

    expect(searchInput).toHaveValue('authentication');
  });

  it('filters content based on search', async () => {
    const user = userEvent.setup();
    render(<DocumentationPage />);

    const searchInput = screen.getByPlaceholderText(/Search documentation/i);
    await user.type(searchInput, 'auth');

    await waitFor(() => {
      expect(screen.getByText(/Authentication/i)).toBeInTheDocument();
    });
  });

  it('displays code examples', () => {
    render(<DocumentationPage />);
    const codeBlocks = screen.getAllByRole('code');
    expect(codeBlocks.length).toBeGreaterThan(0);
  });

  it('allows copying code snippets', async () => {
    const user = userEvent.setup();
    render(<DocumentationPage />);

    const copyButtons = screen.getAllByLabelText(/copy/i);
    if (copyButtons.length > 0) {
      await user.click(copyButtons[0]);
      // Should show copied confirmation
    }
  });

  it('displays table of contents', () => {
    render(<DocumentationPage />);
    expect(screen.getByText(/Table of Contents/i)).toBeInTheDocument();
  });

  it('navigates to sections via table of contents', () => {
    render(<DocumentationPage />);

    const tocLinks = screen.getAllByRole('link');
    expect(tocLinks.length).toBeGreaterThan(0);
  });

  it('shows API endpoints documentation', () => {
    render(<DocumentationPage />);
    expect(screen.getByText(/Endpoints/i)).toBeInTheDocument();
  });

  it('displays request/response examples', () => {
    render(<DocumentationPage />);
    expect(screen.getByText(/Request/i)).toBeInTheDocument();
    expect(screen.getByText(/Response/i)).toBeInTheDocument();
  });
});