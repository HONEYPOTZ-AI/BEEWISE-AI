import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ className, children }) => {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <img 
              src="https://cdn.ezsite.ai/AutoDev/59275/c920ee72-30b1-4d8f-9649-12f3723944be.png" 
              alt="Company Logo" 
              className="h-8 w-auto md:h-10 transition-all duration-200 hover:scale-105"
            />
          </div>
          
          {/* Navigation and other content */}
          <div className="flex items-center space-x-4">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;