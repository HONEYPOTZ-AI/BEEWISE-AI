import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTour } from '@/contexts/TourContext';
import { cn } from '@/lib/utils';

interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourOverlay() {
  const { isActive, currentStep, steps, nextStep, previousStep, skipTour, completeTour } = useTour();
  const [targetPosition, setTargetPosition] = useState<ElementPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentTourStep = steps[currentStep];

  useEffect(() => {
    if (!isActive || !currentTourStep) return;

    const updatePositions = () => {
      const targetElement = document.querySelector(currentTourStep.target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const position = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      };
      setTargetPosition(position);

      // Calculate tooltip position based on preferred position
      if (tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        let tooltipTop = 0;
        let tooltipLeft = 0;

        switch (currentTourStep.position || 'bottom') {
          case 'top':
            tooltipTop = rect.top - tooltipRect.height - 16;
            tooltipLeft = rect.left + (rect.width - tooltipRect.width) / 2;
            break;
          case 'bottom':
            tooltipTop = rect.bottom + 16;
            tooltipLeft = rect.left + (rect.width - tooltipRect.width) / 2;
            break;
          case 'left':
            tooltipTop = rect.top + (rect.height - tooltipRect.height) / 2;
            tooltipLeft = rect.left - tooltipRect.width - 16;
            break;
          case 'right':
            tooltipTop = rect.top + (rect.height - tooltipRect.height) / 2;
            tooltipLeft = rect.right + 16;
            break;
        }

        // Keep tooltip within viewport bounds
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        tooltipLeft = Math.max(16, Math.min(tooltipLeft, viewportWidth - tooltipRect.width - 16));
        tooltipTop = Math.max(16, Math.min(tooltipTop, viewportHeight - tooltipRect.height - 16));

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
      }
    };

    updatePositions();

    // Update positions on resize and scroll
    const handleUpdate = () => requestAnimationFrame(updatePositions);
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    // Execute step action if defined
    if (currentTourStep.action) {
      currentTourStep.action();
    }

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isActive, currentStep, currentTourStep]);

  if (!isActive || !currentTourStep || !targetPosition) return null;

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        {/* Backdrop with highlight */}
        {currentTourStep.showOverlay && (
          <div 
            className="absolute inset-0 bg-black/60"
            style={{
              clipPath: `polygon(0% 0%, 0% 100%, ${targetPosition.left}px 100%, ${targetPosition.left}px ${targetPosition.top}px, ${targetPosition.left + targetPosition.width}px ${targetPosition.top}px, ${targetPosition.left + targetPosition.width}px ${targetPosition.top + targetPosition.height}px, ${targetPosition.left}px ${targetPosition.top + targetPosition.height}px, ${targetPosition.left}px 100%, 100% 100%, 100% 0%)`
            }}
          />
        )}

        {/* Highlighted element border */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute border-4 border-blue-400 rounded-lg shadow-lg"
          style={{
            top: targetPosition.top - 4,
            left: targetPosition.left - 4,
            width: targetPosition.width + 8,
            height: targetPosition.height + 8,
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)'
          }}
        />

        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute pointer-events-auto"
          style={tooltipPosition || { top: 0, left: 0 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                {currentTourStep.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              {currentTourStep.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Step indicator */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentStep + 1} of {steps.length}
                </span>
                <div className="flex space-x-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentStep
                          ? "bg-blue-500"
                          : index < currentStep
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center space-x-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousStep}
                    className="h-8"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                )}
                
                {isLastStep ? (
                  <Button
                    onClick={completeTour}
                    size="sm"
                    className="h-8 bg-green-600 hover:bg-green-700"
                  >
                    Complete
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    size="sm"
                    className="h-8"
                  >
                    Next
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Arrow pointer */}
          <div 
            className={cn(
              "absolute w-3 h-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rotate-45",
              currentTourStep.position === 'top' && "bottom-[-7px] left-1/2 transform -translate-x-1/2 border-t-0 border-l-0",
              currentTourStep.position === 'bottom' && "top-[-7px] left-1/2 transform -translate-x-1/2 border-b-0 border-r-0",
              currentTourStep.position === 'left' && "right-[-7px] top-1/2 transform -translate-y-1/2 border-l-0 border-b-0",
              currentTourStep.position === 'right' && "left-[-7px] top-1/2 transform -translate-y-1/2 border-r-0 border-t-0",
              !currentTourStep.position && "top-[-7px] left-1/2 transform -translate-x-1/2 border-b-0 border-r-0"
            )}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}