import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, ExternalLink, HelpCircle, Info, FileText, Settings, TestTube, Shield, Code, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface LearnMoreButtonProps {
  /** The section ID in the documentation page to navigate to */
  section?: string;
  /** Tooltip text to show on hover */
  tooltip?: string;
  /** Button size */
  size?: 'sm' | 'default' | 'lg';
  /** Button variant */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  /** Display mode */
  mode?: 'button' | 'link' | 'icon';
  /** Whether to open in new tab (for external links) */
  external?: boolean;
  /** Custom label text (defaults to "Learn More") */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Custom icon component */
  icon?: React.ReactNode;
  /** Custom onClick handler (overrides default navigation) */
  onClick?: (e: React.MouseEvent) => void;
  /** Whether to show the tooltip */
  showTooltip?: boolean;
}

const LearnMoreButton: React.FC<LearnMoreButtonProps> = ({
  section = 'overview',
  tooltip = 'Open documentation for more information',
  size = 'sm',
  variant = 'outline',
  mode = 'button',
  external = false,
  label = 'Learn More',
  className,
  ariaLabel,
  icon,
  onClick,
  showTooltip = true,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
      return;
    }

    e.preventDefault();
    
    if (external) {
      // For external mode, open in new tab
      const url = `/documentation?section=${section}#${section}-section`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate to documentation page and set active section
      navigate(`/documentation?section=${section}`, { 
        state: { scrollTo: `${section}-section` } 
      });
      
      // Also update the URL hash after navigation
      setTimeout(() => {
        const element = document.getElementById(`${section}-section`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
  };

  const getDefaultIcon = () => {
    if (icon) return icon;
    
    switch (section) {
      case 'overview':
        return <BookOpen className="h-4 w-4" />;
      case 'getting-started':
        return <FileText className="h-4 w-4" />;
      case 'features':
        return <Settings className="h-4 w-4" />;
      case 'testing':
        return <TestTube className="h-4 w-4" />;
      case 'api-reference':
        return <Code className="h-4 w-4" />;
      case 'best-practices':
        return <Shield className="h-4 w-4" />;
      case 'deployment':
        return <Server className="h-4 w-4" />;
      default:
        switch (mode) {
          case 'icon':
            return <Info className="h-4 w-4" />;
          default:
            return external ? 
              <ExternalLink className="h-4 w-4" /> : 
              <BookOpen className="h-4 w-4" />;
        }
    }
  };

  const getContent = () => {
    const defaultIcon = getDefaultIcon();
    
    switch (mode) {
      case 'icon':
        return (
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={cn('p-2', className)}
            aria-label={ariaLabel || tooltip}
          >
            {defaultIcon}
          </Button>
        );
      
      case 'link':
        return (
          <Button
            variant="link"
            size={size}
            onClick={handleClick}
            className={cn('h-auto p-0 text-sm font-normal hover:underline', className)}
            aria-label={ariaLabel || `${label} - ${tooltip}`}
          >
            {defaultIcon}
            <span className="ml-1">{label}</span>
          </Button>
        );
      
      default: // 'button'
        return (
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={cn('flex items-center gap-2', className)}
            aria-label={ariaLabel || `${label} - ${tooltip}`}
          >
            {defaultIcon}
            <span>{label}</span>
          </Button>
        );
    }
  };

  if (!showTooltip) {
    return getContent();
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {getContent()}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LearnMoreButton;