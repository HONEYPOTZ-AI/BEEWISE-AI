import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ className, children }) => {
  return (
    <footer className={cn(
      "w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src="https://cdn.ezsite.ai/AutoDev/59275/72517020-a4c6-4049-b29e-6cb8f90cd76e.png" 
                alt="Company Logo" 
                className="h-8 w-auto md:h-12 transition-all duration-200 hover:scale-105"
              />
            </div>
            
            {/* Additional footer content */}
            <div className="flex flex-col items-center space-y-2 md:items-end">
              {children}
              <p className="text-sm text-muted-foreground text-center md:text-right">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;