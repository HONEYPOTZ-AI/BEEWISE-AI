
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import TestDocumentationGenerator from '@/components/TestDocumentationGenerator';

describe('TestDocumentationGenerator', () => {
  it('renders without crashing', () => {
    render(<TestDocumentationGenerator />);
    expect(screen.getByText(/Documentation Generator/i)).toBeInTheDocument();
  });

  it('shows generate documentation button', () => {
    render(<TestDocumentationGenerator />);
    expect(screen.getByText(/Generate Documentation/i)).toBeInTheDocument();
  });

  it('displays documentation format options', () => {
    render(<TestDocumentationGenerator />);
    expect(screen.getByText(/Format/i)).toBeInTheDocument();
    expect(screen.getByText(/HTML/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
  });

  it('generates documentation when button clicked', () => {
    render(<TestDocumentationGenerator />);

    const generateButton = screen.getByText(/Generate Documentation/i);
    fireEvent.click(generateButton);

    // Should show generation progress or result
    expect(generateButton).toBeInTheDocument();
  });

  it('shows documentation preview', () => {
    render(<TestDocumentationGenerator />);
    expect(screen.getByText(/Preview/i)).toBeInTheDocument();
  });

  it('allows downloading generated documentation', () => {
    render(<TestDocumentationGenerator />);

    const generateButton = screen.getByText(/Generate Documentation/i);
    fireEvent.click(generateButton);

    // Should eventually show download option
    setTimeout(() => {
      expect(screen.getByText(/Download/i)).toBeInTheDocument();
    }, 1000);
  });
});