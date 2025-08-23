
export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

export const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
}

export const mockAnalytics = {
  track: vi.fn(),
  page: vi.fn(),
  identify: vi.fn(),
}

export const mockPerformanceMonitor = {
  startTiming: vi.fn(),
  endTiming: vi.fn(),
  recordMetric: vi.fn(),
}

export const mockSecurityManager = {
  sanitizeInput: vi.fn((input: string) => input),
  validateCSRFToken: vi.fn(() => true),
  encryptSensitiveData: vi.fn((data: string) => `encrypted_${data}`),
}
