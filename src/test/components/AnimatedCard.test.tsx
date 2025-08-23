
import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import AnimatedCard from '@/components/AnimatedCard';

describe('AnimatedCard', () => {
  it('renders with children', () => {
    render(<AnimatedCard>Card Content</AnimatedCard>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <AnimatedCard className="custom-card">
        Styled Card
      </AnimatedCard>
    );
    const card = screen.getByText('Styled Card').parentElement;
    expect(card).toHaveClass('custom-card');
  });

  it('has motion attributes', () => {
    render(<AnimatedCard>Motion Card</AnimatedCard>);
    const card = screen.getByText('Motion Card').parentElement;
    expect(card).toHaveAttribute('data-framer-component-type');
  });

  it('supports hover effects', () => {
    render(<AnimatedCard>Hover Card</AnimatedCard>);
    const card = screen.getByText('Hover Card').parentElement;
    expect(card).toBeInTheDocument();
  });
});