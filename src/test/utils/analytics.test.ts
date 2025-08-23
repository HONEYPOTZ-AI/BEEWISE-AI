
import { describe, it, expect, vi } from 'vitest'
import { analytics } from '@/utils/analytics'
import { renderHook } from '@testing-library/react'
import { useAnalytics } from '@/utils/analytics'

// Mock external analytics services
const mockGtag = vi.fn()
global.gtag = mockGtag

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('track', () => {
    it('tracks events with properties', () => {
      analytics.track('button_click', {
        button_name: 'test_button',
        page: '/test'
      })
      
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'button_click',
        expect.objectContaining({
          button_name: 'test_button',
          page: '/test'
        })
      )
    })

    it('tracks events without properties', () => {
      analytics.track('page_view')
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {})
    })

    it('handles invalid event names', () => {
      expect(() => analytics.track('')).not.toThrow()
      expect(() => analytics.track(null as any)).not.toThrow()
    })
  })

  describe('page', () => {
    it('tracks page views', () => {
      analytics.page('/test-page', 'Test Page')
      
      expect(mockGtag).toHaveBeenCalledWith(
        'config',
        expect.any(String),
        expect.objectContaining({
          page_path: '/test-page',
          page_title: 'Test Page'
        })
      )
    })

    it('tracks page views without title', () => {
      analytics.page('/test-page')
      expect(mockGtag).toHaveBeenCalled()
    })
  })

  describe('identify', () => {
    it('identifies users', () => {
      analytics.identify('user123', {
        email: 'test@example.com',
        name: 'Test User'
      })
      
      expect(mockGtag).toHaveBeenCalledWith(
        'config',
        expect.any(String),
        expect.objectContaining({
          user_id: 'user123',
          custom_map: expect.objectContaining({
            email: 'test@example.com',
            name: 'Test User'
          })
        })
      )
    })
  })

  describe('error tracking', () => {
    it('tracks errors', () => {
      const error = new Error('Test error')
      analytics.trackError(error, { context: 'test' })
      
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'exception',
        expect.objectContaining({
          description: 'Test error',
          fatal: false,
          context: 'test'
        })
      )
    })

    it('tracks fatal errors', () => {
      const error = new Error('Fatal error')
      analytics.trackError(error, { fatal: true })
      
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'exception',
        expect.objectContaining({
          fatal: true
        })
      )
    })
  })
})

describe('useAnalytics hook', () => {
  it('provides analytics functions', () => {
    const { result } = renderHook(() => useAnalytics())
    
    expect(result.current.track).toBeDefined()
    expect(result.current.page).toBeDefined()
    expect(result.current.identify).toBeDefined()
  })

  it('tracks component events', () => {
    const { result } = renderHook(() => useAnalytics())
    
    result.current.track('component_mounted', { component: 'TestComponent' })
    expect(mockGtag).toHaveBeenCalled()
  })
})
