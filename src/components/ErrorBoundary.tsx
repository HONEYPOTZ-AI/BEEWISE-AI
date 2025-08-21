import React from 'react';
import { AlertTriangle, RefreshCw, Home, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { logger } from '@/utils/logger';
import { performanceMonitor } from '@/utils/performance';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{error: Error;errorInfo?: React.ErrorInfo;retry: () => void;errorId?: string;}>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  name?: string; // Component name for better error reporting
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;

    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Collect performance metrics at time of error
    const performanceData = performanceMonitor.getMetrics();

    // Create rich error context
    const errorContext = {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'ErrorBoundary',
      errorId,
      performanceMetrics: performanceData,
      environment: import.meta.env.VITE_APP_ENV,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    // Log error with context
    logger.error('React Error Boundary caught an error', error, errorContext);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Send to external error tracking service if available
    if (typeof window.Sentry !== 'undefined') {
      window.Sentry.withScope((scope) => {
        scope.setTag('errorBoundary', this.props.name || 'ErrorBoundary');
        scope.setTag('errorId', errorId);
        scope.setContext('react', {
          componentStack: errorInfo.componentStack
        });
        scope.setContext('performance', performanceData);
        window.Sentry.captureException(error);
      });
    }
  }

  retry = () => {
    // Log retry attempt
    logger.info('User attempted to recover from error', {
      errorId: this.state.errorId,
      component: this.props.name
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent
          error={this.state.error!}
          errorInfo={this.state.errorInfo!}
          retry={this.retry}
          errorId={this.state.errorId} />;

      }

      // Default error UI
      return <DefaultErrorFallback
        error={this.state.error!}
        errorInfo={this.state.errorInfo}
        retry={this.retry}
        errorId={this.state.errorId} />;

    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo?: React.ErrorInfo | null;
  retry: () => void;
  errorId?: string;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo, retry, errorId }) => {
  const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';
  const isDetailedErrorsEnabled = import.meta.env.VITE_ENABLE_DETAILED_ERRORS === 'true';
  const showErrorDetails = isDevelopment || isDetailedErrorsEnabled;

  // Function to handle reporting the error manually
  const reportError = () => {
    // Log that user manually reported error
    logger.info('User manually reported error', { errorId });

    // Open a mailto link with error details (for environments without Sentry)
    const subject = encodeURIComponent(`Error Report: ${errorId}`);
    const body = encodeURIComponent(`
Error ID: ${errorId}
Time: ${new Date().toISOString()}
URL: ${window.location.href}
Error: ${error.message}
${error.stack ? `\nStack: ${error.stack}` : ''}
    `);
    window.location.href = `mailto:support@example.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            We're sorry, but something unexpected happened. Please try refreshing the page.
            {errorId && <div className="text-xs mt-2 opacity-60">Error ID: {errorId}</div>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showErrorDetails &&
          <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Error Details:</p>
              <p className="text-xs font-mono text-red-600 break-words">{error.message}</p>
              {error.stack &&
            <details className="mt-2">
                  <summary className="text-xs font-medium cursor-pointer">Stack Trace</summary>
                  <pre className="text-xs mt-2 whitespace-pre-wrap break-words">{error.stack}</pre>
                </details>
            }
              {errorInfo && errorInfo.componentStack &&
            <details className="mt-2">
                  <summary className="text-xs font-medium cursor-pointer">Component Stack</summary>
                  <pre className="text-xs mt-2 whitespace-pre-wrap break-words">{errorInfo.componentStack}</pre>
                </details>
            }
            </div>
          }
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={retry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex-1">

              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground text-xs"
            onClick={reportError}>

            <Send className="w-3 h-3 mr-2" />
            Report this issue
          </Button>
        </CardFooter>
      </Card>
    </div>);

};

// Create component-specific error boundaries
export const createErrorBoundary = (name: string, fallback?: React.ComponentType<ErrorFallbackProps>) => {
  const ComponentErrorBoundary = (props: Omit<ErrorBoundaryProps, 'name'>) =>
  <ErrorBoundary {...props} name={name} fallback={fallback} />;


  ComponentErrorBoundary.displayName = `ErrorBoundary(${name})`;
  return ComponentErrorBoundary;
};

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object,>(
Component: React.ComponentType<P>,
options?: {
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  name?: string;
}) =>
{
  const componentName = options?.name || Component.displayName || Component.name;

  const WrappedComponent = (props: P) =>
  <ErrorBoundary
    fallback={options?.fallback}
    onError={options?.onError}
    name={componentName}>

      <Component {...props} />
    </ErrorBoundary>;


  WrappedComponent.displayName = `withErrorBoundary(${componentName})`;
  return WrappedComponent;
};

export default ErrorBoundary;