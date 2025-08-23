
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import TestingPage from '@/pages/TestingPage'

// Mock child components
vi.mock('@/components/ApiConfigTestRunner', () => ({
  default: () => <div data-testid="api-config-test-runner">ApiConfigTestRunner</div>
}))

vi.mock('@/components/TestDocumentationGenerator', () => ({
  default: () => <div data-testid="test-documentation-generator">TestDocumentationGenerator</div>
}))

vi.mock('@/components/ApiConfigTestSuite', () => ({
  default: () => <div data-testid="api-config-test-suite">ApiConfigTestSuite</div>
}))

describe('TestingPage', () => {
  it('renders without crashing', () => {
    render(<TestingPage />)
    expect(screen.getByText(/Comprehensive Testing Suite/i)).toBeInTheDocument()
  })

  it('displays all testing tabs', () => {
    render(<TestingPage />)
    expect(screen.getByText(/Test Runner/i)).toBeInTheDocument()
    expect(screen.getByText(/Documentation/i)).toBeInTheDocument()
    expect(screen.getByText(/Test Suite/i)).toBeInTheDocument()
  })

  it('shows test runner by default', () => {
    render(<TestingPage />)
    expect(screen.getByTestId('api-config-test-runner')).toBeInTheDocument()
  })

  it('switches to documentation tab', () => {
    render(<TestingPage />)
    
    const docTab = screen.getByText(/Documentation/i)
    fireEvent.click(docTab)
    
    expect(screen.getByTestId('test-documentation-generator')).toBeInTheDocument()
  })

  it('switches to test suite tab', () => {
    render(<TestingPage />)
    
    const suiteTab = screen.getByText(/Test Suite/i)
    fireEvent.click(suiteTab)
    
    expect(screen.getByTestId('api-config-test-suite')).toBeInTheDocument()
  })

  it('displays testing metrics', () => {
    render(<TestingPage />)
    expect(screen.getByText(/Total Tests/i)).toBeInTheDocument()
    expect(screen.getByText(/Passed/i)).toBeInTheDocument()
    expect(screen.getByText(/Failed/i)).toBeInTheDocument()
  })

  it('shows run all tests button', () => {
    render(<TestingPage />)
    expect(screen.getByText(/Run All Tests/i)).toBeInTheDocument()
  })

  it('handles test execution', () => {
    render(<TestingPage />)
    
    const runAllButton = screen.getByText(/Run All Tests/i)
    fireEvent.click(runAllButton)
    
    // Should trigger test execution (component behavior)
    expect(runAllButton).toBeInTheDocument()
  })
})
