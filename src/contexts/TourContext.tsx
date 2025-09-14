import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showOverlay?: boolean;
  action?: () => void;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  isCompleted: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: '#main-content',
    title: 'Welcome to the Business Management Platform!',
    content: 'Let us show you around the key features of this application. This tour will help you get started quickly.',
    position: 'bottom',
    showOverlay: true
  },
  {
    id: 'navigation',
    target: '#main-navigation',
    title: 'Navigation Menu',
    content: 'Access different sections of the application through this navigation menu. You can find agents, businesses, configuration options, and resources here.',
    position: 'bottom',
    showOverlay: true
  },
  {
    id: 'theme-toggle',
    target: '#theme-toggle',
    title: 'Theme Toggle',
    content: 'Switch between light and dark themes to customize your viewing experience.',
    position: 'left',
    showOverlay: true
  },
  {
    id: 'business-dashboard',
    target: '#business-dashboard',
    title: 'Business Dashboard',
    content: 'Monitor and manage your business processes here. Track stages, transitions, and performance metrics.',
    position: 'top',
    showOverlay: true
  },
  {
    id: 'agent-dashboard',
    target: '#agent-dashboard',
    title: 'Agent Dashboard',
    content: 'Manage AI agents, assign tasks, and monitor their performance. This is where you control your automated workforce.',
    position: 'top',
    showOverlay: true
  },
  {
    id: 'task-manager',
    target: '#task-manager',
    title: 'Task Manager',
    content: 'Create, assign, and track tasks. This enhanced task manager provides workflow visualization and comprehensive task management.',
    position: 'top',
    showOverlay: true
  },
  {
    id: 'complete',
    target: '#main-content',
    title: 'Tour Complete!',
    content: 'You\'re all set! Explore the application and start managing your business processes. You can always retake this tour from the help menu.',
    position: 'bottom',
    showOverlay: true
  }
];

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(() => {
    return localStorage.getItem('app-tour-completed') === 'true';
  });

  const startTour = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setIsCompleted(true);
    localStorage.setItem('app-tour-completed', 'true');
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setIsCompleted(true);
    localStorage.setItem('app-tour-completed', 'true');
  }, []);

  // Auto-start tour for new users after a short delay
  useEffect(() => {
    if (!isCompleted && !isActive) {
      const timer = setTimeout(() => {
        // Check if user hasn't manually started tour
        if (!isActive && !isCompleted) {
          startTour();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, isActive, startTour]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps: TOUR_STEPS,
        startTour,
        nextStep,
        previousStep,
        skipTour,
        completeTour,
        isCompleted
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}