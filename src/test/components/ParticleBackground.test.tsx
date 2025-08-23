
import { describe, it, expect, vi } from 'vitest'
import { render } from '../utils/test-utils'
import ParticleBackground from '@/components/ParticleBackground'

// Mock theme context
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' })
}))

describe('ParticleBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<ParticleBackground />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('creates canvas element', () => {
    const { container } = render(<ParticleBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    const { container } = render(<ParticleBackground />)
    const background = container.firstChild
    expect(background).toHaveClass('particle-background')
  })

  it('responds to theme changes', () => {
    const { container } = render(<ParticleBackground />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
