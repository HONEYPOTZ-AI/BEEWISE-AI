import { logger } from './logger';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    Sentry?: {
      captureException: (error: Error, context?: any) => void;
      addBreadcrumb: (breadcrumb: any) => void;
      configureScope: (callback: (scope: any) => void) => void;
      setTag: (key: string, value: string) => void;
    };
  }
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
    if (this.isEnabled) {
      this.initializeObservers();
      this.trackVitals();
    }
  }

  private initializeObservers() {
    // Track Navigation Timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      this.trackNavigationTiming();
      this.trackResourceTiming();
      this.trackLongTasks();
    }
  }

  private trackNavigationTiming() {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const nav = navigationEntries[0];

      this.recordMetric('page-load-time', nav.loadEventEnd - nav.navigationStart, 'ms');
      this.recordMetric('dom-content-loaded', nav.domContentLoadedEventEnd - nav.navigationStart, 'ms');
      this.recordMetric('first-byte', nav.responseStart - nav.navigationStart, 'ms');
      this.recordMetric('dom-interactive', nav.domInteractive - nav.navigationStart, 'ms');
    }
  }

  private trackResourceTiming() {
    if (PerformanceObserver.supportedEntryTypes?.includes('resource')) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const resource = entry as PerformanceResourceTiming;
          if (resource.transferSize > 0) {
            this.recordMetric(
              `resource-${this.getResourceType(resource.name)}`,
              resource.duration,
              'ms'
            );
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    }
  }

  private trackLongTasks() {
    if (PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('long-task', entry.duration, 'ms');
          logger.warn('Long task detected', {
            duration: entry.duration,
            startTime: entry.startTime
          });
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);
    }
  }

  private trackVitals() {
    // Core Web Vitals tracking
    if ('PerformanceObserver' in window) {
      // LCP - Largest Contentful Paint
      this.trackLCP();
      // FID - First Input Delay
      this.trackFID();
      // CLS - Cumulative Layout Shift
      this.trackCLS();
    }
  }

  private trackLCP() {
    if (PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('lcp', lastEntry.startTime, 'ms');
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    }
  }

  private trackFID() {
    if (PerformanceObserver.supportedEntryTypes?.includes('first-input')) {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          this.recordMetric('fid', fidEntry.processingStart - fidEntry.startTime, 'ms');
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    }
  }

  private trackCLS() {
    if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
      let clsValue = 0;

      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
          }
        });

        this.recordMetric('cls', clsValue, 'count');
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    }
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(js|mjs)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'style';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'other';
  }

  recordMetric(name: string, value: number, unit: PerformanceMetric['unit'] = 'ms') {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    };

    this.metrics.push(metric);
    logger.debug(`Performance metric: ${name}`, { value, unit });

    // Send to analytics
    this.sendToAnalytics(metric);

    // Clean up old metrics (keep last 100)
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit
      });
    }

    // Sentry Performance Monitoring
    if (window.Sentry) {
      window.Sentry.addBreadcrumb({
        category: 'performance',
        message: `Performance metric: ${metric.name}`,
        level: 'info',
        data: {
          name: metric.name,
          value: metric.value,
          unit: metric.unit
        }
      });
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((metric) => metric.name === name);
  }

  clearMetrics() {
    this.metrics = [];
  }

  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.clearMetrics();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for component-level performance tracking
export const usePerformanceTracking = () => {
  const trackRender = (componentName: string) => {
    const startTime = Date.now();
    return () => {
      const endTime = Date.now();
      performanceMonitor.recordMetric(`render-${componentName}`, endTime - startTime, 'ms');
    };
  };

  const trackAsyncOperation = async <T,>(
  operationName: string,
  operation: () => Promise<T>)
  : Promise<T> => {
    const startTime = Date.now();
    try {
      const result = await operation();
      performanceMonitor.recordMetric(`async-${operationName}`, Date.now() - startTime, 'ms');
      return result;
    } catch (error) {
      performanceMonitor.recordMetric(`async-${operationName}-error`, Date.now() - startTime, 'ms');
      throw error;
    }
  };

  return { trackRender, trackAsyncOperation };
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    performanceMonitor.recordMetric('memory-used', memory.usedJSHeapSize, 'bytes');
    performanceMonitor.recordMetric('memory-total', memory.totalJSHeapSize, 'bytes');
    performanceMonitor.recordMetric('memory-limit', memory.jsHeapSizeLimit, 'bytes');
  }
};