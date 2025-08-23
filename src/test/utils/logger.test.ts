
import { describe, it, expect, vi } from 'vitest';
import { logger } from '@/utils/logger';

// Mock console methods
const mockConsole = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn()
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(console, mockConsole);
});

describe('logger', () => {
  it('logs info messages', () => {
    logger.info('Test info message');
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining('Test info message')
    );
  });

  it('logs error messages', () => {
    logger.error('Test error message');
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.stringContaining('Test error message')
    );
  });

  it('logs warning messages', () => {
    logger.warn('Test warning message');
    expect(mockConsole.warn).toHaveBeenCalledWith(
      expect.stringContaining('Test warning message')
    );
  });

  it('logs debug messages', () => {
    logger.debug('Test debug message');
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining('Test debug message')
    );
  });

  it('includes timestamp in log messages', () => {
    logger.info('Timestamped message');
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
    );
  });

  it('includes log level in messages', () => {
    logger.error('Error with level');
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR]')
    );
  });

  it('handles object logging', () => {
    const testObject = { key: 'value', number: 42 };
    logger.info('Object test', testObject);
    expect(mockConsole.info).toHaveBeenCalled();
  });
});