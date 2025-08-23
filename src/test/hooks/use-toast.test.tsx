
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast, toast } from '@/hooks/use-toast'

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns toast function and toasts array', () => {
    const { result } = renderHook(() => useToast())
    
    expect(result.current).toHaveProperty('toast')
    expect(result.current).toHaveProperty('toasts')
    expect(result.current).toHaveProperty('dismiss')
    expect(Array.isArray(result.current.toasts)).toBe(true)
  })

  it('adds toast when toast function is called', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast',
      })
    })
    
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Toast',
      description: 'This is a test toast',
    })
  })

  it('generates unique IDs for toasts', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({ title: 'Toast 1' })
      result.current.toast({ title: 'Toast 2' })
    })
    
    expect(result.current.toasts).toHaveLength(2)
    expect(result.current.toasts[0].id).not.toBe(result.current.toasts[1].id)
  })

  it('dismisses toast manually', () => {
    const { result } = renderHook(() => useToast())
    
    let toastId: string
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This toast will be dismissed',
      })
      toastId = result.current.toasts[0].id
    })
    
    expect(result.current.toasts).toHaveLength(1)
    
    act(() => {
      result.current.dismiss(toastId)
    })
    
    expect(result.current.toasts).toHaveLength(0)
  })

  it('auto-dismisses toast after timeout', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({
        title: 'Auto-dismiss Toast',
        duration: 1000,
      })
    })
    
    expect(result.current.toasts).toHaveLength(1)
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(result.current.toasts).toHaveLength(0)
  })

  it('handles different toast variants', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({
        title: 'Success Toast',
        variant: 'default',
      })
      result.current.toast({
        title: 'Error Toast',
        variant: 'destructive',
      })
    })
    
    expect(result.current.toasts).toHaveLength(2)
    expect(result.current.toasts[0].variant).toBe('default')
    expect(result.current.toasts[1].variant).toBe('destructive')
  })

  it('limits number of toasts', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      // Add many toasts
      for (let i = 0; i < 10; i++) {
        result.current.toast({ title: `Toast ${i}` })
      }
    })
    
    // Should limit to maximum (typically 5 or so)
    expect(result.current.toasts.length).toBeLessThanOrEqual(5)
  })

  describe('toast function (standalone)', () => {
    it('creates toast without hook', () => {
      const toastData = {
        title: 'Standalone Toast',
        description: 'Created without useToast hook',
      }
      
      expect(() => toast(toastData)).not.toThrow()
    })

    it('creates success toast', () => {
      expect(() => toast.success('Success message')).not.toThrow()
    })

    it('creates error toast', () => {
      expect(() => toast.error('Error message')).not.toThrow()
    })

    it('creates warning toast', () => {
      expect(() => toast.warning('Warning message')).not.toThrow()
    })

    it('creates info toast', () => {
      expect(() => toast.info('Info message')).not.toThrow()
    })
  })

  it('handles action buttons in toast', () => {
    const { result } = renderHook(() => useToast())
    const mockAction = vi.fn()
    
    act(() => {
      result.current.toast({
        title: 'Toast with Action',
        action: {
          altText: 'Undo',
          onClick: mockAction,
        },
      })
    })
    
    expect(result.current.toasts[0]).toHaveProperty('action')
    expect(result.current.toasts[0].action?.altText).toBe('Undo')
  })
})
