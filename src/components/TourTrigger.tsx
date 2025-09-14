import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play } from 'lucide-react';
import { useTour } from '@/contexts/TourContext';
import { cn } from '@/lib/utils';

interface TourTriggerProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function TourTrigger({ 
  variant = 'default', 
  size = 'default', 
  className,
  showIcon = true,
  children 
}: TourTriggerProps) {
  const { startTour, isCompleted } = useTour();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={startTour}
      className={cn(
        "transition-all duration-200 hover:scale-105",
        className
      )}
    >
      {showIcon && (
        isCompleted ? (
          <RotateCcw className="h-4 w-4 mr-2" />
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )
      )}
      {children || (isCompleted ? 'Retake Tour' : 'Take Tour')}
    </Button>
  );
}