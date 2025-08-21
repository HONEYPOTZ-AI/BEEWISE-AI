import React from 'react';
import { Button as BaseButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends React.ComponentProps<typeof BaseButton> {
  gradient?: 'primary' | 'warm' | 'cool' | 'none';
  glow?: boolean;
  loading?: boolean;
  ripple?: boolean;
}

const EnhancedButton = React.forwardRef<
  React.ElementRef<typeof BaseButton>,
  EnhancedButtonProps>(
  ({ className, gradient = 'none', glow = false, loading = false, ripple = true, children, disabled, ...props }, ref) => {
    const [isClicked, setIsClicked] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled) {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 600);
      }
      props.onClick?.(e);
    };

    const gradientClasses = {
      primary: 'btn-gradient',
      warm: 'btn-gradient-warm',
      cool: 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl',
      none: ''
    };

    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}>

      <BaseButton
          ref={ref}
          className={cn(
            'relative overflow-hidden transition-all duration-300',
            gradient !== 'none' && gradientClasses[gradient],
            glow && 'shadow-glow hover:shadow-glow-intense',
            loading && 'cursor-not-allowed',
            className
          )}
          disabled={disabled || loading}
          onClick={handleClick}
          {...props}>

        {/* Ripple effect */}
        {ripple && isClicked &&
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6 }} />

          }

        {/* Loading spinner */}
        {loading &&
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          }

        {children}

        {/* Glow effect overlay */}
        {glow &&
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          }
      </BaseButton>
    </motion.div>);

  });

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;