import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// Page imports
import HomePage from '@/pages/HomePage';
const NotFound = lazy(() => import('@/pages/NotFound'));
const ApiConfigPage = lazy(() => import('@/pages/ApiConfigPage'));
const ApiTestingPage = lazy(() => import('@/pages/ApiTestingPage'));
const TestingPage = lazy(() => import('@/pages/TestingPage'));
const DocumentationPage = lazy(() => import('@/pages/DocumentationPage'));
const AgentMarketplace = lazy(() => import('@/pages/AgentMarketplace'));
const AgentDetails = lazy(() => import('@/pages/AgentDetails'));
const AgentOnboarding = lazy(() => import('@/pages/AgentOnboarding'));
const AgentAnalytics = lazy(() => import('@/pages/AgentAnalytics'));
const OrchestrationPage = lazy(() => import('@/pages/OrchestrationPage'));

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
                  <Route path="/apiconfig" element={<ApiConfigPage />} />
                  <Route path="/apitesting" element={<ApiTestingPage />} />
                  <Route path="/testing" element={<TestingPage />} />
                  <Route path="/documentation" element={<DocumentationPage />} />
                  <Route path="/agent-marketplace" element={<AgentMarketplace />} />
                  <Route path="/agent-marketplace/agent/:id" element={<AgentDetails />} />
                  <Route path="/agent-marketplace/onboarding" element={<AgentOnboarding />} />
                  <Route path="/agent-marketplace/analytics" element={<AgentAnalytics />} />
                  <Route path="/orchestration" element={<OrchestrationPage />} />
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