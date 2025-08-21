import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from  '@/components/ThemeToggle';
import EnhancedButton from  '@/components/EnhancedButton';
import { AnimatedCard } from '@/components/AnimatedCard';
import ParticleBackground from  '@/components/ParticleBackground';
import LearnMoreButton from '@/components/LearnMoreButton';
import { 
  Settings, 
  TestTube, 
  Monitor, 
  Zap, 
  Shield, 
  Database,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Rocket,
  Users,
  Globe,
  Code
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Configuration Management",
      description: "Create, read, update, and delete API configurations with comprehensive validation and version control.",
      section: "features",
      benefits: ["CRUD Operations", "Version Control", "Validation"]
    },
    {
      icon: <TestTube className="h-6 w-6" />,
      title: "Testing Suite", 
      description: "Comprehensive automated testing with real-time validation, performance monitoring, and detailed reporting.",
      section: "testing",
      benefits: ["Automated Tests", "Performance Metrics", "Real-time Validation"]
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "Health Monitoring",
      description: "Real-time health checks, uptime monitoring, and automated alerting for all your API endpoints.",
      section: "best-practices",
      benefits: ["Real-time Monitoring", "Automated Alerts", "Uptime Tracking"]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security & Compliance",
      description: "Built-in security features with role-based access control, audit logging, and compliance tracking.",
      section: "best-practices",
      benefits: ["Role-based Access", "Audit Logging", "Compliance"]
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Management",
      description: "Efficient data storage with PostgreSQL backend, backup solutions, and data migration tools.",
      section: "deployment",
      benefits: ["PostgreSQL Backend", "Automated Backups", "Migration Tools"]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics & Reporting",
      description: "Detailed analytics, performance reports, and insights to optimize your API configurations.",
      section: "testing",
      benefits: ["Performance Analytics", "Custom Reports", "Optimization Insights"]
    }
  ];

  const quickActions = [
    {
      title: "Get Started",
      description: "Learn the basics and set up your first configuration",
      link: "/documentation?section=getting-started",
      icon: <Rocket className="h-5 w-5" />,
      section: "getting-started"
    },
    {
      title: "API Configuration",
      description: "Manage and configure your API endpoints",
      link: "/apiconfig",
      icon: <Settings className="h-5 w-5" />,
      section: "features"
    },
    {
      title: "Run Tests",
      description: "Execute comprehensive API tests and view results",
      link: "/apitesting",
      icon: <TestTube className="h-5 w-5" />,
      section: "testing"
    }
  ];

  const integrationExamples = [
    {
      name: "REST APIs",
      description: "Full support for RESTful API configurations",
      icon: <Code className="h-5 w-5" />,
      section: "api-reference"
    },
    {
      name: "OAuth 2.0",
      description: "Secure authentication and authorization",
      icon: <Shield className="h-5 w-5" />,
      section: "best-practices"
    },
    {
      name: "Microservices",
      description: "Manage multiple microservice endpoints",
      icon: <Globe className="h-5 w-5" />,
      section: "features"
    },
    {
      name: "Team Collaboration",
      description: "Multi-user access with role-based permissions",
      icon: <Users className="h-5 w-5" />,
      section: "best-practices"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      <ParticleBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">API Config Manager</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LearnMoreButton 
                section="overview"
                mode="link"
                label="Documentation"
                tooltip="View complete documentation"
                className="text-muted-foreground"
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur-sm">
              <Zap className="h-4 w-4 mr-1" />
              Next-Generation API Management
            </Badge>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Streamline Your API Configuration Management
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A comprehensive platform for managing API configurations with built-in testing, 
              monitoring, and deployment capabilities. Designed for teams that demand reliability and efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <EnhancedButton asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/apiconfig">
                  <Settings className="h-5 w-5 mr-2" />
                  Get Started
                </Link>
              </EnhancedButton>
              
              <LearnMoreButton 
                section="getting-started"
                size="lg"
                variant="outline"
                label="Quick Start Guide"
                tooltip="Learn how to get started with API configuration management"
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Easy Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Real-time Testing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Enterprise Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage, test, and monitor your API configurations effectively
            </p>
            <div className="mt-6">
              <LearnMoreButton 
                section="features"
                mode="link"
                label="View all features"
                tooltip="Explore detailed feature documentation"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <Card className="h-full bg-background/50 backdrop-blur-sm border-muted hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                      <LearnMoreButton 
                        section={feature.section}
                        mode="icon"
                        tooltip={`Learn more about ${feature.title}`}
                        variant="ghost"
                        className="opacity-70 hover:opacity-100"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">
                      {feature.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {feature.benefits.map((benefit, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Quick Actions</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Jump right into the most common tasks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <Card className="text-center bg-background/50 backdrop-blur-sm border-muted hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                      {action.icon}
                    </div>
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                    <CardDescription className="text-base">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col gap-3">
                      <Button asChild className="w-full">
                        <Link to={action.link}>
                          Start Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <LearnMoreButton 
                        section={action.section}
                        mode="link"
                        label="Learn more"
                        tooltip={`Learn more about ${action.title}`}
                        className="text-muted-foreground"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Examples */}
      <section className="relative z-10 py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Built for Integration</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seamlessly integrate with your existing tools and workflows
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationExamples.map((integration, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <Card className="text-center bg-background/50 backdrop-blur-sm border-muted hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto p-2 rounded-lg bg-primary/10 text-primary w-fit mb-2">
                      {integration.icon}
                    </div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <LearnMoreButton 
                      section={integration.section}
                      mode="link"
                      label="Learn more"
                      tooltip={`Learn more about ${integration.name} integration`}
                      size="sm"
                    />
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Stats Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <AnimatedCard>
            <Card className="bg-gradient-to-r from-primary/10 via-background/50 to-secondary/10 backdrop-blur-sm border-muted">
              <CardContent className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-3xl font-bold mb-2">99.9%</h4>
                    <p className="text-muted-foreground">Uptime Reliability</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-3xl font-bold mb-2">&lt;100ms</h4>
                    <p className="text-muted-foreground">Average Response Time</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-3xl font-bold mb-2">1000+</h4>
                    <p className="text-muted-foreground">API Configurations Managed</p>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="text-center">
                  <p className="text-lg text-muted-foreground mb-6">
                    Ready to optimize your API management workflow?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link to="/apiconfig">
                        Start Managing APIs
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>
                    <LearnMoreButton 
                      section="deployment"
                      size="lg"
                      variant="outline"
                      label="Deployment Guide"
                      tooltip="Learn how to deploy and configure the system"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-background/80 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Settings className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">API Config Manager</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <LearnMoreButton 
                section="overview"
                mode="link"
                label="Documentation"
                tooltip="View complete system documentation"
                className="text-muted-foreground hover:text-foreground"
              />
              <LearnMoreButton 
                section="api-reference"
                mode="link"
                label="API Reference"
                tooltip="API endpoints and usage examples"
                className="text-muted-foreground hover:text-foreground"
              />
              <LearnMoreButton 
                section="best-practices"
                mode="link"
                label="Best Practices"
                tooltip="Guidelines and recommendations"
                className="text-muted-foreground hover:text-foreground"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
