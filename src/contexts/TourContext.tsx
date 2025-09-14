import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  action?: () => void;
}

interface TourState {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  isCompleted: boolean;
}

interface TourContextValue extends TourState {
  startTour: (steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  endTour: () => void;
  restartTour: () => void;
  setCurrentStep: (step: number) => void;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    currentStep: 0,
    steps: [],
    isCompleted: false
  });

  const startTour = (steps: TourStep[]) => {
    setTourState({
      isActive: true,
      currentStep: 0,
      steps,
      isCompleted: false
    });
  };

  const nextStep = () => {
    setTourState(prev => {
      const nextStepIndex = prev.currentStep + 1;
      if (nextStepIndex >= prev.steps.length) {
        // Tour completed
        localStorage.setItem('onboarding-completed', 'true');
        return {
          ...prev,
          isActive: false,
          isCompleted: true
        };
      }
      return {
        ...prev,
        currentStep: nextStepIndex
      };
    });
  };

  const prevStep = () => {
    setTourState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  };

  const skipTour = () => {
    localStorage.setItem('onboarding-skipped', 'true');
    setTourState(prev => ({
      ...prev,
      isActive: false
    }));
  };

  const endTour = () => {
    setTourState(prev => ({
      ...prev,
      isActive: false
    }));
  };

  const restartTour = () => {
    localStorage.removeItem('onboarding-completed');
    localStorage.removeItem('onboarding-skipped');
    setTourState(prev => ({
      ...prev,
      currentStep: 0,
      isActive: true,
      isCompleted: false
    }));
  };

  const setCurrentStep = (step: number) => {
    setTourState(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  const value: TourContextValue = {
    ...tourState,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    endTour,
    restartTour,
    setCurrentStep
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};