import React, { useEffect } from 'react';
import { useTour, TourStep } from '@/contexts/TourContext';
import TourOverlay from '@/components/ui/tourOverlay';

const OnboardingTour: React.FC = () => {
  const { startTour, isCompleted } = useTour();

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '🎉 Welcome to Your Business Management Platform!',
      content: 'Welcome to your comprehensive business management platform! This tour will guide you through the key features to help you get started quickly and efficiently.',
      target: 'body',
      placement: 'bottom',
      showSkip: true,
      showBack: false
    },
    {
      id: 'theme-toggle',
      title: '🌙 Theme Customization',
      content: 'Switch between light and dark themes to match your preference. The platform adapts to your chosen theme across all features.',
      target: '[data-tour="theme-toggle"]',
      placement: 'bottom',
      showSkip: true,
      showBack: true
    },
    {
      id: 'navigation',
      title: '🧭 Navigation Menu',
      content: 'Access different sections of the platform through the navigation menu. Each section provides specialized tools for different aspects of your business management.',
      target: '[data-tour="navigation-menu"]',
      placement: 'bottom',
      showSkip: true,
      showBack: true
    },
    {
      id: 'business-dashboard',
      title: '🏢 Business Dashboard',
      content: 'This is your business control center! Here you can view business metrics, manage business stages, and track overall performance. Create and manage multiple businesses from this central hub.',
      target: '[data-tour="business-dashboard"]',
      placement: 'top',
      showSkip: true,
      showBack: true
    },
    {
      id: 'agent-dashboard',
      title: '🤖 Agent Dashboard',
      content: 'Manage your AI agents here! View agent capabilities, performance metrics, and assign agents to different tasks. Each agent can be specialized for specific business functions.',
      target: '[data-tour="agent-dashboard"]',
      placement: 'top',
      showSkip: true,
      showBack: true
    },
    {
      id: 'task-manager',
      title: '📋 Enhanced Task Manager',
      content: 'Your central task management hub! Create, assign, and track tasks across different business processes. Use workflow visualizations to optimize your business operations.',
      target: '[data-tour="task-manager"]',
      placement: 'top',
      showSkip: true,
      showBack: true
    },
    {
      id: 'task-workflow',
      title: '🔄 Task Workflow Visualization',
      content: 'Visualize your task workflows and dependencies. This helps you understand how tasks connect and identify bottlenecks in your business processes.',
      target: '[data-tour="task-workflow"]',
      placement: 'top',
      showSkip: true,
      showBack: true
    },
    {
      id: 'get-started',
      title: '🚀 You\'re All Set!',
      content: 'Congratulations! You now know the key features of the platform. Start by creating your first business, setting up agents, or managing tasks. You can restart this tour anytime from the help menu.',
      target: '[data-tour="business-dashboard"]',
      placement: 'top',
      showSkip: false,
      showBack: true
    }
  ];

  useEffect(() => {
    // Auto-start tour for new users
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    const hasSkippedOnboarding = localStorage.getItem('onboarding-skipped');
    
    if (!hasCompletedOnboarding && !hasSkippedOnboarding && !isCompleted) {
      // Small delay to ensure components are mounted
      const timer = setTimeout(() => {
        startTour(tourSteps);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [startTour, isCompleted]);

  return <TourOverlay />;
};

export default OnboardingTour;