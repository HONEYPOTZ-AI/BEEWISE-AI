import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useTour, TourStep } from '@/contexts/TourContext';

const TourRestartButton: React.FC = () => {
  const { startTour, isActive } = useTour();

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '🎉 Welcome Back to the Tour!',
      content: 'Let\'s walk through the key features of your business management platform again. This tour will help you discover all the powerful tools available.',
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
      title: '🚀 Tour Complete!',
      content: 'Great! You\'ve completed the tour again. Now you\'re ready to make the most of your business management platform. Happy managing!',
      target: '[data-tour="business-dashboard"]',
      placement: 'top',
      showSkip: false,
      showBack: true
    }
  ];

  const handleRestartTour = () => {
    startTour(tourSteps);
  };

  if (isActive) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRestartTour}
      className="flex items-center gap-2"
    >
      <Play className="h-4 w-4" />
      Take Tour
    </Button>
  );
};

export default TourRestartButton;