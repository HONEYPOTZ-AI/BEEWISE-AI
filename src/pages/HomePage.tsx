
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Network, 
  Database, 
  Users, 
  Building2, 
  Scale, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  BarChart3,
  Rocket,
  Palette,
  Calculator,
  Shield,
  Cloud,
  Server,
  Code,
  Layers,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Globe
} from 'lucide-react';

const HomePage = () => {
  const agentTypes = [
    {
      name: 'Startup Agent',
      role: 'Business Strategy & Planning',
      tools: 'Market Analysis, Business Model Canvas, Competitive Intelligence',
      icon: Rocket,
      color: 'bg-blue-500'
    },
    {
      name: 'Branding Agent',
      role: 'Brand Identity & Design',
      tools: 'Logo Design, Brand Guidelines, Visual Identity Systems',
      icon: Palette,
      color: 'bg-purple-500'
    },
    {
      name: 'Legal Agent',
      role: 'Legal Compliance & Documentation',
      tools: 'Contract Analysis, Regulatory Compliance, IP Protection',
      icon: Scale,
      color: 'bg-green-500'
    },
    {
      name: 'Finance Agent',
      role: 'Financial Management & Analysis',
      tools: 'Financial Modeling, Budget Planning, Investment Analysis',
      icon: Calculator,
      color: 'bg-yellow-500'
    },
    {
      name: 'Marketing Agent',
      role: 'Marketing Strategy & Campaigns',
      tools: 'Campaign Management, SEO Optimization, Content Strategy',
      icon: TrendingUp,
      color: 'bg-pink-500'
    },
    {
      name: 'Sales Agent',
      role: 'Sales Process & Lead Management',
      tools: 'CRM Integration, Lead Scoring, Sales Funnel Optimization',
      icon: Target,
      color: 'bg-indigo-500'
    },
    {
      name: 'Support Agent',
      role: 'Customer Service & Support',
      tools: 'Ticket Management, Knowledge Base, Customer Satisfaction',
      icon: MessageSquare,
      color: 'bg-red-500'
    },
    {
      name: 'Analytics Agent',
      role: 'Business Intelligence & Insights',
      tools: 'Data Visualization, Predictive Analytics, Performance Metrics',
      icon: BarChart3,
      color: 'bg-teal-500'
    }
  ];

  const lifecycleSteps = [
    {
      step: '1',
      title: 'Business Initialization',
      description: 'AI agents analyze market opportunities and create comprehensive business plans',
      icon: Brain
    },
    {
      step: '2',
      title: 'Resource Allocation',
      description: 'Intelligent distribution of resources across different business functions',
      icon: Network
    },
    {
      step: '3',
      title: 'Execution & Monitoring',
      description: 'Autonomous execution of business processes with real-time monitoring',
      icon: Zap
    },
    {
      step: '4',
      title: 'Performance Optimization',
      description: 'Continuous analysis and optimization of business performance metrics',
      icon: TrendingUp
    },
    {
      step: '5',
      title: 'Strategic Evolution',
      description: 'Adaptive strategy evolution based on market feedback and performance data',
      icon: CheckCircle
    }
  ];

  const techStack = {
    frontend: ['React 18+', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vite'],
    backend: ['Node.js', 'Python', 'FastAPI', 'GraphQL', 'WebSocket'],
    infrastructure: ['AWS', 'Docker', 'Kubernetes', 'Redis', 'PostgreSQL'],
    frameworks: ['LangChain', 'OpenAI API', 'Hugging Face', 'TensorFlow', 'PyTorch']
  };

  const monetizationModels = [
    {
      title: 'SaaS Subscription',
      description: 'Tiered monthly/annual subscriptions based on agent usage and features',
      pricing: '$99 - $999/month',
      features: ['Multi-agent access', 'API integrations', 'Analytics dashboard', '24/7 support'],
      icon: DollarSign,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Enterprise Licensing',
      description: 'Custom enterprise solutions with on-premise deployment options',
      pricing: 'Custom Pricing',
      features: ['White-label solutions', 'Custom integrations', 'Dedicated support', 'SLA guarantees'],
      icon: Building2,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      title: 'Pay-per-Use',
      description: 'Flexible usage-based pricing for specific agent services and tasks',
      pricing: '$0.10 - $5.00/task',
      features: ['No monthly fees', 'Scale as needed', 'Task-based billing', 'Real-time tracking'],
      icon: Calculator,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BEEWISE-AI
              </span>
            </div>
            <div className="hidden md:flex space-x-6">
              <button onClick={() => scrollToSection('hero')} className="text-slate-600 hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('core-layers')} className="text-slate-600 hover:text-blue-600 transition-colors">Core Layers</button>
              <button onClick={() => scrollToSection('agents')} className="text-slate-600 hover:text-blue-600 transition-colors">Agents</button>
              <button onClick={() => scrollToSection('lifecycle')} className="text-slate-600 hover:text-blue-600 transition-colors">Lifecycle</button>
              <button onClick={() => scrollToSection('tech-stack')} className="text-slate-600 hover:text-blue-600 transition-colors">Tech Stack</button>
              <button onClick={() => scrollToSection('monetization')} className="text-slate-600 hover:text-blue-600 transition-colors">Monetization</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
                Next-Generation AI Platform
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                BEEWISE-AI
              </h1>
              <h2 className="text-2xl md:text-3xl text-slate-700 mb-6 font-light">
                Multi-Agent Architecture Platform
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Revolutionary autonomous business management system powered by intelligent AI agents. 
                Transform your business operations with cutting-edge multi-agent orchestration technology.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Rocket className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-blue-200 hover:bg-blue-50">
                <Globe className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">8+ Specialized Agents</h3>
                <p className="text-slate-600">Comprehensive business function coverage</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Autonomous Operations</h3>
                <p className="text-slate-600">Self-managing business processes</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Intelligent Analytics</h3>
                <p className="text-slate-600">Data-driven decision making</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Layers Section */}
      <section id="core-layers" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Core Architecture Layers</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three fundamental layers that power our intelligent multi-agent system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-2xl transition-shadow duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Agent Orchestration Layer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 mb-4">
                  Intelligent coordination and management of multiple AI agents working in harmony to achieve business objectives.
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2">Task Distribution</Badge>
                  <Badge variant="secondary" className="mr-2">Conflict Resolution</Badge>
                  <Badge variant="secondary">Performance Monitoring</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-shadow duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Agent Registry & Discovery</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 mb-4">
                  Dynamic agent registration, capability discovery, and intelligent matching for optimal task assignment.
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2">Service Discovery</Badge>
                  <Badge variant="secondary" className="mr-2">Capability Matching</Badge>
                  <Badge variant="secondary">Load Balancing</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-shadow duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Shared Memory & Context</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 mb-4">
                  Unified knowledge base and context sharing system enabling seamless collaboration between agents.
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2">Knowledge Graph</Badge>
                  <Badge variant="secondary" className="mr-2">Context Sharing</Badge>
                  <Badge variant="secondary">Memory Management</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agent Types Section */}
      <section id="agents" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Specialized AI Agents</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Eight intelligent agents covering every aspect of your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentTypes.map((agent, index) => {
              const IconComponent = agent.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-slate-700 mb-2">{agent.role}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{agent.tools}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Autonomous Business Lifecycle */}
      <section id="lifecycle" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Autonomous Business Lifecycle</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Five-step intelligent process for complete business automation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {lifecycleSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex items-start mb-8 last:mb-0">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <Card className="flex-1 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <IconComponent className="h-6 w-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-slate-600">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < lifecycleSteps.length - 1 && (
                    <div className="absolute left-8 mt-16 w-0.5 h-8 bg-gradient-to-b from-blue-200 to-purple-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Technology Stack</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Built with cutting-edge technologies for maximum performance and scalability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Code className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-white">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {techStack.frontend.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-300/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Server className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <CardTitle className="text-white">Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {techStack.backend.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-200 border-green-300/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Cloud className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {techStack.infrastructure.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-300/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Brain className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                <CardTitle className="text-white">AI Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {techStack.frameworks.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-teal-500/20 text-teal-200 border-teal-300/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Monetization Models */}
      <section id="monetization" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Monetization Models</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Flexible revenue models designed to scale with your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {monetizationModels.map((model, index) => {
              const IconComponent = model.icon;
              return (
                <Card key={index} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${model.gradient}`} />
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${model.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{model.title}</CardTitle>
                    <p className="text-2xl font-bold text-blue-600">{model.pricing}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4 text-center">{model.description}</p>
                    <div className="space-y-2">
                      {model.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-6" variant="outline">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">BEEWISE-AI</span>
            </div>
            <p className="text-slate-400 mb-6">
              Revolutionizing business operations through intelligent multi-agent systems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started Today
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                Request Demo
              </Button>
            </div>
            <Separator className="my-8 bg-slate-700" />
            <p className="text-slate-400 text-sm">
              © 2024 BEEWISE-AI. All rights reserved. | Built with cutting-edge AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
