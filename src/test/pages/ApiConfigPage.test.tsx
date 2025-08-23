
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import ApiConfigPage from '@/pages/ApiConfigPage'
import userEvent from '@testing-library/user-event'

// Mock the ezsite APIs
const mockTablePage = vi.fn()
const mockTableCreate = vi.fn()
const mockTableUpdate = vi.fn()
const mockTableDelete = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  window.ezsite = {
    ...window.ezsite,
    apis: {
      ...window.ezsite.apis,
      tablePage: mockTablePage,
      tableCreate: mockTableCreate,
      tableUpdate: mockTableUpdate,
      tableDelete: mockTableDelete,
    }
  }
})

describe('ApiConfigPage', () => {
  it('renders without crashing', () => {
    render(<ApiConfigPage />)
    expect(screen.getByText(/API Configuration/i)).toBeInTheDocument()
  })

  it('displays configuration form', () => {
    render(<ApiConfigPage />)
    expect(screen.getByLabelText(/API Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Base URL/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
  })

  it('allows user to fill out configuration form', async () => {
    const user = userEvent.setup()
    render(<ApiConfigPage />)
    
    const nameInput = screen.getByLabelText(/API Name/i)
    const urlInput = screen.getByLabelText(/Base URL/i)
    
    await user.type(nameInput, 'Test API')
    await user.type(urlInput, 'https://api.test.com')
    
    expect(nameInput).toHaveValue('Test API')
    expect(urlInput).toHaveValue('https://api.test.com')
  })

  it('validates form fields', async () => {
    const user = userEvent.setup()
    render(<ApiConfigPage />)
    
    const saveButton = screen.getByText(/Save Configuration/i)
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/API Name is required/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    mockTableCreate.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<ApiConfigPage />)
    
    await user.type(screen.getByLabelText(/API Name/i), 'Test API')
    await user.type(screen.getByLabelText(/Base URL/i), 'https://api.test.com')
    await user.type(screen.getByLabelText(/Description/i), 'Test description')
    
    const saveButton = screen.getByText(/Save Configuration/i)
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(mockTableCreate).toHaveBeenCalledWith(
        36659,
        expect.objectContaining({
          api_name: 'Test API',
          base_url: 'https://api.test.com',
          description: 'Test description'
        })
      )
    })
  })

  it('handles form submission errors', async () => {
    mockTableCreate.mockResolvedValue({ error: 'Failed to save configuration' })
    const user = userEvent.setup()
    render(<ApiConfigPage />)
    
    await user.type(screen.getByLabelText(/API Name/i), 'Test API')
    await user.type(screen.getByLabelText(/Base URL/i), 'https://api.test.com')
    
    const saveButton = screen.getByText(/Save Configuration/i)
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to save configuration/i)).toBeInTheDocument()
    })
  })

  it('loads existing configurations', async () => {
    mockTablePage.mockResolvedValue({
      data: {
        List: [
          { id: 1, api_name: 'Existing API', base_url: 'https://existing.com' }
        ],
        VirtualCount: 1
      },
      error: null
    })
    
    render(<ApiConfigPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Existing API/i)).toBeInTheDocument()
    })
  })
})
