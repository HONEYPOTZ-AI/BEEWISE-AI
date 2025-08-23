
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { waitFor } from '@testing-library/react';
import HomePage from '@/pages/HomePage';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByText(/API Test Master/i)).toBeInTheDocument();
  });

  it('displays main heading and description', () => {
    render(<HomePage />);
    expect(screen.getByText(/API Test Master/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive API Testing & Documentation Platform/i)).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<HomePage />);
    expect(screen.getByText(/API Configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
  });

  it('navigates to correct pages when buttons are clicked', async () => {
    render(<HomePage />);

    const configButton = screen.getByText(/Configure APIs/i);
    fireEvent.click(configButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/api-config');
    });
  });

  it('displays theme toggle', () => {
    render(<HomePage />);
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('renders particle background', () => {
    render(<HomePage />);
    const particleContainer = document.querySelector('.particle-background');
    expect(particleContainer).toBeInTheDocument();
  });

  it('displays enhanced buttons with proper styling', () => {
    render(<HomePage />);
    const buttons = screen.getAllByRole('button');
    const enhancedButtons = buttons.filter((button) =>
    button.classList.contains('enhanced-button') ||
    button.textContent?.includes('Configure') ||
    button.textContent?.includes('Start Testing') ||
    button.textContent?.includes('View Docs')
    );
    expect(enhancedButtons.length).toBeGreaterThan(0);
  });
});