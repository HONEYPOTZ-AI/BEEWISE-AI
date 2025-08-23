
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '../utils/test-utils'
import HealthCheck from '@/components/HealthCheck'

// Mock the Node.js API
const mockRun = vi.fn()

beforeEach(() => {
  window.ezsite = {
    ...window.ezsite,
    apis: {
      ...window.ezsite.apis,
      run: mockRun
    }
  }
})

describe('HealthCheck', () => {
  it('renders without crashing', () => {
    render(<HealthCheck />)
    expect(screen.getByText(/System Health/i)).toBeInTheDocument()
  })

  it('displays health check status', async () => {
    mockRun.mockResolvedValue({
      data: { status: 'healthy', checks: [] },
      error: null
    })
    
    render(<HealthCheck />)
    
    await waitFor(() => {
      expect(screen.getByText(/healthy/i)).toBeInTheDocument()
    })
  })

  it('shows individual check results', async () => {
    mockRun.mockResolvedValue({
      data: {
        status: 'healthy',
        checks: [
          { name: 'Database', status: 'healthy' },
          { name: 'API', status: 'healthy' }
        ]
      },
      error: null
    })
    
    render(<HealthCheck />)
    
    await waitFor(() => {
      expect(screen.getByText(/Database/i)).toBeInTheDocument()
      expect(screen.getByText(/API/i)).toBeInTheDocument()
    })
  })

  it('handles health check errors', async () => {
    mockRun.mockResolvedValue({
      data: null,
      error: 'Health check failed'
    })
    
    render(<HealthCheck />)
    
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument()
    })
  })

  it('allows refreshing health status', async () => {
    mockRun.mockResolvedValue({
      data: { status: 'healthy', checks: [] },
      error: null
    })
    
    render(<HealthCheck />)
    
    const refreshButton = screen.getByText(/Refresh/i)
    refreshButton.click()
    
    expect(mockRun).toHaveBeenCalled()
  })
})
