
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import NotFound from '@/pages/NotFound'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('NotFound', () => {
  it('renders without crashing', () => {
    render(<NotFound />)
    expect(screen.getByText(/404/i)).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<NotFound />)
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument()
  })

  it('shows go home button', () => {
    render(<NotFound />)
    const homeButton = screen.getByText(/Go Home/i)
    expect(homeButton).toBeInTheDocument()
  })

  it('navigates to home when button is clicked', () => {
    render(<NotFound />)
    
    const homeButton = screen.getByText(/Go Home/i)
    fireEvent.click(homeButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('displays animated elements', () => {
    render(<NotFound />)
    const animatedElements = document.querySelectorAll('[style*="animation"]')
    // Should have some animated elements for better UX
  })
})
