import React, { useEffect } from 'react';
import { useTour, TourStep } from '@/contexts/TourContext';
import TourOverlay from '@/components/ui/tourOverlay';

const OnboardingTour: React.FC = () => {
  const { startTour, isCompleted, updatePersonalization } = useTour();

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '🎉 Welcome to Your Success Journey!',
      content: 'You\'ve just unlocked the most powerful business management platform. In the next 2 minutes, we\'ll show you how to transform your business operations and boost productivity by 300%.',
      valueProposition: 'Join 50,000+ businesses that increased their efficiency by 300% using this platform',
      target: 'body',
      placement: 'bottom',
      showSkip: true,
      showBack: false,
      category: 'intro',
      ctaText: 'Let\'s Get Started!',
      benefit: 'This quick tour will save you hours of learning time',
      interactive: {
        type: 'click',
        instruction: 'Click "Let\'s Get Started!" to begin your transformation',
        reward: 'Perfect! You\'re already mastering the basics!'
      }
    },
    {
      id: 'theme-toggle',
      title: '🎨 Personalize Your Experience',
      content: 'Your workspace should reflect your style. Switch between themes to create the perfect environment for peak productivity.',
      valueProposition: 'Studies show personalized workspaces increase focus by 23%',
      target: '[data-tour="theme-toggle"]',
      placement: 'bottom',
      showSkip: true,
      showBack: true,
      category: 'intro',
      ctaText: 'Try It Now!',
      benefit: 'Dark mode reduces eye strain during long work sessions',
      interactive: {
        type: 'click',
        element: '[data-tour="theme-toggle"]',
        instruction: 'Click the theme toggle to see both light and dark modes',
        reward: 'Great choice! Your eyes will thank you during those late-night strategy sessions.'
      }
    },
    {
      id: 'navigation',
      title: '🧭 Your Command Center',
      content: 'This navigation menu is your gateway to business success. Each section contains specialized tools designed to streamline different aspects of your operations.',
      valueProposition: 'Navigate 5x faster than traditional business software',
      target: '[data-tour="navigation-menu"]',
      placement: 'bottom',
      showSkip: true,
      showBack: true,
      category: 'core',
      ctaText: 'Explore Navigation',
      benefit: 'Quick access to all features means no more hunting through menus',
      interactive: {
        type: 'hover',
        element: '[data-tour="navigation-menu"]',
        instruction: 'Hover over the navigation menu to see all available sections',
        reward: 'You\'re becoming a navigation expert!'
      }
    },
    {
      id: 'business-dashboard',
      title: '📊 Your Business Control Tower',
      content: 'This is where the magic happens! Monitor performance, track growth metrics, and manage multiple businesses from one central hub. See real-time insights that drive better decisions.',
      valueProposition: 'Dashboard users make 40% faster business decisions',
      target: '[data-tour="business-dashboard"]',
      placement: 'top',
      showSkip: true,
      showBack: true,
      category: 'core',
      ctaText: 'Discover Insights',
      benefit: 'Real-time data helps you stay ahead of the competition',
      interactive: {
        type: 'demo',
        instruction: 'Explore the business metrics and growth indicators',
        reward: 'You\'re thinking like a data-driven entrepreneur!'
      }
    },
    {
      id: 'agent-dashboard',
      title: '🤖 Meet Your AI Workforce',
      content: 'Welcome to the future! These AI agents are your tireless digital employees, working 24/7 to automate tasks, analyze data, and boost your productivity.',
      valueProposition: 'AI agents can handle 80% of routine tasks, freeing you for strategic work',
      target: '[data-tour="agent-dashboard"]',
      placement: 'top',
      showSkip: true,
      showBack: true,
      category: 'advanced',
      ctaText: 'Meet Your Agents',
      benefit: 'Never worry about mundane tasks again - your AI team has you covered',
      interactive: {
        type: 'click',
        instruction: 'Click on an agent card to see their capabilities',
        reward: 'Amazing! You just discovered your new favorite productivity hack.'
      }
    },
    {
      id: 'task-manager',
      title: '✅ Task Management Superpower',
      content: 'Transform chaos into clarity! This intelligent task manager doesn\'t just organize your work—it predicts bottlenecks, suggests optimizations, and keeps your team in perfect sync.',
      valueProposition: 'Teams using smart task management complete projects 45% faster',
      target: '[data-tour="task-manager"]',
      placement: 'top',
      showSkip: true,
      showBack: true,
      category: 'core',
      ctaText: 'Master Task Flow',
      benefit: 'Never miss a deadline or lose track of important work again',
      interactive: {
        type: 'click',
        instruction: 'Create a sample task to see the smart features in action',
        reward: 'Brilliant! You\'re already thinking like a productivity master!'
      }
    },
    {
      id: 'task-workflow',
      title: '🔄 Visualize Your Success Path',
      content: 'See the bigger picture! This workflow visualization reveals hidden connections, identifies bottlenecks before they happen, and shows you the fastest path to your goals.',
      valueProposition: 'Visual workflow management reduces project completion time by 35%',
      target: '[data-tour="task-workflow"]',
      placement: 'top',
      showSkip: true,
      showBack: true,
      category: 'advanced',
      ctaText: 'See The Big Picture',
      benefit: 'Spot problems before they become crises',
      interactive: {
        type: 'hover',
        instruction: 'Hover over workflow connections to see task relationships',
        reward: 'You\'re developing x-ray vision for business processes!'
      }
    },
    {
      id: 'get-started',
      title: '🚀 You\'re Ready to Conquer!',
      content: 'Congratulations! You\'ve just mastered the tools that will 10x your business efficiency. You\'re now equipped to build, grow, and scale like never before. The success stories start here!',
      valueProposition: 'You\'re now among the top 1% of business operators who leverage advanced tools',
      target: '[data-tour="business-dashboard"]',
      placement: 'top',
      showSkip: false,
      showBack: true,
      category: 'completion',
      ctaText: 'Start My Journey!',
      benefit: 'You\'ve unlocked your full potential - time to build something amazing!',
      interactive: {
        type: 'click',
        instruction: 'Click to celebrate your achievement and start building',
        reward: 'Welcome to the future of business management! 🎉'
      }
    }
  ];

  useEffect(() => {
    // Detect user type based on behavior or preferences
    const detectUserType = () => {
      const visitCount = parseInt(localStorage.getItem('visit-count') || '0');
      const hasCreatedBusiness = localStorage.getItem('has-created-business');
      const lastActivity = localStorage.getItem('last-activity');
      
      let userType: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
      let preferredPace: 'fast' | 'normal' | 'slow' = 'normal';
      
      if (visitCount > 5 || hasCreatedBusiness) {
        userType = 'intermediate';
        preferredPace = 'fast';
      }
      
      if (lastActivity && Date.now() - parseInt(lastActivity) < 86400000) { // Last 24 hours
        userType = 'advanced';
        preferredPace = 'fast';
      }
      
      updatePersonalization({ userType, preferredPace });
    };

    // Auto-start tour for new users
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    const hasSkippedOnboarding = localStorage.getItem('onboarding-skipped');
    const visitCount = parseInt(localStorage.getItem('visit-count') || '0') + 1;
    
    localStorage.setItem('visit-count', visitCount.toString());
    localStorage.setItem('last-activity', Date.now().toString());

    if (!hasCompletedOnboarding && !hasSkippedOnboarding && !isCompleted) {
      // Detect user preferences before starting tour
      detectUserType();
      
      // Small delay to ensure components are mounted and personalization is set
      const timer = setTimeout(() => {
        startTour(tourSteps);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [startTour, isCompleted, updatePersonalization]);

  return <TourOverlay />;
};

export default OnboardingTour;