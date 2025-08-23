
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from  '@/components/ThemeToggle';
import AgentDashboard from '@/components/AgentDashboard';
import BusinessDashboard from '@/components/BusinessDashboard';
import TaskManager from '@/components/TaskManager';
import NavigationMenuComponent from '@/components/NavigationMenu';
import { 
  Bot, 
  Building2, 
  Zap, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Play,
  Settings,
  FileText,
  TestTube,
  CheckSquare
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: 'Multi-Agent Orchestration',
      description: 'Deploy specialized AI agents for every business function - from startup ideation to growth optimization.'
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: 'Autonomous Business Lifecycle',
      description: 'Guide businesses through ideation, formation, launch, growth, and optimization stages automatically.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Agent-as-a-Service (AaaS)',
      description: 'Flexible pricing models including pay-per-task, subscriptions, and revenue sharing.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Enterprise Security',
      description: 'TEE-enabled infrastructure with robust security, compliance, and data protection.'
    }
  ];

  const agentTypes = [
    { name: 'Startup Agent', role: 'Business model generation, niche analysis', tools: 'GPT-4, Market Research APIs' },
    { name: 'Branding Agent', role: 'Logo, name, tagline, domain suggestions', tools: 'DALL•E, Namecheap API' },
    { name: 'Legal Agent', role: 'Incorporation, contracts, compliance', tools: 'LegalZoom, Contract AI' },
    { name: 'Finance Agent', role: 'Pricing, budgeting, revenue modeling', tools: 'QuickBooks, Financial APIs' },
    { name: 'Marketing Agent', role: 'Ads, SEO, social media, email campaigns', tools: 'Meta Ads, Google Ads' },
    { name: 'Sales Agent', role: 'CRM, lead gen, outreach', tools: 'Salesforce, LinkedIn' },
    { name: 'Support Agent', role: 'Customer service, ticketing, chatbot', tools: 'Zendesk, Intercom' },
    { name: 'Analytics Agent', role: 'KPI tracking, dashboards, insights', tools: 'GA4, Mixpanel' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BeeWise-AI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NavigationMenuComponent />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Next-Gen Multi-Agent
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Business Platform
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Deploy specialized AI agents to automate every aspect of your business lifecycle. 
              From ideation to optimization, let our autonomous agent orchestration handle it all.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/api-config">
              <Button size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Get Started
              </Button>
            </Link>
            <Link to="/testing">
              <Button variant="outline" size="lg" className="gap-2">
                <TestTube className="h-4 w-4" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="agents" className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">Control Center</h3>
                <p className="text-muted-foreground">Monitor and manage your AI-powered business ecosystem</p>
              </div>
              <TabsList className="grid w-full sm:w-auto grid-cols-3">
                <TabsTrigger value="agents">Agent Orchestration</TabsTrigger>
                <TabsTrigger value="businesses">Business Lifecycle</TabsTrigger>
                <TabsTrigger value="tasks">Task Management</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="agents">
              <AgentDashboard />
            </TabsContent>

            <TabsContent value="businesses">
              <BusinessDashboard />
            </TabsContent>

            <TabsContent value="tasks">
              <TaskManager />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-3xl font-bold">Platform Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for building and managing autonomous business operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Marketplace Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-3xl font-bold">AI Agent Marketplace</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized agents for every business stage and function
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentTypes.slice(0, 8).map((agent, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{agent.name}</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    <strong>Tools:</strong> {agent.tools}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/testing">
              <Button variant="outline" className="gap-2">
                Explore All Agents
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-3xl font-bold">Quick Actions</h3>
            <p className="text-muted-foreground">Jump into key platform features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link to="/api-config">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-primary" />
                    <CardTitle>API Configuration</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configure API endpoints, authentication, and integration settings
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/testing">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TestTube className="h-6 w-6 text-primary" />
                    <CardTitle>Agent Testing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Test agent performance, run simulations, and validate workflows
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/documentation">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <CardTitle>Documentation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access comprehensive guides, API references, and tutorials
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-6 w-6 text-primary" />
                  <CardTitle>Task Orchestration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage task assignments, track progress, and optimize workflows
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 BeeWise-AI. Next-generation multi-agent business automation platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
