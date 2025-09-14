import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '@/contexts/TourContext';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Progress } from './progress';
import { X, ArrowLeft, ArrowRight, Star, Sparkles, Trophy, Target, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TourOverlay: React.FC = () => {
  const { 
    isActive, 
    currentStep, 
    steps, 
    nextStep, 
    prevStep, 
    skipTour, 
    endTour,
    analytics,
    completeInteraction,
    getPersonalizedMessage,
    showCelebration,
    reEngagementPrompt,
    dismissReEngagementPrompt
  } = useTour();
  
  const { toast } = useToast();
  const [targetPosition, setTargetPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [overlayDimensions, setOverlayDimensions] = useState({ width: 0, height: 0 });
  const [showValueProp, setShowValueProp] = useState(false);
  const [interactionCompleted, setInteractionCompleted] = useState(false);

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

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

          // Add pulsing effect to target element
          element.style.transition = 'all 0.3s ease';
          element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
          
          return () => {
            element.style.boxShadow = '';
          };
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

      // Show value proposition after a delay
      const valueTimer = setTimeout(() => setShowValueProp(true), 500);

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
        clearTimeout(valueTimer);
      };
    }
  }, [isActive, currentStepData, currentStep]);

  // Reset interaction state when step changes
  useEffect(() => {
    setInteractionCompleted(false);
    setShowValueProp(false);
  }, [currentStep]);

  const handleInteraction = () => {
    if (currentStepData?.interactive && !interactionCompleted) {
      setInteractionCompleted(true);
      completeInteraction(currentStepData.interactive.type);
      
      if (currentStepData.interactive.reward) {
        toast({
          title: "🎉 Well done!",
          description: currentStepData.interactive.reward,
          duration: 3000
        });
      }
    }
  };

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'intro': return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'core': return <Target className="h-4 w-4 text-blue-500" />;
      case 'advanced': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'completion': return <Trophy className="h-4 w-4 text-green-500" />;
      default: return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  // Celebration Modal
  if (showCelebration) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center max-w-md mx-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Congratulations!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You've completed the tour! Your engagement score: <span className="font-bold text-blue-600">{Math.round(analytics.engagementScore)}%</span>
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium">🎁 Unlock your full potential!</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              You now have access to all features. Start creating your first business!
            </p>
          </div>
          <Button 
            onClick={() => endTour()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Start Building 🚀
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Re-engagement Prompt
  if (reEngagementPrompt) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center max-w-sm mx-4"
        >
          <div className="text-4xl mb-4">🤔</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Wait! Don't miss out
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            The tour shows you powerful features that will save you hours of work. Give it another try?
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={dismissReEngagementPrompt}
              className="flex-1"
            >
              No thanks
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                dismissReEngagementPrompt();
                startTour(steps);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Resume tour
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-auto"
      >
        {/* Animated Overlay with spotlight effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60"
          style={{
            width: overlayDimensions.width,
            height: overlayDimensions.height,
            maskImage: targetPosition 
              ? `radial-gradient(ellipse at ${targetPosition.left + targetPosition.width/2}px ${targetPosition.top + targetPosition.height/2}px, transparent ${Math.max(targetPosition.width, targetPosition.height) + 10}px, black ${Math.max(targetPosition.width, targetPosition.height) + 20}px)`
              : 'none'
          }}
        />

        {/* Animated highlight ring */}
        {targetPosition && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: 1 
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              opacity: { duration: 0.3 }
            }}
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

        {/* Interactive click hint */}
        {currentStepData?.interactive && targetPosition && (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute pointer-events-none"
            style={{
              top: targetPosition.top - 30,
              left: targetPosition.left + targetPosition.width / 2,
              transform: 'translateX(-50%)'
            }}
          >
            <ChevronDown className="h-6 w-6 text-white drop-shadow-lg" />
          </motion.div>
        )}

        {/* Tour content tooltip */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="absolute max-w-sm pointer-events-auto"
          style={getTooltipPosition()}
        >
          <Card className="shadow-2xl border-0 bg-white dark:bg-gray-900 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {currentStepData?.category && getCategoryIcon(currentStepData.category)}
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {currentStepData?.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Step {currentStep + 1} of {steps.length}</span>
                  <span>•</span>
                  <span>{Math.round(progressPercentage)}% complete</span>
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
              {/* Progress indicator */}
              <div className="mb-4">
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Main content */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {getPersonalizedMessage(currentStepData?.content || '')}
                </p>

                {/* Value proposition */}
                <AnimatePresence>
                  {showValueProp && currentStepData?.valueProposition && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-500"
                    >
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        💡 {currentStepData.valueProposition}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Benefit highlight */}
                {currentStepData?.benefit && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs text-green-700 dark:text-green-300">
                    ✨ {currentStepData.benefit}
                  </div>
                )}

                {/* Interactive element */}
                {currentStepData?.interactive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      👆 Try it now: {currentStepData.interactive.instruction}
                    </p>
                    {!interactionCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleInteraction}
                        className="text-xs h-7"
                      >
                        {currentStepData.interactive.type === 'click' ? 'Click to try' : 'Complete action'}
                      </Button>
                    )}
                    {interactionCompleted && (
                      <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Great job! You're a natural.
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex gap-2">
                  {currentStepData?.showBack !== false && currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      className="flex items-center gap-1 text-xs"
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
                      className="text-gray-500 text-xs hover:text-gray-700"
                    >
                      Skip Tour
                    </Button>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => {
                      if (currentStepData?.action) {
                        currentStepData.action();
                      }
                      nextStep();
                    }}
                    size="sm"
                    className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <Trophy className="h-3 w-3" />
                        {currentStepData?.ctaText || 'Finish Tour'}
                      </>
                    ) : (
                      <>
                        {currentStepData?.ctaText || 'Continue'}
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourOverlay;