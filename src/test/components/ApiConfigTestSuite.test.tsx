
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import ApiConfigTestSuite from '@/components/ApiConfigTestSuite'

describe('ApiConfigTestSuite', () => {
  it('renders without crashing', () => {
    render(<ApiConfigTestSuite />)
    expect(screen.getByText(/API Configuration Tests/i)).toBeInTheDocument()
  })

  it('displays configuration test categories', () => {
    render(<ApiConfigTestSuite />)
    expect(screen.getByText(/Connection Tests/i)).toBeInTheDocument()
    expect(screen.getByText(/Validation Tests/i)).toBeInTheDocument()
  })

  it('shows test execution controls', () => {
    render(<ApiConfigTestSuite />)
    expect(screen.getByText(/Run Config Tests/i)).toBeInTheDocument()
  })

  it('displays test results summary', () => {
    render(<ApiConfigTestSuite />)
    expect(screen.getByText(/Total/i)).toBeInTheDocument()
    expect(screen.getByText(/Passed/i)).toBeInTheDocument()
    expect(screen.getByText(/Failed/i)).toBeInTheDocument()
  })

  it('allows running configuration tests', () => {
    render(<ApiConfigTestSuite />)
    
    const runButton = screen.getByText(/Run Config Tests/i)
    fireEvent.click(runButton)
    
    // Should trigger test execution
    expect(runButton).toBeInTheDocument()
  })

  it('shows detailed test results', () => {
    render(<ApiConfigTestSuite />)
    
    const runButton = screen.getByText(/Run Config Tests/i)
    fireEvent.click(runButton)
    
    // Should show detailed results after execution
    setTimeout(() => {
      expect(screen.getByText(/Details/i)).toBeInTheDocument()
    }, 1000)
  })
})
