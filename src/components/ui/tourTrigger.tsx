import React from 'react';
import { Button } from './button';
import { Play, RotateCcw } from 'lucide-react';
import { useTour } from '@/contexts/TourContext';

interface TourTriggerProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  tourSteps?: Array<{
    id: string;
    title: string;
    content: string;
    target: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    showSkip?: boolean;
    showBack?: boolean;
    showNext?: boolean;
    action?: () => void;
  }>;
  onTourStart?: () => void;
}

const TourTrigger: React.FC<TourTriggerProps> = ({ 
  variant = 'default',
  size = 'default',
  className,
  children,
  tourSteps = [],
  onTourStart
}) => {
  const { startTour, isActive } = useTour();

  const handleStartTour = () => {
    if (tourSteps.length > 0) {
      startTour(tourSteps);
      onTourStart?.();
    }
  };

  if (isActive) {
    return null; // Hide trigger when tour is active
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleStartTour}
      className={className}
      disabled={tourSteps.length === 0}
    >
      {children || (
        <>
          <Play className="h-4 w-4 mr-2" />
          Start Tour
        </>
      )}
    </Button>
  );
};

export default TourTrigger;