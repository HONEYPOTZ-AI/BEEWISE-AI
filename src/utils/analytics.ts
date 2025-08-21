import { logger } from './logger';
import { performanceMonitor } from './performance';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface UserProperties {
  userId?: string;
  email?: string;
  plan?: string;
  environment: string;
}

class AnalyticsManager {
  private isEnabled: boolean;
  private isInitialized: boolean = false;
  private eventQueue: AnalyticsEvent[] = [];
  private userProperties: UserProperties;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
    this.userProperties = {
      environment: import.meta.env.VITE_APP_ENV || 'development'
    };

    if (this.isEnabled) {
      this.initialize();
    }
  }

  private async initialize() {
    try {
      // Initialize Google Analytics 4
      await this.initializeGoogleAnalytics();

      // Initialize Sentry (if enabled)
      await this.initializeSentry();

      this.isInitialized = true;

      // Process queued events
      this.processEventQueue();

      logger.info('Analytics initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize analytics', error instanceof Error ? error : new Error('Analytics initialization failed'));
    }
  }

  private async initializeGoogleAnalytics() {
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (!gaId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = window.gtag || ((...args: any[]) => {
      (window.gtag as any).q = (window.gtag as any).q || [];
      (window.gtag as any).q.push(args);
    });

    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'app_version'
      }
    });

    // Track initial page view
    this.trackPageView(window.location.pathname);
  }

  private async initializeSentry() {
    const sentryDSN = import.meta.env.VITE_SENTRY_DSN;
    if (!sentryDSN) return;

    // Load Sentry SDK dynamically to avoid bundle size impact
    const Sentry = await import('@sentry/browser');

    Sentry.init({
      dsn: sentryDSN,
      environment: import.meta.env.VITE_APP_ENV,
      tracesSampleRate: import.meta.env.VITE_APP_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event) {
        // Filter out development errors
        if (import.meta.env.VITE_APP_ENV === 'development') {
          return null;
        }
        return event;
      }
    });

    window.Sentry = Sentry;
  }

  private processEventQueue() {
    if (!this.isInitialized) return;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.sendEvent(event);
      }
    }
  }

  private sendEvent(event: AnalyticsEvent) {
    try {
      // Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', event.name, {
          ...event.properties,
          app_version: import.meta.env.VITE_APP_VERSION,
          environment: this.userProperties.environment
        });
      }

      // Send to Sentry as breadcrumb
      if (window.Sentry) {
        window.Sentry.addBreadcrumb({
          category: 'user-action',
          message: event.name,
          level: 'info',
          data: event.properties
        });
      }

      logger.debug('Analytics event sent', event);
    } catch (error) {
      logger.error('Failed to send analytics event', error instanceof Error ? error : new Error('Analytics send error'));
    }
  }

  // Public API methods
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: Date.now()
      }
    };

    if (this.isInitialized) {
      this.sendEvent(event);
    } else {
      this.eventQueue.push(event);
    }
  }

  trackPageView(path: string) {
    this.track('page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href
    });
  }

  trackUserAction(action: string, element?: string, value?: number) {
    this.track('user_action', {
      action,
      element,
      value
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });

    // Also send to error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context
      });
    }
  }

  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.track('performance_metric', {
      metric_name: metric,
      metric_value: value,
      metric_unit: unit
    });
  }

  setUserProperties(properties: Partial<UserProperties>) {
    this.userProperties = { ...this.userProperties, ...properties };

    if (window.gtag) {
      window.gtag('set', 'user_properties', this.userProperties);
    }

    if (window.Sentry) {
      window.Sentry.configureScope((scope) => {
        Object.entries(this.userProperties).forEach(([key, value]) => {
          if (value) scope.setTag(key, String(value));
        });
      });
    }
  }

  // Ecommerce tracking (if needed)
  trackPurchase(transactionId: string, value: number, currency: string = 'USD', items?: Array<any>) {
    this.track('purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items
    });
  }

  // Form tracking
  trackFormStart(formName: string) {
    this.track('form_start', { form_name: formName });
  }

  trackFormSubmit(formName: string, success: boolean) {
    this.track('form_submit', {
      form_name: formName,
      success
    });
  }

  // Search tracking
  trackSearch(searchTerm: string, resultsCount?: number) {
    this.track('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }
}

// Global analytics instance
export const analytics = new AnalyticsManager();

// React hook for component-level analytics
export const useAnalytics = () => {
  const trackClick = (elementName: string, properties?: Record<string, any>) => {
    analytics.trackUserAction('click', elementName, undefined);
  };

  const trackView = (componentName: string, properties?: Record<string, any>) => {
    analytics.track('component_view', {
      component_name: componentName,
      ...properties
    });
  };

  const trackFormInteraction = (formName: string, fieldName: string, action: 'focus' | 'blur' | 'change') => {
    analytics.track('form_interaction', {
      form_name: formName,
      field_name: fieldName,
      interaction_type: action
    });
  };

  return {
    trackClick,
    trackView,
    trackFormInteraction,
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics)
  };
};

// HOC for automatic component tracking
export const withAnalytics = <P extends object,>(
Component: React.ComponentType<P>,
componentName?: string) =>
{
  const WrappedComponent = (props: P) => {
    const { trackView } = useAnalytics();

    React.useEffect(() => {
      const name = componentName || Component.displayName || Component.name;
      trackView(name);
    }, []);

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withAnalytics(${componentName || Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default AnalyticsManager;