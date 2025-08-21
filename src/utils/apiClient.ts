import { logger } from './logger';
import { analytics } from './analytics';
import { securityManager } from './security';

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  withCredentials?: boolean;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
    this.defaultTimeout = 30000; // 30 seconds
  }

  /**
   * Creates the full URL with query parameters
   */
  private createUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    // Ensure endpoint starts with a slash if it's a relative path
    if (!endpoint.startsWith('http') && !endpoint.startsWith('/')) {
      endpoint = `/${endpoint}`;
    }

    // For absolute URLs, use as is
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    // Add query parameters if provided
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      return `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`;
    }

    return url;
  }

  /**
   * Execute a fetch request with timeout and error handling
   */
  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      // Check for HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Generic request method
   */
  public async request<T = any>(
    method: string,
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const startTime = Date.now();
    const {
      params,
      withCredentials = true,
      timeout = this.defaultTimeout,
      headers = {},
      ...restOptions
    } = options;

    // Check rate limiting
    if (!securityManager.checkRateLimit(endpoint)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    const url = this.createUrl(endpoint, params);
    
    // Validate URL before fetching
    if (!securityManager.validateURL(url)) {
      logger.error('Invalid URL detected', new Error('Security validation failed'), { url });
      throw new Error('Invalid URL');
    }

    // Merge headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers
    };

    // Set up request options
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: withCredentials ? 'include' : 'same-origin',
      ...restOptions
    };

    try {
      // Log request (excluding sensitive data)
      logger.debug(`API ${method} request to ${endpoint}`, {
        method,
        endpoint,
        hasBody: !!restOptions.body
      });

      // Execute request with timeout
      const response = await this.fetchWithTimeout(url, fetchOptions, timeout);
      
      // Track API performance
      const duration = Date.now() - startTime;
      analytics.trackPerformance(`api_${method.toLowerCase()}_${endpoint}`, duration);

      // Parse JSON response
      const result = await response.json();
      return result as T;
    } catch (error) {
      // Track error
      const duration = Date.now() - startTime;
      analytics.trackError(error instanceof Error ? error : new Error('API request failed'), {
        method,
        endpoint,
        duration
      });

      // Log error
      logger.error(`API ${method} request to ${endpoint} failed`, error instanceof Error ? error : new Error('Unknown error'), {
        method,
        endpoint,
        duration
      });

      throw error;
    }
  }

  // HTTP method shortcuts
  public get<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  public post<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, {
      ...options,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public put<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, {
      ...options,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public patch<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, {
      ...options,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public delete<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }
}

// Global API client instance
export const apiClient = new ApiClient();

export default ApiClient;
