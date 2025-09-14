import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  valueProposition?: string;
  target: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  action?: () => void;
  interactive?: {
    type: 'click' | 'hover' | 'input' | 'demo';
    element?: string;
    instruction?: string;
    reward?: string;
  };
  category?: 'intro' | 'core' | 'advanced' | 'completion';
  ctaText?: string;
  benefit?: string;
}

interface TourAnalytics {
  startTime: number;
  stepDurations: number[];
  interactionsCount: number;
  skippedSteps: string[];
  completedActions: string[];
  engagementScore: number;
}

interface TourPersonalization {
  userType?: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  previousActions: string[];
  preferredPace: 'fast' | 'normal' | 'slow';
}

interface TourState {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  isCompleted: boolean;
  analytics: TourAnalytics;
  personalization: TourPersonalization;
  showCelebration: boolean;
  reEngagementPrompt: boolean;
}

interface TourContextValue extends TourState {
  startTour: (steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  endTour: () => void;
  restartTour: () => void;
  setCurrentStep: (step: number) => void;
  completeInteraction: (interactionType: string) => void;
  updatePersonalization: (updates: Partial<TourPersonalization>) => void;
  getPersonalizedMessage: (baseMessage: string) => string;
  showReEngagementPrompt: () => void;
  dismissReEngagementPrompt: () => void;
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
  const { toast } = useToast();
  
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    currentStep: 0,
    steps: [],
    isCompleted: false,
    showCelebration: false,
    reEngagementPrompt: false,
    analytics: {
      startTime: 0,
      stepDurations: [],
      interactionsCount: 0,
      skippedSteps: [],
      completedActions: [],
      engagementScore: 0
    },
    personalization: {
      interests: [],
      previousActions: [],
      preferredPace: 'normal'
    }
  });

  const updateAnalytics = useCallback((updates: Partial<TourAnalytics>) => {
    setTourState(prev => ({
      ...prev,
      analytics: { ...prev.analytics, ...updates }
    }));
  }, []);

  const calculateEngagementScore = useCallback((analytics: TourAnalytics) => {
    const interactionWeight = 0.4;
    const completionWeight = 0.3;
    const timeWeight = 0.3;
    
    const interactionScore = Math.min(analytics.interactionsCount / 10, 1);
    const completionScore = analytics.completedActions.length / analytics.stepDurations.length || 0;
    const timeScore = analytics.stepDurations.length > 0 
      ? Math.min(analytics.stepDurations.reduce((a, b) => a + b, 0) / (analytics.stepDurations.length * 30000), 1)
      : 0;
    
    return (interactionScore * interactionWeight + completionScore * completionWeight + timeScore * timeWeight) * 100;
  }, []);

  const startTour = useCallback((steps: TourStep[]) => {
    const startTime = Date.now();
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0,
      steps,
      isCompleted: false,
      showCelebration: false,
      reEngagementPrompt: false,
      analytics: {
        ...prev.analytics,
        startTime,
        stepDurations: [],
        interactionsCount: 0,
        skippedSteps: [],
        completedActions: []
      }
    }));
  }, []);

  const nextStep = useCallback(() => {
    setTourState((prev) => {
      const stepEndTime = Date.now();
      const stepDuration = stepEndTime - (prev.analytics.startTime + prev.analytics.stepDurations.reduce((a, b) => a + b, 0));
      
      const updatedAnalytics = {
        ...prev.analytics,
        stepDurations: [...prev.analytics.stepDurations, stepDuration]
      };

      const nextStepIndex = prev.currentStep + 1;
      if (nextStepIndex >= prev.steps.length) {
        // Tour completed
        localStorage.setItem('onboarding-completed', 'true');
        const finalEngagementScore = calculateEngagementScore(updatedAnalytics);
        
        // Show celebration and save analytics
        localStorage.setItem('tour-analytics', JSON.stringify({
          ...updatedAnalytics,
          engagementScore: finalEngagementScore
        }));
        
        return {
          ...prev,
          isActive: false,
          isCompleted: true,
          showCelebration: true,
          analytics: { ...updatedAnalytics, engagementScore: finalEngagementScore }
        };
      }
      
      return {
        ...prev,
        currentStep: nextStepIndex,
        analytics: updatedAnalytics
      };
    });
  }, [calculateEngagementScore]);

  const prevStep = useCallback(() => {
    setTourState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  }, []);

  const skipTour = useCallback(() => {
    setTourState(prev => {
      const skippedStep = prev.steps[prev.currentStep]?.id;
      const updatedAnalytics = {
        ...prev.analytics,
        skippedSteps: [...prev.analytics.skippedSteps, skippedStep]
      };
      
      localStorage.setItem('onboarding-skipped', 'true');
      localStorage.setItem('tour-analytics', JSON.stringify(updatedAnalytics));
      
      return {
        ...prev,
        isActive: false,
        reEngagementPrompt: true,
        analytics: updatedAnalytics
      };
    });
  }, []);

  const endTour = useCallback(() => {
    setTourState((prev) => ({
      ...prev,
      isActive: false
    }));
  }, []);

  const restartTour = useCallback(() => {
    localStorage.removeItem('onboarding-completed');
    localStorage.removeItem('onboarding-skipped');
    setTourState((prev) => ({
      ...prev,
      currentStep: 0,
      isActive: true,
      isCompleted: false,
      showCelebration: false,
      reEngagementPrompt: false,
      analytics: {
        startTime: Date.now(),
        stepDurations: [],
        interactionsCount: 0,
        skippedSteps: [],
        completedActions: [],
        engagementScore: 0
      }
    }));
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    setTourState((prev) => ({
      ...prev,
      currentStep: step
    }));
  }, []);

  const completeInteraction = useCallback((interactionType: string) => {
    updateAnalytics({
      interactionsCount: tourState.analytics.interactionsCount + 1,
      completedActions: [...tourState.analytics.completedActions, interactionType]
    });
    
    toast({
      title: "Great job! 🎉",
      description: "You're getting the hang of it!",
      duration: 2000
    });
  }, [tourState.analytics, updateAnalytics, toast]);

  const updatePersonalization = useCallback((updates: Partial<TourPersonalization>) => {
    setTourState(prev => ({
      ...prev,
      personalization: { ...prev.personalization, ...updates }
    }));
  }, []);

  const getPersonalizedMessage = useCallback((baseMessage: string) => {
    const { userType, preferredPace } = tourState.personalization;
    
    if (userType === 'beginner' && preferredPace === 'slow') {
      return `${baseMessage} Take your time to explore each feature.`;
    } else if (userType === 'advanced' && preferredPace === 'fast') {
      return `${baseMessage} You can skip to advanced features anytime.`;
    }
    
    return baseMessage;
  }, [tourState.personalization]);

  const showReEngagementPrompt = useCallback(() => {
    setTourState(prev => ({
      ...prev,
      reEngagementPrompt: true
    }));
  }, []);

  const dismissReEngagementPrompt = useCallback(() => {
    setTourState(prev => ({
      ...prev,
      reEngagementPrompt: false
    }));
  }, []);

  const value: TourContextValue = {
    ...tourState,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    endTour,
    restartTour,
    setCurrentStep,
    completeInteraction,
    updatePersonalization,
    getPersonalizedMessage,
    showReEngagementPrompt,
    dismissReEngagementPrompt
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};