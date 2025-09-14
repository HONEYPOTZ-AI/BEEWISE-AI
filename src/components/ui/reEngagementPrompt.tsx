import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Clock, Star, Target, Zap } from 'lucide-react';

interface ReEngagementPromptProps {
  show: boolean;
  onResume: () => void;
  onDismiss: () => void;
  skippedStepTitle?: string;
}

const ReEngagementPrompt: React.FC<ReEngagementPromptProps> = ({
  show,
  onResume,
  onDismiss,
  skippedStepTitle
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    {
      icon: Clock,
      title: "Just 2 minutes left!",
      description: "You're so close to mastering all the features that will save you hours every week.",
      color: "text-blue-500"
    },
    {
      icon: Star,
      title: "Don't miss the best parts!",
      description: `The "${skippedStepTitle}" section contains game-changing features that most users love.`,
      color: "text-yellow-500"
    },
    {
      icon: Target,
      title: "Almost there!",
      description: "Complete users are 5x more likely to achieve their business goals with this platform.",
      color: "text-green-500"
    },
    {
      icon: Zap,
      title: "Quick win ahead!",
      description: "The next steps unlock automation that could save you 10+ hours per week.",
      color: "text-purple-500"
    }
  ];

  useEffect(() => {
    if (show) {
      const timer = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [show, messages.length]);

  if (!show) return null;

  const currentMsg = messages[currentMessage];
  const IconComponent = currentMsg.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
        >
          <Card className="max-w-md w-full bg-white dark:bg-gray-900 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                key={currentMessage}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-4"
              >
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                  <IconComponent className={`h-8 w-8 ${currentMsg.color}`} />
                </div>
              </motion.div>
              
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentMsg.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-600 dark:text-gray-300"
              >
                {currentMsg.description}
              </motion.p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ⏱️ You've already invested time - don't waste it!
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onDismiss}
                  className="flex-1"
                >
                  Skip anyway
                </Button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    onClick={onResume}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Continue tour
                  </Button>
                </motion.div>
              </div>

              {/* Progress indicators */}
              <div className="flex justify-center space-x-2 pt-2">
                {messages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentMessage 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReEngagementPrompt;