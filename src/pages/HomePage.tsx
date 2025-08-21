
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import EnhancedButton from '@/components/EnhancedButton';
import { AnimatedCard } from '@/components/AnimatedCard';
import ParticleBackground from '@/components/ParticleBackground';
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
  Globe } from
'lucide-react';

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
  }];


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
  }];


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
  }];


  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background hero-gradient noise-texture" data-id="omrntsrdo" data-path="src/pages/HomePage.tsx">
      <ParticleBackground />
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 w-full z-50" data-id="kgec6112x" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto px-4 py-4" data-id="mlbpl1ze4" data-path="src/pages/HomePage.tsx">
          <div className="flex items-center justify-between" data-id="qbgwngsnw" data-path="src/pages/HomePage.tsx">
            <div className="flex items-center space-x-2" data-id="gpkd0e6uw" data-path="src/pages/HomePage.tsx">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" data-id="yjqafu37w" data-path="src/pages/HomePage.tsx" />
              </div>
              <span className="text-2xl font-bold gradient-text" data-id="eywp4azm1" data-path="src/pages/HomePage.tsx">
                BEEWISE-AI
              </span>
            </div>
            <div className="flex items-center space-x-6" data-id="r0dwu8acn" data-path="src/pages/HomePage.tsx">
              <div className="hidden md:flex space-x-6">
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced" 
                  data-id="ikv6xqwpx" 
                  data-path="src/pages/HomePage.tsx"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('core-layers')} 
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced" 
                  data-id="1kfl5gegj" 
                  data-path="src/pages/HomePage.tsx"
                >
                  Core Layers
                </button>
                <button 
                  onClick={() => scrollToSection('agents')} 
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced" 
                  data-id="m270wve1r" 
                  data-path="src/pages/HomePage.tsx"
                >
                  Agents
                </button>
                <button 
                  onClick={() => scrollToSection('lifecycle')} 
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced" 
                  data-id="p6vpn4j4j" 
                  data-path="src/pages/HomePage.tsx"
                >
                  Lifecycle
                </button>
                <button 
                  onClick={() => scrollToSection('tech-stack')} 
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced" 
                  data-id="pszqgc7li" 
                  data-path="src/pages/HomePage.tsx"
                >
                  Tech Stack
                </button>
                <button 
                  onClick={() => scrollToSection('monetization')} 
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 focus-enhanced" 
                  data-id="owgqqam1o" 
                  data-path="src/pages/HomePage.tsx"
                >
                  Monetization
                </button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-16 relative overflow-hidden" data-id="y8nc6t41n" data-path="src/pages/HomePage.tsx">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-bounce-slow" />
        
        <div className="container mx-auto px-4 relative z-10" data-id="5ubr4hbxr" data-path="src/pages/HomePage.tsx">
          <div className="text-center max-w-4xl mx-auto" data-id="s1x9nok6k" data-path="src/pages/HomePage.tsx">
            <div className="mb-8" data-id="jmez9n14z" data-path="src/pages/HomePage.tsx">
              <Badge className="mb-4 glass border-primary/20 text-primary shadow-glow animate-pulse-slow" data-id="4cuvqwyjx" data-path="src/pages/HomePage.tsx">
                ✨ Next-Generation AI Platform
              </Badge>
              <h1 className="h1 mb-6 text-gradient-primary animate-float" data-id="s7y03wcj2" data-path="src/pages/HomePage.tsx">
                BEEWISE-AI
              </h1>
              <h2 className="h2 text-muted-foreground mb-6 font-light" data-id="ejkan9v5g" data-path="src/pages/HomePage.tsx">
                Multi-Agent Architecture Platform
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto" data-id="pavwhnagh" data-path="src/pages/HomePage.tsx">
                Revolutionary autonomous business management system powered by intelligent AI agents. 
                Transform your business operations with cutting-edge multi-agent orchestration technology.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12" data-id="foua6uzc5" data-path="src/pages/HomePage.tsx">
              <EnhancedButton 
                size="lg" 
                gradient="primary"
                glow={true}
                className="text-white"
                data-id="boilska8x" 
                data-path="src/pages/HomePage.tsx"
              >
                <Rocket className="mr-2 h-5 w-5" data-id="wr4a48cs8" data-path="src/pages/HomePage.tsx" />
                Get Started
              </EnhancedButton>
              <EnhancedButton 
                size="lg" 
                variant="outline" 
                className="glass border-border/50 hover:bg-accent/50 shadow-lg hover:shadow-xl" 
                data-id="z26z8iqox" 
                data-path="src/pages/HomePage.tsx"
              >
                <Globe className="mr-2 h-5 w-5" data-id="wxg6svex6" data-path="src/pages/HomePage.tsx" />
                Learn More
              </EnhancedButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" data-id="2rzaqtgjb" data-path="src/pages/HomePage.tsx">
              <div className="text-center group" data-id="smst6t5q1" data-path="src/pages/HomePage.tsx">
                <div className="card-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300" data-id="ex4w33g5j" data-path="src/pages/HomePage.tsx">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" data-id="7lwlw7108" data-path="src/pages/HomePage.tsx" />
                </div>
                <h3 className="h4 mb-2 group-hover:text-primary transition-colors duration-300" data-id="1ta7oukor" data-path="src/pages/HomePage.tsx">8+ Specialized Agents</h3>
                <p className="text-muted-foreground" data-id="4lyrf0koi" data-path="src/pages/HomePage.tsx">Comprehensive business function coverage</p>
              </div>
              <div className="text-center group" data-id="l0pxgppsi" data-path="src/pages/HomePage.tsx">
                <div className="card-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300" data-id="if39aun5k" data-path="src/pages/HomePage.tsx">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" data-id="9o5hrpem1" data-path="src/pages/HomePage.tsx" />
                </div>
                <h3 className="h4 mb-2 group-hover:text-primary transition-colors duration-300" data-id="ongwis9g" data-path="src/pages/HomePage.tsx">Autonomous Operations</h3>
                <p className="text-muted-foreground" data-id="htg7qqrxb" data-path="src/pages/HomePage.tsx">Self-managing business processes</p>
              </div>
              <div className="text-center group" data-id="5kv3ef9p4" data-path="src/pages/HomePage.tsx">
                <div className="card-glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300" data-id="7vnf3gb4w" data-path="src/pages/HomePage.tsx">
                  <TrendingUp className="h-8 w-8 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300" data-id="6exd6w9ea" data-path="src/pages/HomePage.tsx" />
                </div>
                <h3 className="h4 mb-2 group-hover:text-primary transition-colors duration-300" data-id="w22mxmoe6" data-path="src/pages/HomePage.tsx">Intelligent Analytics</h3>
                <p className="text-muted-foreground" data-id="bxp37yc5l" data-path="src/pages/HomePage.tsx">Data-driven decision making</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Layers Section */}
      <section id="core-layers" className="py-16 bg-background relative overflow-hidden" data-id="4gqkhjh6r" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto px-4" data-id="xv06784m0" data-path="src/pages/HomePage.tsx">
          <div className="text-center mb-12" data-id="q6wi4udi6" data-path="src/pages/HomePage.tsx">
            <h2 className="h2 mb-4" data-id="z7rmgwr7r" data-path="src/pages/HomePage.tsx">Core Architecture Layers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-id="vk0e9j536" data-path="src/pages/HomePage.tsx">
              Three fundamental layers that power our intelligent multi-agent system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-id="jsg2x60bc" data-path="src/pages/HomePage.tsx">
            <AnimatedCard variant="enhanced" delay={0.1} className="group" data-id="wz8x4zusz" data-path="src/pages/HomePage.tsx">
              <CardHeader className="text-center pb-4" data-id="y935k0qfp" data-path="src/pages/HomePage.tsx">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300" data-id="myd82isgn" data-path="src/pages/HomePage.tsx">
                  <Layers className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" data-id="cdkl40vml" data-path="src/pages/HomePage.tsx" />
                </div>
                <CardTitle className="h3 group-hover:text-primary transition-colors duration-300" data-id="mion9se78" data-path="src/pages/HomePage.tsx">Agent Orchestration Layer</CardTitle>
              </CardHeader>
              <CardContent className="text-center" data-id="k9qer4nsa" data-path="src/pages/HomePage.tsx">
                <p className="text-muted-foreground mb-4" data-id="nwib5em3b" data-path="src/pages/HomePage.tsx">
                  Intelligent coordination and management of multiple AI agents working in harmony to achieve business objectives.
                </p>
                <div className="space-y-2" data-id="5igyxobs9" data-path="src/pages/HomePage.tsx">
                  <Badge variant="secondary" className="mr-2 interactive" data-id="knghkrqut" data-path="src/pages/HomePage.tsx">Task Distribution</Badge>
                  <Badge variant="secondary" className="mr-2 interactive" data-id="jt2oe20vb" data-path="src/pages/HomePage.tsx">Conflict Resolution</Badge>
                  <Badge variant="secondary" className="interactive" data-id="5f7768wpd" data-path="src/pages/HomePage.tsx">Performance Monitoring</Badge>
                </div>
              </CardContent>
            </Card>

            <AnimatedCard variant="enhanced" delay={0.2} className="group" data-id="p6swbhh2a" data-path="src/pages/HomePage.tsx">
              <CardHeader className="text-center pb-4" data-id="upe48u3jp" data-path="src/pages/HomePage.tsx">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300" data-id="d4k2lalom" data-path="src/pages/HomePage.tsx">
                  <Network className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" data-id="wp2amuhgt" data-path="src/pages/HomePage.tsx" />
                </div>
                <CardTitle className="h3 group-hover:text-primary transition-colors duration-300" data-id="02vbqj721" data-path="src/pages/HomePage.tsx">Agent Registry & Discovery</CardTitle>
              </CardHeader>
              <CardContent className="text-center" data-id="w22urcns8" data-path="src/pages/HomePage.tsx">
                <p className="text-muted-foreground mb-4" data-id="zmkuelwxu" data-path="src/pages/HomePage.tsx">
                  Dynamic agent registration, capability discovery, and intelligent matching for optimal task assignment.
                </p>
                <div className="space-y-2" data-id="6so09u3im" data-path="src/pages/HomePage.tsx">
                  <Badge variant="secondary" className="mr-2 interactive" data-id="kprfdhwvy" data-path="src/pages/HomePage.tsx">Service Discovery</Badge>
                  <Badge variant="secondary" className="mr-2 interactive" data-id="e2rq462h5" data-path="src/pages/HomePage.tsx">Capability Matching</Badge>
                  <Badge variant="secondary" className="interactive" data-id="1vbu7mmoj" data-path="src/pages/HomePage.tsx">Load Balancing</Badge>
                </div>
              </CardContent>
            </Card>

            <AnimatedCard variant="enhanced" delay={0.3} className="group" data-id="a24q69szi" data-path="src/pages/HomePage.tsx">
              <CardHeader className="text-center pb-4" data-id="3mvqs0zot" data-path="src/pages/HomePage.tsx">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300" data-id="zskth6eb3" data-path="src/pages/HomePage.tsx">
                  <Database className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" data-id="oudvtfo7g" data-path="src/pages/HomePage.tsx" />
                </div>
                <CardTitle className="h3 group-hover:text-primary transition-colors duration-300" data-id="8xd8fv6xg" data-path="src/pages/HomePage.tsx">Shared Memory & Context</CardTitle>
              </CardHeader>
              <CardContent className="text-center" data-id="ae7cxudns" data-path="src/pages/HomePage.tsx">
                <p className="text-muted-foreground mb-4" data-id="b102r4x6m" data-path="src/pages/HomePage.tsx">
                  Unified knowledge base and context sharing system enabling seamless collaboration between agents.
                </p>
                <div className="space-y-2" data-id="ytjjq662z" data-path="src/pages/HomePage.tsx">
                  <Badge variant="secondary" className="mr-2 interactive" data-id="mn13kme3b" data-path="src/pages/HomePage.tsx">Knowledge Graph</Badge>
                  <Badge variant="secondary" className="mr-2 interactive" data-id="g4s9s2udr" data-path="src/pages/HomePage.tsx">Context Sharing</Badge>
                  <Badge variant="secondary" className="interactive" data-id="la2kfx2mr" data-path="src/pages/HomePage.tsx">Memory Management</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agent Types Section */}
      <section id="agents" className="py-16 bg-muted/30 relative overflow-hidden" data-id="u2u920ka7" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto px-4" data-id="pgvvmpvy8" data-path="src/pages/HomePage.tsx">
          <div className="text-center mb-12" data-id="v91s9koqd" data-path="src/pages/HomePage.tsx">
            <h2 className="h2 mb-4" data-id="2niaavcyq" data-path="src/pages/HomePage.tsx">Specialized AI Agents</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-id="mbplgyx6c" data-path="src/pages/HomePage.tsx">
              Eight intelligent agents covering every aspect of your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-id="l1w8ggnkx" data-path="src/pages/HomePage.tsx">
            {agentTypes.map((agent, index) => {
              const IconComponent = agent.icon;
              return (
                <Card key={index} className="card-enhanced group interactive" data-id="wi8hjuqz5" data-path="src/pages/HomePage.tsx">
                  <CardHeader className="pb-4" data-id="8vsfpfv4n" data-path="src/pages/HomePage.tsx">
                    <div className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`} data-id="1wnlx86cm" data-path="src/pages/HomePage.tsx">
                      <IconComponent className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" data-id="5f0sa8xbd" data-path="src/pages/HomePage.tsx" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300" data-id="0vz66dj2b" data-path="src/pages/HomePage.tsx">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent data-id="5jm7sii7b" data-path="src/pages/HomePage.tsx">
                    <p className="text-sm font-medium text-foreground mb-2" data-id="k9yzrbw6f" data-path="src/pages/HomePage.tsx">{agent.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed" data-id="owhb0l1sg" data-path="src/pages/HomePage.tsx">{agent.tools}</p>
                  </CardContent>
                </Card>);

            })}
          </div>
        </div>
      </section>

      {/* Autonomous Business Lifecycle */}
      <section id="lifecycle" className="py-16 bg-background relative overflow-hidden" data-id="2x2j0y0w7" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto px-4" data-id="nkbc09wbb" data-path="src/pages/HomePage.tsx">
          <div className="text-center mb-12" data-id="0m4vp669k" data-path="src/pages/HomePage.tsx">
            <h2 className="h2 mb-4" data-id="xf4gp9hvh" data-path="src/pages/HomePage.tsx">Autonomous Business Lifecycle</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-id="rihr2c8pk" data-path="src/pages/HomePage.tsx">
              Five-step intelligent process for complete business automation
            </p>
          </div>

          <div className="max-w-4xl mx-auto" data-id="ze5lfp770" data-path="src/pages/HomePage.tsx">
            {lifecycleSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex items-start mb-8 last:mb-0 group" data-id="8tj9cs9uz" data-path="src/pages/HomePage.tsx">
                  <div className="flex-shrink-0 mr-6" data-id="jd3mfjggo" data-path="src/pages/HomePage.tsx">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300" data-id="spu6hjbr9" data-path="src/pages/HomePage.tsx">
                      {step.step}
                    </div>
                  </div>
                  <Card className="flex-1 card-enhanced" data-id="do5itmzeb" data-path="src/pages/HomePage.tsx">
                    <CardContent className="p-6" data-id="hru2fhulm" data-path="src/pages/HomePage.tsx">
                      <div className="flex items-center mb-3" data-id="5mfjqt5tx" data-path="src/pages/HomePage.tsx">
                        <IconComponent className="h-6 w-6 text-primary mr-3 group-hover:scale-110 transition-transform duration-300" data-id="u3c89ah1o" data-path="src/pages/HomePage.tsx" />
                        <h3 className="h4 group-hover:text-primary transition-colors duration-300" data-id="1ym0tcf2t" data-path="src/pages/HomePage.tsx">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground" data-id="s3iqzrm3v" data-path="src/pages/HomePage.tsx">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < lifecycleSteps.length - 1 &&
                  <div className="absolute left-8 mt-16 w-0.5 h-8 bg-gradient-to-b from-primary/30 to-accent/30" data-id="7xeg62jb5" data-path="src/pages/HomePage.tsx" />
                  }
                </div>);

            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white" data-id="1w3tcbgjh" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto px-4" data-id="xnhvndxmi" data-path="src/pages/HomePage.tsx">
          <div className="text-center mb-12" data-id="r3se5xvbe" data-path="src/pages/HomePage.tsx">
            <h2 className="text-4xl font-bold mb-4" data-id="gsjcqlra3" data-path="src/pages/HomePage.tsx">Technology Stack</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto" data-id="myel72gov" data-path="src/pages/HomePage.tsx">
              Built with cutting-edge technologies for maximum performance and scalability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-id="g9morhk8l" data-path="src/pages/HomePage.tsx">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm" data-id="57ymjh9xn" data-path="src/pages/HomePage.tsx">
              <CardHeader className="text-center" data-id="6jdok0u0f" data-path="src/pages/HomePage.tsx">
                <Code className="h-12 w-12 text-blue-400 mx-auto mb-4" data-id="qr1huhki4" data-path="src/pages/HomePage.tsx" />
                <CardTitle className="text-white" data-id="zyyof3q9l" data-path="src/pages/HomePage.tsx">Frontend</CardTitle>
              </CardHeader>
              <CardContent data-id="fulu72e3q" data-path="src/pages/HomePage.tsx">
                <div className="space-y-2" data-id="if8gvnwna" data-path="src/pages/HomePage.tsx">
                  {techStack.frontend.map((tech, index) =>
                  <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-300/30" data-id="tmtbma3kw" data-path="src/pages/HomePage.tsx">
                      {tech}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm" data-id="scxuuu0at" data-path="src/pages/HomePage.tsx">
              <CardHeader className="text-center" data-id="x9pgbd7yx" data-path="src/pages/HomePage.tsx">
                <Server className="h-12 w-12 text-green-400 mx-auto mb-4" data-id="98t95rlo1" data-path="src/pages/HomePage.tsx" />
                <CardTitle className="text-white" data-id="tfzubmcch" data-path="src/pages/HomePage.tsx">Backend</CardTitle>
              </CardHeader>
              <CardContent data-id="5c6n29obn" data-path="src/pages/HomePage.tsx">
                <div className="space-y-2" data-id="xjmcu1afl" data-path="src/pages/HomePage.tsx">
                  {techStack.backend.map((tech, index) =>
                  <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-200 border-green-300/30" data-id="dm8jj04uf" data-path="src/pages/HomePage.tsx">
                      {tech}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm" data-id="dyqvv4dzx" data-path="src/pages/HomePage.tsx">
              <CardHeader className="text-center" data-id="22kyfg2p5" data-path="src/pages/HomePage.tsx">
                <Cloud className="h-12 w-12 text-purple-400 mx-auto mb-4" data-id="u75j9ppl3" data-path="src/pages/HomePage.tsx" />
                <CardTitle className="text-white" data-id="smrcpf8nw" data-path="src/pages/HomePage.tsx">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent data-id="ksicfgjua" data-path="src/pages/HomePage.tsx">
                <div className="space-y-2" data-id="5ll8khy73" data-path="src/pages/HomePage.tsx">
                  {techStack.infrastructure.map((tech, index) =>
                  <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-300/30" data-id="og3nw1c58" data-path="src/pages/HomePage.tsx">
                      {tech}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm" data-id="hmd3gl46y" data-path="src/pages/HomePage.tsx">
              <CardHeader className="text-center" data-id="raz2nm88q" data-path="src/pages/HomePage.tsx">
                <Brain className="h-12 w-12 text-teal-400 mx-auto mb-4" data-id="aks1ziwp4" data-path="src/pages/HomePage.tsx" />
                <CardTitle className="text-white" data-id="9jxhovvk3" data-path="src/pages/HomePage.tsx">AI Frameworks</CardTitle>
              </CardHeader>
              <CardContent data-id="usfy08myt" data-path="src/pages/HomePage.tsx">
                <div className="space-y-2" data-id="bzzr7secg" data-path="src/pages/HomePage.tsx">
                  {techStack.frameworks.map((tech, index) =>
                  <Badge key={index} variant="secondary" className="bg-teal-500/20 text-teal-200 border-teal-300/30" data-id="p5d0fuxxu" data-path="src/pages/HomePage.tsx">
                      {tech}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Monetization Models */}
      <section id="monetization" className="py-16 bg-white" data-id="zjz87a90l" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto px-4" data-id="8cs5yc7gx" data-path="src/pages/HomePage.tsx">
          <div className="text-center mb-12" data-id="xiv4xw2yz" data-path="src/pages/HomePage.tsx">
            <h2 className="text-4xl font-bold mb-4" data-id="8huf1lroi" data-path="src/pages/HomePage.tsx">Monetization Models</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" data-id="6zu9at7bl" data-path="src/pages/HomePage.tsx">
              Flexible revenue models designed to scale with your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-id="tjf2lqzdg" data-path="src/pages/HomePage.tsx">
            {monetizationModels.map((model, index) => {
              const IconComponent = model.icon;
              return (
                <Card key={index} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden" data-id="4zvyhwc98" data-path="src/pages/HomePage.tsx">
                  <div className={`h-2 bg-gradient-to-r ${model.gradient}`} data-id="3mo7l7mao" data-path="src/pages/HomePage.tsx" />
                  <CardHeader className="text-center" data-id="vzrz5lhct" data-path="src/pages/HomePage.tsx">
                    <div className={`w-16 h-16 bg-gradient-to-r ${model.gradient} rounded-full flex items-center justify-center mx-auto mb-4`} data-id="547w92uy3" data-path="src/pages/HomePage.tsx">
                      <IconComponent className="h-8 w-8 text-white" data-id="od7l4ktqh" data-path="src/pages/HomePage.tsx" />
                    </div>
                    <CardTitle className="text-2xl mb-2" data-id="rgdfzowri" data-path="src/pages/HomePage.tsx">{model.title}</CardTitle>
                    <p className="text-2xl font-bold text-blue-600" data-id="kqlewzuo2" data-path="src/pages/HomePage.tsx">{model.pricing}</p>
                  </CardHeader>
                  <CardContent data-id="uimn05hgr" data-path="src/pages/HomePage.tsx">
                    <p className="text-slate-600 mb-4 text-center" data-id="3lhpy4ot3" data-path="src/pages/HomePage.tsx">{model.description}</p>
                    <div className="space-y-2" data-id="vbbinqbiz" data-path="src/pages/HomePage.tsx">
                      {model.features.map((feature, featureIndex) =>
                      <div key={featureIndex} className="flex items-center" data-id="he1wv7l2k" data-path="src/pages/HomePage.tsx">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" data-id="nxzhefgf1" data-path="src/pages/HomePage.tsx" />
                          <span className="text-sm text-slate-600" data-id="ebl06m7ne" data-path="src/pages/HomePage.tsx">{feature}</span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-6" variant="outline" data-id="9qpkr2gkb" data-path="src/pages/HomePage.tsx">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" data-id="3b732r1nm" data-path="src/pages/HomePage.tsx" />
                    </Button>
                  </CardContent>
                </Card>);

            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white" data-id="85xrxtudq" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto px-4" data-id="cpfz5hady" data-path="src/pages/HomePage.tsx">
          <div className="text-center" data-id="kgal1t5ee" data-path="src/pages/HomePage.tsx">
            <div className="flex items-center justify-center space-x-2 mb-4" data-id="txk7q6hbw" data-path="src/pages/HomePage.tsx">
              <Brain className="h-8 w-8 text-blue-400" data-id="pjmnmw39j" data-path="src/pages/HomePage.tsx" />
              <span className="text-2xl font-bold" data-id="ziq39s1zw" data-path="src/pages/HomePage.tsx">BEEWISE-AI</span>
            </div>
            <p className="text-slate-400 mb-6" data-id="g9gs1dg8g" data-path="src/pages/HomePage.tsx">
              Revolutionizing business operations through intelligent multi-agent systems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-id="1zebv5mr8" data-path="src/pages/HomePage.tsx">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" data-id="4fh2zgtgz" data-path="src/pages/HomePage.tsx">
                Get Started Today
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" data-id="y2kea9lhi" data-path="src/pages/HomePage.tsx">
                Request Demo
              </Button>
            </div>
            <Separator className="my-8 bg-slate-700" data-id="wzvdcn4fj" data-path="src/pages/HomePage.tsx" />
            <p className="text-slate-400 text-sm" data-id="9fgd28h6h" data-path="src/pages/HomePage.tsx">
              © 2024 BEEWISE-AI. All rights reserved. | Built with cutting-edge AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>);

};

export default HomePage;