
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import App from '@/App'

describe('Navigation Integration', () => {
  it('navigates between pages correctly', async () => {
    render(<App />)
    
    // Should start on home page
    expect(screen.getByText(/API Test Master/i)).toBeInTheDocument()
    
    // Navigate to API Config
    const configButton = screen.getByText(/Configure APIs/i)
    fireEvent.click(configButton)
    
    await waitFor(() => {
      expect(screen.getByText(/API Configuration/i)).toBeInTheDocument()
    })
  })

  it('shows 404 page for invalid routes', async () => {
    window.history.pushState({}, 'Test', '/invalid-route')
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/404/i)).toBeInTheDocument()
    })
  })

  it('maintains theme across navigation', async () => {
    render(<App />)
    
    // Change theme
    const themeToggle = screen.getByLabelText(/toggle theme/i)
    fireEvent.click(themeToggle)
    
    // Navigate to another page
    const configButton = screen.getByText(/Configure APIs/i)
    fireEvent.click(configButton)
    
    await waitFor(() => {
      expect(screen.getByText(/API Configuration/i)).toBeInTheDocument()
    })
    
    // Theme should persist
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
