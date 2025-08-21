import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ApiConfigPage from "./pages/ApiConfigPage";
import { useEffect } from "react";
import { analytics } from "@/utils/analytics";
import { logger } from "@/utils/logger";
import { securityManager } from "@/utils/security";

// Initialize query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: import.meta.env.VITE_APP_ENV === 'production',
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error: Error) => {
        logger.error('Query error', error);
      }
    },
    mutations: {
      retry: 0,
      onError: (error: Error) => {
        logger.error('Mutation error', error);
      }
    }
  }
});

// Analytics page view tracker component
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when route changes
    analytics.trackPageView(location.pathname);
    logger.info(`Page view: ${location.pathname}`);

    // Clean up on route change
    return () => {

      // Perform any cleanup needed
    };}, [location]);

  return null;
};

const HealthCheckRoute = React.lazy(() => import('./components/HealthCheck'));

const App = () =>
<QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <ErrorBoundary>
          <BrowserRouter>
            <PageViewTracker />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/api-config" element={<ApiConfigPage />} />
              <Route path="/health" element={
            <React.Suspense fallback={<div>Loading health check...</div>}>
                  <HealthCheckRoute />
                </React.Suspense>
            } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>;

export default App;