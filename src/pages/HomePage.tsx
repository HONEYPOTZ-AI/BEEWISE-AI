import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import EnhancedButton from '@/components/EnhancedButton';
import { AnimatedCard } from '@/components/AnimatedCard';
import ParticleBackground from '@/components/ParticleBackground';
import {
  TestTube,
  Settings,
  FileText,
  Zap,
  Shield,
  Target,
  Globe,
  ArrowRight,
  CheckCircle,
  Code,
  Database,
  BookOpen,
  Play,
  BarChart3,
  Bot,
  Activity,
  Brain,
  MessageSquare } from
'lucide-react';

const HomePage = () => {
  const features = [
  {
    name: 'API Configuration',
    description: 'Easily configure and manage multiple API endpoints with authentication',
    icon: Settings,
    color: 'bg-blue-500',
    href: '/api-config'
  },
  {
    name: 'API Testing',
    description: 'Comprehensive testing suite for API endpoints with detailed reports',
    icon: TestTube,
    color: 'bg-green-500',
    href: '/api-testing'
  },
  {
    name: 'Memory Management',
    description: 'Advanced memory management system for AI agents with context persistence',
    icon: Brain,
    color: 'bg-purple-600',
    href: '/memory-management'
  },
  {
    name: 'Context Sessions',
    description: 'Real-time session monitoring and context continuity management',
    icon: MessageSquare,
    color: 'bg-teal-500',
    href: '/context-sessions'
  },
  {
    name: 'Agent Marketplace',
    description: 'Discover and deploy AI agents for enhanced API testing and automation',
    icon: Bot,
    color: 'bg-indigo-500',
    href: '/agent-marketplace'
  },
  {
    name: 'Agent Orchestration',
    description: 'Coordinate multiple AI agents for complex task workflows and automation',
    icon: Activity,
    color: 'bg-indigo-500',
    href: '/orchestration'
  },
  {
    name: 'Test Automation',
    description: 'Automated testing workflows and continuous integration support',
    icon: Zap,
    color: 'bg-purple-500',
    href: '/testing'
  },
  {
    name: 'Documentation',
    description: 'Complete guides and API reference documentation',
    icon: BookOpen,
    color: 'bg-orange-500',
    href: '/documentation'
  }];


  const benefits = [
  {
    title: 'Fast & Reliable',
    description: 'Lightning-fast API testing with reliable results and detailed metrics',
    icon: Zap
  },
  {
    title: 'Secure Testing',
    description: 'Secure credential management and encrypted API communications',
    icon: Shield
  },
  {
    title: 'Comprehensive Reports',
    description: 'Detailed test reports with performance metrics and analytics',
    icon: BarChart3
  },
  {
    title: 'Easy Integration',
    description: 'Simple integration with your existing development workflow',
    icon: Target
  }];


  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
                <TestTube className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold gradient-text">
                API Testing Platform
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/apiconfig"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced"
                  data-testid="nav-apiconfig">

                  API Config
                </Link>
                <Link
                  to="/apitesting"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced"
                  data-testid="nav-apitesting">

                  Testing
                </Link>
                <Link
                  to="/testing"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced"
                  data-testid="nav-testing">

                  Automation
                </Link>
                <Link
                  to="/documentation"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced"
                  data-testid="nav-documentation">

                  Documentation
                </Link>
                <Link
                  to="/memory-sessions-dashboard"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced"
                  data-testid="nav-memory-sessions">
                  Memory & Sessions
                </Link>
                <Link
                  to="/agent-marketplace"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced"
                  data-testid="nav-agent-marketplace">
                  Agents
                </Link>
                <Link
                  to="/orchestration"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced"
                  data-testid="nav-orchestration">
                  Orchestration
                </Link>
              </div>
              <ThemeToggle data-testid="theme-toggle" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-bounce-slow" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge className="mb-4 glass border-primary/20 text-primary shadow-glow animate-pulse-slow">
                ✨ Professional API Testing Platform
              </Badge>
              <h1 className="h1 mb-6 text-gradient-primary animate-float" data-testid="main-heading">
                API Testing Made Simple
              </h1>
              <h2 className="h2 text-muted-foreground mb-6 font-light">
                Configure, Test, and Monitor Your APIs
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                A comprehensive platform for API testing and management. Configure your endpoints, 
                run automated tests, and monitor performance with detailed analytics and reporting.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/apiconfig" data-testid="get-started-btn">
                <EnhancedButton
                  size="lg"
                  gradient="primary"
                  glow={true}
                  className="text-white">

                  <Play className="mr-2 h-5 w-5" />
                  Get Started
                </EnhancedButton>
              </Link>
              <Link to="/documentation" data-testid="learn-more-btn">
                <EnhancedButton
                  size="lg"
                  variant="outline"
                  className="glass border-border/50 hover:bg-accent/50 shadow-lg hover:shadow-xl">

                  <Globe className="mr-2 h-5 w-5" />
                  Learn More
                </EnhancedButton>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="text-center group">
                <div className="card-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="h4 mb-2 group-hover:text-primary transition-colors duration-300">Easy Configuration</h3>
                <p className="text-muted-foreground">Simple API endpoint setup</p>
              </div>
              <div className="text-center group">
                <div className="card-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <TestTube className="h-8 w-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="h4 mb-2 group-hover:text-primary transition-colors duration-300">Automated Testing</h3>
                <p className="text-muted-foreground">Comprehensive test suites</p>
              </div>
              <div className="text-center group">
                <div className="card-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="h4 mb-2 group-hover:text-primary transition-colors duration-300">Detailed Analytics</h3>
                <p className="text-muted-foreground">Performance monitoring</p>
              </div>
              <Link to="/documentation" className="text-center group" data-testid="documentation-card">
                <div className="card-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="h4 mb-2 group-hover:text-primary transition-colors duration-300">Documentation</h3>
                <p className="text-muted-foreground">Complete API guides</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="h2 mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to test, monitor, and manage your APIs effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link key={index} to={feature.href} data-testid={`feature-${feature.name.toLowerCase().replace(' ', '-')}`}>
                  <Card className="card-enhanced group interactive h-full">
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                        <IconComponent className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                        {feature.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform duration-300">
                        Learn more <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>);

            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="h2 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for developers, designed for efficiency and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <AnimatedCard key={index} variant="enhanced" delay={0.1 * index} className="group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <CardTitle className="h3 group-hover:text-primary transition-colors duration-300">
                        {benefit.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </AnimatedCard>);

            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Testing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get started with our API testing platform today and streamline your development workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apiconfig" data-testid="cta-start-testing">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <TestTube className="mr-2 h-5 w-5" />
                Start Testing Now
              </Button>
            </Link>
            <Link to="/documentation" data-testid="cta-view-docs">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-black text-white">
                <FileText className="mr-2 h-5 w-5" />
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TestTube className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">API Testing Platform</span>
            </div>
            <p className="text-slate-400 mb-6">
              Professional API testing and management made simple
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/apiconfig" data-testid="footer-get-started">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/documentation" data-testid="footer-documentation">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Browse Documentation
                </Button>
              </Link>
            </div>
            <Separator className="my-8 bg-slate-700" />
            <p className="text-slate-400 text-sm">
              © 2024 API Testing Platform. All rights reserved. | Built for developers, by developers
            </p>
          </div>
        </div>
      </footer>
    </div>);

};

export default HomePage;