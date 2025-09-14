import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationAnimationProps {
  show: boolean;
  onComplete?: () => void;
  type?: 'confetti' | 'stars' | 'sparkles';
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  show,
  onComplete,
  type = 'confetti'
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      // Generate particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.5
      }));
      
      setParticles(newParticles);

      // Auto complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 0
            }}
            animate={{
              x: particle.x + (Math.random() - 0.5) * 200,
              y: window.innerHeight + 100,
              opacity: 0,
              scale: 1,
              rotate: 360
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: particle.delay,
              ease: "easeOut"
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: particle.color
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationAnimation;