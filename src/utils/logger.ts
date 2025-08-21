type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  extra?: Record<string, unknown>;
}

class Logger {
  private isEnabled: boolean;
  private logLevel: LogLevel;
  private isProduction: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_LOGGING === 'true';
    this.logLevel = import.meta.env.VITE_LOG_LEVEL as LogLevel;
    this.isProduction = import.meta.env.VITE_APP_ENV === 'production';
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isEnabled) return false;

    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    return levels[level] >= levels[this.logLevel];
  }

  private formatMessage(level: LogLevel, message: string, extra?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      extra
    };
  }

  private sendToExternalService(logEntry: LogEntry) {
    // In production, send logs to external service (e.g., Sentry, LogRocket)
    if (this.isProduction && window.Sentry) {
      const { level, message, extra } = logEntry;

      if (level === 'error') {
        window.Sentry.captureException(new Error(message), { extra });
      } else {
        window.Sentry.addBreadcrumb({
          message,
          level: level as any,
          data: extra
        });
      }
    }
  }

  debug(message: string, extra?: Record<string, unknown>) {
    if (!this.shouldLog('debug')) return;

    const logEntry = this.formatMessage('debug', message, extra);
    console.debug(`[DEBUG] ${message}`, extra);
    this.sendToExternalService(logEntry);
  }

  info(message: string, extra?: Record<string, unknown>) {
    if (!this.shouldLog('info')) return;

    const logEntry = this.formatMessage('info', message, extra);
    console.info(`[INFO] ${message}`, extra);
    this.sendToExternalService(logEntry);
  }

  warn(message: string, extra?: Record<string, unknown>) {
    if (!this.shouldLog('warn')) return;

    const logEntry = this.formatMessage('warn', message, extra);
    console.warn(`[WARN] ${message}`, extra);
    this.sendToExternalService(logEntry);
  }

  error(message: string, error?: Error, extra?: Record<string, unknown>) {
    if (!this.shouldLog('error')) return;

    const logEntry = this.formatMessage('error', message, { error: error?.message, ...extra });
    console.error(`[ERROR] ${message}`, error, extra);
    this.sendToExternalService(logEntry);
  }

  // Performance logging
  time(label: string) {
    if (this.shouldLog('debug')) {
      console.time(label);
    }
  }

  timeEnd(label: string) {
    if (this.shouldLog('debug')) {
      console.timeEnd(label);
    }
  }
}

// Global logger instance
export const logger = new Logger();

// Performance monitoring
export const performance = {
  measure: (name: string, startTime: number) => {
    const duration = Date.now() - startTime;
    logger.debug(`Performance: ${name}`, { duration: `${duration}ms` });

    // Send to analytics in production
    if (import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name,
        value: duration
      });
    }
  },

  markStart: (name: string) => {
    performance.mark?.(`${name}-start`);
    return Date.now();
  },

  markEnd: (name: string, startTime: number) => {
    performance.mark?.(`${name}-end`);
    const duration = Date.now() - startTime;

    try {
      performance.measure?.(name, `${name}-start`, `${name}-end`);
    } catch (e) {
      // Fallback for browsers that don't support performance.measure
      logger.debug(`Performance: ${name}`, { duration: `${duration}ms` });
    }

    return duration;
  }
};