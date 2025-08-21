import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light', color: 'text-amber-500' },
    { value: 'dark' as const, icon: Moon, label: 'Dark', color: 'text-blue-400' },
    { value: 'system' as const, icon: Monitor, label: 'System', color: 'text-slate-600 dark:text-slate-400' },
  ];

  const currentThemeIndex = themes.findIndex(t => t.value === theme);
  const nextTheme = themes[(currentThemeIndex + 1) % themes.length];

  const handleToggle = () => {
    setTheme(nextTheme.value);
  };

  const currentThemeData = themes[currentThemeIndex];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="relative w-10 h-10 p-0 rounded-full glass hover:bg-accent/80 hover:border-accent-foreground/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group overflow-hidden focus-enhanced"
      aria-label={`Switch to ${nextTheme.label} theme`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
      
      {/* Animated icon container */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="relative z-10 flex items-center justify-center"
        >
          <currentThemeData.icon className={`h-4 w-4 ${currentThemeData.color} group-hover:scale-110 transition-all duration-300`} />
        </motion.div>
      </AnimatePresence>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Theme indicator glow - enhanced for better visibility */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 ${
        resolvedTheme === 'dark' 
          ? 'shadow-[0_0_25px_rgba(59,130,246,0.4)]' 
          : 'shadow-[0_0_25px_rgba(245,158,11,0.4)]'
      }`} />

      {/* Subtle pulsing animation for system theme */}
      {theme === 'system' && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </Button>
  );
};

export default ThemeToggle;