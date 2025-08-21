import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCcw, Server, Database, HardDrive, Network, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { logger } from '@/utils/logger';
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { performanceMonitor } from '@/utils/performance';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  checks: HealthCheck[];
  timestamp: string;
  version: string;
  environment: string;
  serverInfo?: ServerInfo;
}

interface ServerInfo {
  uptime?: number;
  memory?: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
  };
  responseTime?: string;
}

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  duration: number;
  error?: string;
  details?: Record<string, any>;
}

const HEALTH_CHECK_INTERVAL = parseInt(import.meta.env.VITE_HEALTH_CHECK_INTERVAL || '60000', 10);

const HealthCheck: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend'>('frontend');

  // Check frontend health
  const checkFrontendHealth = async (): Promise<HealthCheck[]> => {
    const startTime = Date.now();
    const checks: HealthCheck[] = [];

    // Check 1: Local Storage
    try {
      const checkStart = Date.now();
      localStorage.setItem('health-check', 'test');
      localStorage.removeItem('health-check');
      checks.push({
        name: 'Local Storage',
        status: 'pass',
        duration: Date.now() - checkStart
      });
    } catch (error) {
      checks.push({
        name: 'Local Storage',
        status: 'fail',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check 2: Network Connectivity
    try {
      const checkStart = Date.now();
      // Use a tiny request to check network
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', { 
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      clearTimeout(timeoutId);
      
      checks.push({
        name: 'Network Connectivity',
        status: response.ok ? 'pass' : 'warn',
        duration: Date.now() - checkStart,
        error: response.ok ? undefined : `HTTP ${response.status}`
      });
    } catch (error) {
      checks.push({
        name: 'Network Connectivity',
        status: 'warn',
        duration: Date.now() - startTime,
        error: error instanceof Error && error.name === 'AbortError' 
          ? 'Network request timed out' 
          : error instanceof Error ? error.message : 'Network connectivity issue'
      });
    }

    // Check 3: Performance
    try {
      const checkStart = Date.now();
      // Test JavaScript execution performance
      const iterations = 100000;
      for (let i = 0; i < iterations; i++) {
        Math.random();
      }
      const duration = Date.now() - checkStart;
      checks.push({
        name: 'JavaScript Performance',
        status: duration < 100 ? 'pass' : duration < 500 ? 'warn' : 'fail',
        duration,
        error: duration >= 500 ? 'Performance degraded' : undefined,
        details: {
          iterations,
          threshold: '100ms optimal, 500ms acceptable'
        }
      });
    } catch (error) {
      checks.push({
        name: 'JavaScript Performance',
        status: 'fail',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Performance test failed'
      });
    }

    // Check 4: Memory Usage (if available)
    if ('memory' in performance) {
      try {
        const memory = (performance as any).memory;
        const usedMemory = memory.usedJSHeapSize / 1024 / 1024; // MB
        const totalMemory = memory.totalJSHeapSize / 1024 / 1024; // MB
        const memoryUsagePercent = (usedMemory / totalMemory) * 100;

        checks.push({
          name: 'Memory Usage',
          status: memoryUsagePercent < 80 ? 'pass' : memoryUsagePercent < 90 ? 'warn' : 'fail',
          duration: 0,
          error: memoryUsagePercent >= 90 ? `High memory usage: ${memoryUsagePercent.toFixed(1)}%` : undefined,
          details: {
            used: `${usedMemory.toFixed(1)} MB`,
            total: `${totalMemory.toFixed(1)} MB`,
            percentage: `${memoryUsagePercent.toFixed(1)}%`
          }
        });
      } catch (error) {
        checks.push({
          name: 'Memory Usage',
          status: 'warn',
          duration: 0,
          error: 'Unable to check memory usage'
        });
      }
    }

    // Check 5: Performance Metrics
    try {
      const metrics = performanceMonitor.getMetrics();
      const fcp = metrics.firstContentfulPaint || 0;
      const lcp = metrics.largestContentfulPaint || 0;
      const fid = metrics.firstInputDelay || 0;
      const cls = metrics.cumulativeLayoutShift || 0;
      
      // Create status based on Core Web Vitals thresholds
      // https://web.dev/vitals/
      const fcpStatus = fcp < 1800 ? 'pass' : fcp < 3000 ? 'warn' : 'fail';
      const lcpStatus = lcp < 2500 ? 'pass' : lcp < 4000 ? 'warn' : 'fail';
      const fidStatus = fid < 100 ? 'pass' : fid < 300 ? 'warn' : 'fail';
      const clsStatus = cls < 0.1 ? 'pass' : cls < 0.25 ? 'warn' : 'fail';
      
      // Overall performance status is the worst of all metrics
      const statuses = [fcpStatus, lcpStatus, fidStatus, clsStatus];
      const worstStatus = statuses.includes('fail') ? 'fail' : statuses.includes('warn') ? 'warn' : 'pass';
      
      checks.push({
        name: 'Performance Metrics',
        status: worstStatus,
        duration: 0,
        error: worstStatus === 'fail' ? 'Core Web Vitals not meeting targets' : 
               worstStatus === 'warn' ? 'Core Web Vitals need improvement' : undefined,
        details: {
          FCP: `${fcp.toFixed(0)}ms (${fcpStatus})`,
          LCP: `${lcp.toFixed(0)}ms (${lcpStatus})`,
          FID: `${fid.toFixed(0)}ms (${fidStatus})`,
          CLS: `${cls.toFixed(3)} (${clsStatus})`
        }
      });
    } catch (error) {
      checks.push({
        name: 'Performance Metrics',
        status: 'warn',
        duration: 0,
        error: 'Unable to collect performance metrics'
      });
    }

    return checks;
  };

  // Check backend health using API
  const checkBackendHealth = async (): Promise<{ checks: HealthCheck[], serverInfo?: ServerInfo }> => {
    try {
      // Call the backend health check API
      const response = await window.ezsite.apis.run({
        path: "health-check.js",
        param: []
      });

      if (response.error) {
        return {
          checks: [{
            name: 'Backend API',
            status: 'fail',
            duration: 0,
            error: response.error
          }]
        };
      }

      // Map the backend health checks to our format
      const backendChecks = response.data.checks.map((check: any) => ({
        name: `Backend: ${check.name.charAt(0).toUpperCase() + check.name.slice(1).replace('_', ' ')}`,
        status: check.status as 'pass' | 'fail' | 'warn',
        duration: check.responseTime || 0,
        error: check.status === 'fail' ? `${check.name} failure` : undefined
      }));

      return {
        checks: backendChecks,
        serverInfo: {
          uptime: response.data.uptime,
          memory: response.data.memory,
          responseTime: response.data.responseTime
        }
      };
    } catch (error) {
      logger.error('Backend health check failed', error);
      return {
        checks: [{
          name: 'Backend API',
          status: 'fail',
          duration: 0,
          error: error instanceof Error ? error.message : 'Unknown backend error'
        }]
      };
    }
  };

  const performHealthCheck = useCallback(async (): Promise<HealthStatus> => {
    const startTime = Date.now();
    
    // Run frontend and backend checks in parallel
    const [frontendChecks, backendResult] = await Promise.all([
      checkFrontendHealth(),
      checkBackendHealth()
    ]);
    
    // Combine all checks
    const allChecks = [...frontendChecks, ...backendResult.checks];

    // Determine overall status
    const hasFailures = allChecks.some(check => check.status === 'fail');
    const hasWarnings = allChecks.some(check => check.status === 'warn');
    
    let overallStatus: HealthStatus['status'];
    if (hasFailures) {
      overallStatus = 'unhealthy';
    } else if (hasWarnings) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      status: overallStatus,
      checks: allChecks,
      timestamp: new Date().toISOString(),
      version: import.meta.env.VITE_APP_VERSION || '0.1.0',
      environment: import.meta.env.VITE_APP_ENV || 'development',
      serverInfo: backendResult.serverInfo
    };
  }, []);

  const runHealthCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await performHealthCheck();
      setHealthStatus(status);
      setLastUpdated(new Date());
      
      logger.info('Health check completed', {
        status: status.status,
        totalChecks: status.checks.length,
        failedChecks: status.checks.filter(c => c.status === 'fail').length,
        environment: status.environment
      });
    } catch (error) {
      logger.error('Health check failed', error instanceof Error ? error : new Error('Unknown error'));
      setHealthStatus({
        status: 'unhealthy',
        checks: [{
          name: 'Health Check System',
          status: 'fail',
          duration: 0,
          error: error instanceof Error ? error.message : 'Health check system failure'
        }],
        timestamp: new Date().toISOString(),
        version: import.meta.env.VITE_APP_VERSION || '0.1.0',
        environment: import.meta.env.VITE_APP_ENV || 'development'
      });
    } finally {
      setIsLoading(false);
    }
  }, [performHealthCheck]);

  useEffect(() => {
    runHealthCheck();
    
    // Auto-refresh based on environment variable
    const interval = setInterval(runHealthCheck, HEALTH_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [runHealthCheck]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warn':
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'fail':
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes('Storage') || name.includes('Local')) return <HardDrive className="w-4 h-4" />;
    if (name.includes('Memory')) return <Server className="w-4 h-4" />;
    if (name.includes('Database')) return <Database className="w-4 h-4" />;
    if (name.includes('Network') || name.includes('API')) return <Network className="w-4 h-4" />;
    if (name.includes('Performance')) return <Activity className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
      case 'healthy':
        return 'bg-green-500';
      case 'warn':
      case 'degraded':
        return 'bg-yellow-500';
      case 'fail':
      case 'unhealthy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'pass':
      case 'healthy':
        return 'default';
      case 'warn':
      case 'degraded':
        return 'secondary';
      case 'fail':
      case 'unhealthy':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading && !healthStatus) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 animate-spin" />
            Running Health Check...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Filter checks based on active tab
  const filteredChecks = healthStatus?.checks.filter(check => 
    activeTab === 'frontend' 
      ? !check.name.startsWith('Backend:') 
      : check.name.startsWith('Backend:')
  ) || [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto mt-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(healthStatus?.status || 'unknown')}
              System Health
              <Badge variant={getStatusVariant(healthStatus?.status || 'unknown')}>
                {healthStatus?.status || 'unknown'}
              </Badge>
            </CardTitle>
            <Button onClick={runHealthCheck} disabled={isLoading} size="sm">
              {isLoading ? (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            {healthStatus?.status === 'healthy' 
              ? 'All systems are operating normally.' 
              : healthStatus?.status === 'degraded'
              ? 'Some systems are experiencing issues but the application is functioning.'
              : 'Critical systems are not functioning properly.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthStatus && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Application</p>
                  <p>Version: {healthStatus.version}</p>
                  <p>Environment: {healthStatus.environment}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Status</p>
                  <p>Last Check: {lastUpdated?.toLocaleString()}</p>
                  <p>Checks: {healthStatus.checks.length} ({healthStatus.checks.filter(c => c.status === 'pass').length} passing)</p>
                </div>
                {healthStatus.serverInfo && (
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Server</p>
                    {healthStatus.serverInfo.uptime !== undefined && (
                      <p>Uptime: {Math.floor(healthStatus.serverInfo.uptime / 3600)}h {Math.floor((healthStatus.serverInfo.uptime % 3600) / 60)}m</p>
                    )}
                    {healthStatus.serverInfo.memory && (
                      <p>Memory: {healthStatus.serverInfo.memory.heapUsed} used</p>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="border rounded-md">
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'frontend' ? 'border-b-2 border-primary' : ''}`}
                  onClick={() => setActiveTab('frontend')}
                >
                  Frontend
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'backend' ? 'border-b-2 border-primary' : ''}`}
                  onClick={() => setActiveTab('backend')}
                >
                  Backend
                </button>
              </div>
              
              <div className="divide-y">
                {filteredChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(check.status)}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(check.name)}
                          <span className="font-medium">{check.name.replace('Backend: ', '')}</span>
                        </div>
                        {check.error && (
                          <span className="text-xs text-red-500">{check.error}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">
                        {check.duration}ms
                      </div>
                      {check.details && (
                        <details className="text-left">
                          <summary className="text-xs cursor-pointer mt-1">Details</summary>
                          <div className="text-xs mt-1 space-y-1 pl-2">
                            {Object.entries(check.details).map(([key, value]) => (
                              <p key={key}>
                                <span className="font-medium">{key}:</span> {value}
                              </p>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredChecks.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">
                    No health checks available for this category.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          Health checks run automatically every {HEALTH_CHECK_INTERVAL / 1000} seconds. Last updated: {lastUpdated?.toLocaleTimeString()}
        </CardFooter>
      </Card>

      {/* Status indicator for embedding in other components */}
      <div className="fixed bottom-4 right-4 z-50">
        <div 
          className={`w-3 h-3 rounded-full ${getStatusColor(healthStatus?.status || 'unknown')} animate-pulse`}
          title={`System Status: ${healthStatus?.status || 'unknown'}`}
        />
      </div>
    </div>
  );
};

// Export with error boundary
export default withErrorBoundary(HealthCheck, {
  name: 'HealthCheckPage',
  onError: (error) => {
    logger.error('Health check component failed', error);
  }
});
