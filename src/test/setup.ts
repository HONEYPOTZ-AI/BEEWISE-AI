
import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Mock window.ezsite APIs
Object.defineProperty(window, 'ezsite', {
  value: {
    apis: {
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      getUserInfo: vi.fn(),
      sendResetPwdEmail: vi.fn(),
      resetPassword: vi.fn(),
      tablePage: vi.fn(),
      tableCreate: vi.fn(),
      tableUpdate: vi.fn(),
      tableDelete: vi.fn(),
      upload: vi.fn(),
      getUploadUrl: vi.fn(),
      run: vi.fn()
    }
  },
  writable: true
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};