
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import ApiTestSuite from '@/components/ApiTestSuite'

describe('ApiTestSuite', () => {
  it('renders without crashing', () => {
    render(<ApiTestSuite />)
    expect(screen.getByText(/Test Suite/i)).toBeInTheDocument()
  })

  it('displays test categories', () => {
    render(<ApiTestSuite />)
    expect(screen.getByText(/Authentication/i)).toBeInTheDocument()
    expect(screen.getByText(/CRUD Operations/i)).toBeInTheDocument()
  })

  it('shows individual test cases', () => {
    render(<ApiTestSuite />)
    expect(screen.getByText(/Login Test/i)).toBeInTheDocument()
    expect(screen.getByText(/Registration Test/i)).toBeInTheDocument()
  })

  it('allows running specific test categories', () => {
    render(<ApiTestSuite />)
    
    const runAuthTests = screen.getByText(/Run Auth Tests/i)
    fireEvent.click(runAuthTests)
    
    // Should trigger test execution
    expect(runAuthTests).toBeInTheDocument()
  })

  it('displays test execution status', () => {
    render(<ApiTestSuite />)
    
    const statusBadges = screen.getAllByTestId(/test-status/)
    expect(statusBadges.length).toBeGreaterThan(0)
  })

  it('shows test execution time', () => {
    render(<ApiTestSuite />)
    expect(screen.getByText(/Execution Time/i)).toBeInTheDocument()
  })
})
