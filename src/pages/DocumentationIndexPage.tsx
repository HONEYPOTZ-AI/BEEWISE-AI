import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Code,
  Zap,
  Building2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Shield,
  Users,
  Wrench,
  ArrowRight,
  Search,
  Download } from
'lucide-react';

const DocumentationIndexPage: React.FC = () => {
  const documentationSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Begin your journey with BeeWise-AI platform',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-800',
    articles: 5
  },
  {
    id: 'agent-types',
    title: 'Agent Types & Capabilities',
    description: 'Explore specialized AI agents and their functions',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-purple-100 text-purple-800',
    articles: 8
  },
  {
    id: 'business-lifecycle',
    title: 'Business Lifecycle Management',
    description: 'Guide businesses through all stages of growth',
    icon: <Building2 className="h-6 w-6" />,
    color: 'bg-green-100 text-green-800',
    articles: 6
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'Complete API documentation and integration guides',
    icon: <Code className="h-6 w-6" />,
    color: 'bg-gray-100 text-gray-800',
    articles: 12
  },
  {
    id: 'system-architecture',
    title: 'System Architecture',
    description: 'Understand the platform architecture and components',
    icon: <Cpu className="h-6 w-6" />,
    color: 'bg-cyan-100 text-cyan-800',
    articles: 7
  },
  {
    id: 'user-guides',
    title: 'User Guides',
    description: 'Step-by-step instructions for platform features',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-orange-100 text-orange-800',
    articles: 9
  },
  {
    id: 'technical-docs',
    title: 'Technical Documentation',
    description: 'In-depth technical details for developers',
    icon: <Wrench className="h-6 w-6" />,
    color: 'bg-red-100 text-red-800',
    articles: 11
  },
  {
    id: 'security-compliance',
    title: 'Security & Compliance',
    description: 'Security measures and compliance information',
    icon: <Shield className="h-6 w-6" />,
    color: 'bg-indigo-100 text-indigo-800',
    articles: 4
  }];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Documentation Center</h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive resources for BeeWise-AI platform
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Search Docs
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">BeeWise-AI Documentation</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our comprehensive documentation to learn how to leverage the full power of 
            our multi-agent business automation platform.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button asChild>
              <Link to="/documentation?category=getting-started">
                <BookOpen className="h-4 w-4 mr-2" />
                Getting Started Guide
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/documentation?category=api-reference">
                <Code className="h-4 w-4 mr-2" />
                API Reference
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/documentation?category=agent-types">
                <Zap className="h-4 w-4 mr-2" />
                Agent Capabilities
              </Link>
            </Button>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">Documentation Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentationSections.map((section) =>
            <Card key={section.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4`}>
                    {section.icon}
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {section.title}
                    <Badge variant="secondary">{section.articles} articles</Badge>
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full justify-between">
                    <Link to={`/documentation?category=${section.id}`}>
                      Explore Documentation
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">Popular Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                  <span>Getting Started with BeeWise-AI</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Learn how to set up your first business and deploy AI agents.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/documentation#1">Read Article</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-purple-500 mt-0.5" />
                  <span>Agent Development Tutorial</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Create custom agents for specific business functions.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/documentation#3">Read Article</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start gap-2">
                  <Code className="h-5 w-5 text-gray-500 mt-0.5" />
                  <span>API Configuration Guide</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Configure external API integrations for your agents.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/documentation#2">Read Article</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h3 className="text-2xl font-semibold mb-6">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/api-config">
                <Settings className="h-5 w-5 mb-2" />
                <span>API Configuration</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/testing">
                <TestTube className="h-5 w-5 mb-2" />
                <span>Testing Suite</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/documentation?category=tutorials">
                <BookOpen className="h-5 w-5 mb-2" />
                <span>Tutorials</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
              <Link to="/documentation?category=reference">
                <FileText className="h-5 w-5 mb-2" />
                <span>API Reference</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>);

};

export default DocumentationIndexPage;