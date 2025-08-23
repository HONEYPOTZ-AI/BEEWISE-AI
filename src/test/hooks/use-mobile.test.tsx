
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  it('returns false for desktop viewport', () => {
    // Mock matchMedia for desktop
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false, // Desktop doesn't match mobile query
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true for mobile viewport', () => {
    // Mock matchMedia for mobile
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('768px'), // Mobile matches the query
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('updates on viewport change', () => {
    let matchesResult = false;
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: matchesResult,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event, handler) => {
        // Store the handler for later use
        mockMatchMedia.handler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia
    });

    const { result, rerender } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate viewport change to mobile
    matchesResult = true;
    if (mockMatchMedia.handler) {
      mockMatchMedia.handler({ matches: true });
    }
    rerender();

    expect(result.current).toBe(true);
  });

  it('handles missing matchMedia', () => {
    // @ts-ignore
    delete window.matchMedia;

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false); // Should default to false
  });

  it('cleans up event listeners on unmount', () => {
    const mockRemoveEventListener = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: vi.fn()
      }))
    });

    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
});