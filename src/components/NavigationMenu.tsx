import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Building2, 
  Zap, 
  Shield, 
  Sparkles, 
  Settings,
  FileText,
  TestTube,
  CheckSquare,
  Home,
  BookOpen,
  Cpu,
  GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const NavigationMenuComponent: React.FC = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="gap-2">
            <Bot className="h-4 w-4" />
            Agents
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/testing" title="Agent Marketplace" icon={<Zap className="h-4 w-4" />}>
                Browse and deploy specialized AI agents
              </ListItem>
              <ListItem href="/testing" title="Agent Orchestration" icon={<Cpu className="h-4 w-4" />}>
                Manage agent deployment and performance
              </ListItem>
              <ListItem href="/testing" title="Agent Development" icon={<Bot className="h-4 w-4" />}>
                Create custom agents for specific tasks
              </ListItem>
              <ListItem href="/testing" title="Agent Monitoring" icon={<Shield className="h-4 w-4" />}>
                Track agent performance and health
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="gap-2">
            <Building2 className="h-4 w-4" />
            Business
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/testing" title="Lifecycle Management" icon={<GitBranch className="h-4 w-4" />}>
                Guide businesses through all lifecycle stages
              </ListItem>
              <ListItem href="/testing" title="Business Analytics" icon={<Sparkles className="h-4 w-4" />}>
                Track KPIs and business performance
              </ListItem>
              <ListItem href="/testing" title="Growth Strategies" icon={<Zap className="h-4 w-4" />}>
                Optimize business growth and scaling
              </ListItem>
              <ListItem href="/testing" title="Market Analysis" icon={<Bot className="h-4 w-4" />}>
                Research markets and opportunities
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/api-config" title="API Configuration" icon={<Settings className="h-4 w-4" />}>
                Set up and manage API integrations
              </ListItem>
              <ListItem href="/api-config" title="Agent Settings" icon={<Bot className="h-4 w-4" />}>
                Configure agent capabilities and tools
              </ListItem>
              <ListItem href="/api-config" title="Business Settings" icon={<Building2 className="h-4 w-4" />}>
                Manage business lifecycle parameters
              </ListItem>
              <ListItem href="/api-config" title="System Preferences" icon={<Settings className="h-4 w-4" />}>
                Adjust platform-wide settings
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="gap-2">
            <FileText className="h-4 w-4" />
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/docs" title="Documentation" icon={<BookOpen className="h-4 w-4" />}>
                Comprehensive guides and API references
              </ListItem>
              <ListItem href="/testing" title="Testing Suite" icon={<TestTube className="h-4 w-4" />}>
                Test agents and validate performance
              </ListItem>
              <ListItem href="/docs" title="Tutorials" icon={<BookOpen className="h-4 w-4" />}>
                Step-by-step guides and examples
              </ListItem>
              <ListItem href="/docs" title="API Reference" icon={<FileText className="h-4 w-4" />}>
                Detailed API documentation
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default NavigationMenuComponent;