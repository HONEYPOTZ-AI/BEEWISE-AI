import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'enhanced' | 'interactive';
  hover?: boolean;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  delay = 0,
  direction = 'up'
}) => {
  const variants = {
    default: '',
    glass: 'glass',
    enhanced: 'card-enhanced',
    interactive: 'card-interactive'
  };

  const directionVariants = {
    up: { y: 30, opacity: 0 },
    down: { y: -30, opacity: 0 },
    left: { x: -30, opacity: 0 },
    right: { x: 30, opacity: 0 },
    scale: { scale: 0.9, opacity: 0 }
  };

  const hoverVariants = {
    up: { y: -8, scale: 1.02 },
    down: { y: 8, scale: 1.02 },
    left: { x: -8, scale: 1.02 },
    right: { x: 8, scale: 1.02 },
    scale: { scale: 1.05 }
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      whileHover={hover ? hoverVariants[direction] : undefined}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay
      }}
    >
      <Card className={cn(variants[variant], className)}>
        {children}
      </Card>
    </motion.div>
  );
};

export { AnimatedCard };