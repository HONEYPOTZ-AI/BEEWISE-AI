import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// Page imports
import HomePage from '@/pages/HomePage';
const AgentMarketplacePage = lazy(() => import('@/pages/AgentMarketplacePage'));
const BusinessLifecyclePage = lazy(() => import('@/pages/BusinessLifecyclePage'));
const TaskManagementPage = lazy(() => import('@/pages/TaskManagementPage'));
const MemoryContextPage = lazy(() => import('@/pages/MemoryContextPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const ApiConfigPage = lazy(() => import('@/pages/ApiConfigPage'));
const ApiTestingPage = lazy(() => import('@/pages/ApiTestingPage'));
const TestingPage = lazy(() => import('@/pages/TestingPage'));
const DocumentationPage = lazy(() => import('@/pages/DocumentationPage'));
const AgentDetails = lazy(() => import('@/pages/AgentDetails'));
const AgentOnboarding = lazy(() => import('@/pages/AgentOnboarding'));
const AgentAnalytics = lazy(() => import('@/pages/AgentAnalytics'));
const OrchestrationPage = lazy(() => import('@/pages/OrchestrationPage'));
const MemoryManagementPage = lazy(() => import('@/pages/MemoryManagementPage'));
const ContextSessionsPage = lazy(() => import('@/pages/ContextSessionsPage'));
const MemorySessionsDashboard = lazy(() => import('@/pages/MemorySessionsDashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Utilities
import { analytics } from '@/utils/analytics';
import { logger } from '@/utils/logger';
import { securityManager } from '@/utils/security';

// Initialize query client for API data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
});

function App() {
  useEffect(() => {
    // Initialize app-wide monitoring and tracking
    logger.info('Application initialized', { version: import.meta.env.VITE_APP_VERSION || '1.0.0' });
    analytics.trackPageView(window.location.pathname);

    // Track page view on navigation
    const handleNavigation = () => {
      analytics.trackPageView(window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/agent-marketplace" element={<AgentMarketplacePage />} />
                  <Route path="/agent-details/:id" element={<AgentDetails />} />
                  <Route path="/agent-onboarding" element={<AgentOnboarding />} />
                  <Route path="/agent-analytics" element={<AgentAnalytics />} />
                  <Route path="/orchestration" element={<OrchestrationPage />} />
                  <Route path="/business-lifecycle" element={<BusinessLifecyclePage />} />
                  <Route path="/task-management" element={<TaskManagementPage />} />
                  <Route path="/memory-context" element={<MemoryContextPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/api-config" element={<ApiConfigPage />} />
                  <Route path="/api-testing" element={<ApiTestingPage />} />
                  <Route path="/testing" element={<TestingPage />} />
                  <Route path="/documentation" element={<DocumentationPage />} />
                  <Route path="/memory-management" element={<MemoryManagementPage />} />
                  <Route path="/context-sessions" element={<ContextSessionsPage />} />
                  <Route path="/memory-sessions" element={<MemorySessionsDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>);

}

export default App;