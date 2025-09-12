import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from '@/components/ThemeToggle';
import BusinessDashboard from '@/components/BusinessDashboard';
import AgentDashboard from '@/components/AgentDashboard';
import EnhancedTaskManager from '@/components/EnhancedTaskManager';
import NavigationMenuComponent from '@/components/NavigationMenu';
import {
  Building2,
  Bot,
  Target,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Activity,
  BarChart3,
  Settings,
  Workflow } from
'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
  {
    icon: <Building2 className="w-8 h-8 text-primary" />,
    title: "Business Lifecycle Management",
    description: "Visualize and manage complete business lifecycles with intelligent stage transitions and progress tracking.",
    features: ["Interactive stage visualization", "Automated workflow management", "Progress indicators", "Success criteria tracking"]
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: "Intelligent Agent Assignment",
    description: "Assign AI agents to specific business stages based on requirements and recommendations.",
    features: ["Smart agent matching", "Performance monitoring", "Cost optimization", "Multi-stage assignments"]
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Task Management Integration",
    description: "Seamlessly integrate task management with lifecycle stages for complete workflow automation.",
    features: ["Stage-specific tasks", "Automated assignments", "Progress tracking", "Performance analytics"]
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "Advanced Analytics",
    description: "Get insights into business performance, agent efficiency, and lifecycle optimization opportunities.",
    features: ["Performance metrics", "Predictive analytics", "ROI tracking", "Custom dashboards"]
  }];


  const quickStats = [
  { label: "Active Businesses", value: "24", icon: <Building2 className="w-5 h-5" />, trend: "+12%" },
  { label: "Available Agents", value: "156", icon: <Bot className="w-5 h-5" />, trend: "+8%" },
  { label: "Completed Tasks", value: "2,847", icon: <CheckCircle className="w-5 h-5" />, trend: "+23%" },
  { label: "Success Rate", value: "94.2%", icon: <Star className="w-5 h-5" />, trend: "+2.1%" }];


  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg beewise-gradient">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">BeeWise-AI</h1>
                  <p className="text-xs text-muted-foreground">Business Lifecycle Manager</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NavigationMenuComponent />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Powered by Intelligent AI Agents</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent">
              Revolutionize Business Management
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transform your business operations with AI-powered lifecycle management, intelligent agent assignments, 
              and automated workflow orchestration. Experience the future of business automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="beewise-gradient text-lg px-8 py-6 h-auto">

                <Activity className="w-5 h-5 mr-2" />
                Start Managing Lifecycles
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto border-primary/20 hover:border-primary/40">

                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {quickStats.map((stat, index) =>
              <Card key={index} className="business-card">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {stat.trend}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Business Management</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage, automate, and optimize your business processes in one intelligent platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) =>
            <Card key={index} className="business-card workflow-transition">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) =>
                  <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                  )}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="businesses" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Integrated Management Dashboard</h2>
              <p className="text-muted-foreground mb-6">
                Access all your business management tools in one unified interface
              </p>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="businesses" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Businesses
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Agents
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Tasks
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="businesses" className="fade-in">
              <BusinessDashboard />
            </TabsContent>

            <TabsContent value="agents" className="fade-in">
              <AgentDashboard />
            </TabsContent>

            <TabsContent value="tasks" className="fade-in">
              <EnhancedTaskManager />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-amber-500/5 to-primary/5">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses already using BeeWise-AI to streamline operations, 
              improve efficiency, and achieve unprecedented growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="beewise-gradient text-lg px-8 py-6 h-auto">

                <Workflow className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
                onClick={() => navigate('/documentation')}>

                <Settings className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg beewise-gradient">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">BeeWise-AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Intelligent business lifecycle management powered by AI agents.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary">Business Management</Link></li>
                <li><Link to="/" className="hover:text-primary">Agent Assignment</Link></li>
                <li><Link to="/" className="hover:text-primary">Task Automation</Link></li>
                <li><Link to="/" className="hover:text-primary">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/documentation" className="hover:text-primary">Documentation</Link></li>
                <li><Link to="/api-testing" className="hover:text-primary">API Testing</Link></li>
                <li><Link to="/testing" className="hover:text-primary">Testing Suite</Link></li>
                <li><Link to="/api-config" className="hover:text-primary">Configuration</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 BeeWise-AI. All rights reserved.</p>
            <p>Built with intelligent automation and care.</p>
          </div>
        </div>
      </footer>
    </div>);

};

export default HomePage;