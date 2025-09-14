import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '@/contexts/TourContext';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { X, ArrowLeft, ArrowRight, Play } from 'lucide-react';

const TourOverlay: React.FC = () => {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour, endTour } = useTour();
  const [targetPosition, setTargetPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [overlayDimensions, setOverlayDimensions] = useState({ width: 0, height: 0 });

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isActive && currentStepData?.target) {
      const updatePosition = () => {
        const element = document.querySelector(currentStepData.target) as HTMLElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          });
        }
      };

      const updateOverlayDimensions = () => {
        setOverlayDimensions({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight
        });
      };

      updatePosition();
      updateOverlayDimensions();

      const handleResize = () => {
        updatePosition();
        updateOverlayDimensions();
      };

      const handleScroll = () => {
        updatePosition();
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isActive, currentStepData, currentStep]);

  const getTooltipPosition = () => {
    if (!targetPosition) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const placement = currentStepData?.placement || 'bottom';
    const tooltipOffset = 20;

    switch (placement) {
      case 'top':
        return {
          top: targetPosition.top - tooltipOffset,
          left: targetPosition.left + targetPosition.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: targetPosition.top + targetPosition.height + tooltipOffset,
          left: targetPosition.left + targetPosition.width / 2,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left - tooltipOffset,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left + targetPosition.width + tooltipOffset,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: targetPosition.top + targetPosition.height + tooltipOffset,
          left: targetPosition.left + targetPosition.width / 2,
          transform: 'translate(-50%, 0)'
        };
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-auto"
      >
        {/* Overlay with spotlight effect */}
        <div 
          className="absolute inset-0 bg-black/60"
          style={{
            width: overlayDimensions.width,
            height: overlayDimensions.height,
            maskImage: targetPosition 
              ? `radial-gradient(ellipse at ${targetPosition.left + targetPosition.width/2}px ${targetPosition.top + targetPosition.height/2}px, transparent ${Math.max(targetPosition.width, targetPosition.height) + 10}px, black ${Math.max(targetPosition.width, targetPosition.height) + 20}px)`
              : 'none'
          }}
        />

        {/* Highlight ring */}
        {targetPosition && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute pointer-events-none"
            style={{
              top: targetPosition.top - 4,
              left: targetPosition.left - 4,
              width: targetPosition.width + 8,
              height: targetPosition.height + 8,
              border: '3px solid #3b82f6',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}
          />
        )}

        {/* Tour content tooltip */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="absolute max-w-sm pointer-events-auto"
          style={getTooltipPosition()}
        >
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {currentStepData?.title}
                </CardTitle>
                <div className="text-xs text-gray-500 mt-1">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={endTour}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {currentStepData?.content}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {currentStepData?.showBack !== false && currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      className="flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back
                    </Button>
                  )}
                  {currentStepData?.showSkip !== false && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipTour}
                      className="text-gray-500"
                    >
                      Skip Tour
                    </Button>
                  )}
                </div>

                <Button
                  onClick={() => {
                    if (currentStepData?.action) {
                      currentStepData.action();
                    }
                    nextStep();
                  }}
                  size="sm"
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === steps.length - 1 ? (
                    'Finish'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourOverlay;