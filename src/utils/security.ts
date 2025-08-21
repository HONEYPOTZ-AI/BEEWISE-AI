import { logger } from './logger';

export interface SecurityConfig {
  enableCSP: boolean;
  enableXSSProtection: boolean;
  enableFrameGuard: boolean;
  enableContentTypeSniffing: boolean;
  enableHSTS: boolean;
  trustedDomains: string[];
}

class SecurityManager {
  private config: SecurityConfig;

  constructor() {
    this.config = {
      enableCSP: true,
      enableXSSProtection: true,
      enableFrameGuard: true,
      enableContentTypeSniffing: true,
      enableHSTS: import.meta.env.VITE_APP_ENV === 'production',
      trustedDomains: [
        'self',
        import.meta.env.VITE_API_BASE_URL || '',
        '*.unsplash.com',
        '*.googleapis.com',
        '*.gstatic.com'
      ].filter(Boolean)
    };

    this.initializeSecurity();
  }

  private initializeSecurity() {
    this.setupCSP();
    this.setupInputSanitization();
    this.setupErrorHandling();
    this.monitorSecurityViolations();
  }

  private setupCSP() {
    if (!this.config.enableCSP) return;

    const cspDirectives = [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https:`,
      `style-src 'self' 'unsafe-inline' https:`,
      `img-src 'self' data: https:`,
      `font-src 'self' https:`,
      `connect-src 'self' ${this.config.trustedDomains.join(' ')} https:`,
      `frame-src 'self'`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`
    ];

    const csp = cspDirectives.join('; ');
    
    // Set CSP via meta tag (runtime)
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);

    logger.info('Content Security Policy initialized', { csp });
  }

  private setupInputSanitization() {
    // Prevent XSS in dynamic content
    window.addEventListener('beforeunload', () => {
      // Clear any sensitive data from memory
      try {
        sessionStorage.clear();
        // Keep only essential localStorage items
        const essentialKeys = ['theme', 'language'];
        const itemsToKeep: Record<string, string> = {};
        
        essentialKeys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) itemsToKeep[key] = value;
        });
        
        localStorage.clear();
        
        Object.entries(itemsToKeep).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
      } catch (error) {
        logger.error('Error clearing sensitive data', error instanceof Error ? error : new Error('Unknown error'));
      }
    });
  }

  private setupErrorHandling() {
    // Prevent information leakage in errors
    window.addEventListener('error', (event) => {
      // Log error securely without exposing sensitive information
      logger.error('Global error caught', new Error('Application error'), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        // Don't log the actual error message in production to prevent info leakage
        message: import.meta.env.VITE_APP_ENV === 'production' ? 'Error occurred' : event.message
      });

      // Prevent default error display in production
      if (import.meta.env.VITE_APP_ENV === 'production') {
        event.preventDefault();
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', new Error('Promise rejection'), {
        reason: import.meta.env.VITE_APP_ENV === 'production' ? 'Promise rejected' : String(event.reason)
      });

      // Prevent default handling in production
      if (import.meta.env.VITE_APP_ENV === 'production') {
        event.preventDefault();
      }
    });
  }

  private monitorSecurityViolations() {
    // CSP violation reporting
    document.addEventListener('securitypolicyviolation', (event) => {
      logger.error('CSP violation detected', new Error('Content Security Policy violation'), {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition
      });
    });
  }

  // Sanitize HTML content to prevent XSS
  sanitizeHTML(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  // Validate URL to prevent open redirects
  validateURL(url: string): boolean {
    try {
      const parsedURL = new URL(url);
      const allowedProtocols = ['http:', 'https:'];
      const allowedDomains = this.config.trustedDomains;

      // Check protocol
      if (!allowedProtocols.includes(parsedURL.protocol)) {
        return false;
      }

      // Check domain if it's an absolute URL
      if (parsedURL.hostname) {
        const isAllowed = allowedDomains.some(domain => {
          if (domain === 'self') return false; // Skip 'self' for this check
          if (domain.startsWith('*.')) {
            const baseDomain = domain.substring(2);
            return parsedURL.hostname.endsWith(baseDomain);
          }
          return parsedURL.hostname === domain;
        });

        if (!isAllowed) {
          logger.warn('Blocked potentially unsafe URL', { url, hostname: parsedURL.hostname });
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.warn('Invalid URL format', { url });
      return false;
    }
  }

  // Generate secure headers for API requests
  getSecureHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    return headers;
  }

  // Rate limiting for API calls
  private rateLimits = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(endpoint: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = endpoint;
    const limit = this.rateLimits.get(key);

    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (limit.count >= maxRequests) {
      logger.warn('Rate limit exceeded', { endpoint, count: limit.count, maxRequests });
      return false;
    }

    limit.count++;
    return true;
  }

  // Secure local storage wrapper
  secureStorage = {
    setItem: (key: string, value: string, encrypt: boolean = false) => {
      try {
        const finalValue = encrypt ? btoa(value) : value;
        localStorage.setItem(key, finalValue);
      } catch (error) {
        logger.error('Secure storage set error', error instanceof Error ? error : new Error('Storage error'));
      }
    },

    getItem: (key: string, encrypted: boolean = false): string | null => {
      try {
        const value = localStorage.getItem(key);
        if (!value) return null;
        return encrypted ? atob(value) : value;
      } catch (error) {
        logger.error('Secure storage get error', error instanceof Error ? error : new Error('Storage error'));
        return null;
      }
    },

    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        logger.error('Secure storage remove error', error instanceof Error ? error : new Error('Storage error'));
      }
    }
  };
}

// Global security manager instance
export const securityManager = new SecurityManager();

// Security utilities for components
export const withSecurity = {
  // HOC for secure URL handling
  secureLink: (url: string, fallbackUrl: string = '/'): string => {
    return securityManager.validateURL(url) ? url : fallbackUrl;
  },

  // Secure form submission
  secureSubmit: async (endpoint: string, data: Record<string, any>) => {
    if (!securityManager.checkRateLimit(endpoint)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    const headers = securityManager.getSecureHeaders();
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      logger.error('Secure form submission failed', error instanceof Error ? error : new Error('Submission error'));
      throw error;
    }
  }
};

export default SecurityManager;
