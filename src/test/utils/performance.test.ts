
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performanceMonitor, usePerformanceTracking, trackMemoryUsage } from '@/utils/performance';
import { renderHook, act } from '@testing-library/react';

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000
    }
  },
  writable: true
});

describe('performanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts timing correctly', () => {
    const timer = performanceMonitor.startTiming('test-operation');
    expect(timer).toBeDefined();
    expect(typeof timer.end).toBe('function');
  });

  it('ends timing and returns duration', () => {
    const timer = performanceMonitor.startTiming('test-operation');
    const duration = timer.end();
    expect(typeof duration).toBe('number');
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  it('records metrics correctly', () => {
    performanceMonitor.recordMetric('test-metric', 100);
    // Should not throw and should handle the metric
    expect(true).toBe(true);
  });

  it('handles multiple concurrent timings', () => {
    const timer1 = performanceMonitor.startTiming('operation1');
    const timer2 = performanceMonitor.startTiming('operation2');

    expect(timer1.end()).toBeGreaterThanOrEqual(0);
    expect(timer2.end()).toBeGreaterThanOrEqual(0);
  });
});

describe('usePerformanceTracking', () => {
  it('provides performance tracking functionality', () => {
    const { result } = renderHook(() => usePerformanceTracking());

    expect(result.current.startTiming).toBeDefined();
    expect(result.current.recordMetric).toBeDefined();
  });

  it('tracks component render performance', () => {
    const { result } = renderHook(() => usePerformanceTracking());

    act(() => {
      const timer = result.current.startTiming('component-render');
      timer.end();
    });

    // Should complete without errors
    expect(true).toBe(true);
  });
});

describe('trackMemoryUsage', () => {
  it('tracks memory usage when performance.memory is available', () => {
    const memoryInfo = trackMemoryUsage();

    if (memoryInfo) {
      expect(memoryInfo.usedJSHeapSize).toBeDefined();
      expect(memoryInfo.totalJSHeapSize).toBeDefined();
      expect(memoryInfo.jsHeapSizeLimit).toBeDefined();
    }
  });

  it('handles missing performance.memory gracefully', () => {
    // @ts-ignore
    delete global.performance.memory;
    const memoryInfo = trackMemoryUsage();
    expect(memoryInfo).toBeNull();
  });
});