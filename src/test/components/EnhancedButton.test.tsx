
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import EnhancedButton from '@/components/EnhancedButton'

describe('EnhancedButton', () => {
  it('renders with children', () => {
    render(<EnhancedButton>Test Button</EnhancedButton>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<EnhancedButton onClick={handleClick}>Click Me</EnhancedButton>)
    
    const button = screen.getByText('Click Me')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<EnhancedButton className="custom-class">Styled Button</EnhancedButton>)
    const button = screen.getByText('Styled Button')
    expect(button).toHaveClass('custom-class')
  })

  it('can be disabled', () => {
    render(<EnhancedButton disabled>Disabled Button</EnhancedButton>)
    const button = screen.getByText('Disabled Button')
    expect(button).toBeDisabled()
  })

  it('renders with icon', () => {
    render(
      <EnhancedButton icon="play">
        With Icon
      </EnhancedButton>
    )
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('supports different variants', () => {
    render(<EnhancedButton variant="secondary">Secondary</EnhancedButton>)
    const button = screen.getByText('Secondary')
    expect(button).toHaveClass('bg-secondary')
  })
})
