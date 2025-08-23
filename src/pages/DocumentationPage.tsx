import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import {
  FileText,
  ArrowLeft,
  Search,
  Book,
  Code,
  Settings,
  TestTube,
  Download,
  Share,
  Plus,
  Edit,
  Eye,
  Bookmark,
  ExternalLink,
  Copy,
  Zap,
  Bot,
  Building2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Shield,
  Users,
  Wrench,
  Play,
  Server,
  Network,
  Workflow } from
'lucide-react';

interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  category: 'api' | 'agents' | 'tutorials' | 'guides' | 'reference' | 'architecture' | 'lifecycle' | 'getting-started';
  tags: string[];
  lastUpdated: string;
}

interface DocumentFormData {
  title: string;
  category: string;
  content: string;
  tags: string;
}

const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentationSection | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [documentation, setDocumentation] = useState<DocumentationSection[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<DocumentFormData>({
    defaultValues: {
      title: '',
      category: 'guides',
      content: '',
      tags: ''
    }
  });

  // Sample documentation data
  useEffect(() => {
    loadDocumentation();
  }, []);

  const loadDocumentation = () => {
    const sampleDocs: DocumentationSection[] = [
    {
      id: '1',
      title: 'Getting Started with BeeWise-AI',
      content: `# Getting Started with BeeWise-AI

Welcome to BeeWise-AI, the next-generation multi-agent business automation platform. This guide will help you get up and running quickly.

## Overview

BeeWise-AI provides a comprehensive suite of AI agents designed to automate every aspect of your business lifecycle:

- **Startup Agent**: Business model generation and niche analysis
- **Branding Agent**: Logo, name, tagline, and domain suggestions  
- **Legal Agent**: Incorporation, contracts, and compliance
- **Finance Agent**: Pricing, budgeting, and revenue modeling
- **Marketing Agent**: Ads, SEO, social media, and email campaigns
- **Sales Agent**: CRM, lead generation, and outreach
- **Support Agent**: Customer service, ticketing, and chatbot
- **Analytics Agent**: KPI tracking, dashboards, and insights

## Quick Start

1. **Configure APIs**: Set up your external API integrations in the API Configuration page
2. **Create Agents**: Deploy specialized AI agents for your business needs
3. **Start a Business**: Create a new business and guide it through the lifecycle stages
4. **Assign Tasks**: Create and assign tasks to your AI agents
5. **Monitor Progress**: Track performance through the dashboard

## Key Features

### Agent Orchestration
Our sophisticated agent orchestration layer manages:
- Task routing and agent lifecycle management
- Performance monitoring and optimization
- Dynamic agent discovery and deployment

### Business Lifecycle Management
Guide businesses through:
1. **Ideation**: Concept development and market validation
2. **Formation**: Legal setup and initial structure
3. **Launch**: Product development and market entry
4. **Growth**: Scaling operations and expanding market
5. **Optimization**: Efficiency improvements and innovation

### Autonomous Operations
- Self-managing agent workflows
- Intelligent task prioritization
- Automated handoffs between lifecycle stages
- Real-time performance optimization

Ready to get started? Head to the [API Configuration](/api-config) page to set up your first integration.`,
      category: 'getting-started',
      tags: ['getting-started', 'overview', 'quickstart'],
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'API Configuration Guide',
      content: `# API Configuration Guide

Learn how to configure external API integrations for your AI agents.

## Supported Providers

- **OpenAI**: GPT-4, GPT-3.5-turbo, DALL-E
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku
- **Google AI**: Gemini Pro, PaLM
- **Azure AI**: Azure OpenAI Service
- **AWS Bedrock**: Various foundation models
- **Custom APIs**: Any REST-based API

## Configuration Steps

1. Navigate to [API Configuration](/api-config)
2. Click "Add Configuration"
3. Fill in the required details:
   - **Name**: Descriptive name for the configuration
   - **Provider**: Select the API provider
   - **Endpoint**: API base URL
   - **API Key**: Your authentication key
   - **Authentication Type**: Bearer, API Key, Basic Auth, or OAuth

## Testing Connections

Use the built-in connection tester to verify your API configurations:
- Click the test button on any configuration
- Review the test results
- Fix any authentication or connectivity issues

## Best Practices

- Store API keys securely
- Use environment-specific configurations
- Monitor API usage and rate limits
- Regularly test connections
- Keep configurations up to date`,
      category: 'api',
      tags: ['api', 'configuration', 'setup'],
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      title: 'Agent Development Tutorial',
      content: `# Agent Development Tutorial

Create custom AI agents for specific business functions.

## Agent Architecture

Each agent consists of:
- **Core Capabilities**: What the agent can do
- **Tools Integration**: External APIs and services
- **Memory System**: Context and learning capabilities
- **Performance Metrics**: Success and efficiency tracking

## Creating Your First Agent

1. **Define the Purpose**
   - What business function will this agent handle?
   - What outcomes do you expect?

2. **Configure Capabilities**
   - List the specific tasks the agent can perform
   - Define input/output formats
   - Set performance parameters

3. **Integrate Tools**
   - Connect to relevant APIs
   - Configure authentication
   - Test integrations

4. **Deploy and Test**
   - Create the agent in the dashboard
   - Assign test tasks
   - Monitor performance

## Agent Types

### Startup Agent
- Market research and analysis
- Business model generation
- Competitive analysis
- Opportunity identification

### Branding Agent
- Logo and visual identity creation
- Naming and tagline development
- Brand voice and messaging
- Domain and trademark research

### Marketing Agent
- Campaign creation and management
- SEO optimization
- Social media automation
- Email marketing

## Best Practices

- Start with simple, well-defined tasks
- Test thoroughly before production use
- Monitor performance metrics
- Iterate based on results
- Document agent capabilities`,
      category: 'tutorials',
      tags: ['agents', 'development', 'tutorial'],
      lastUpdated: '2024-01-13'
    },
    {
      id: '4',
      title: 'Business Lifecycle Management',
      content: `# Business Lifecycle Management

Understand how to guide businesses through their complete lifecycle.

## Lifecycle Stages

### 1. Ideation
**Purpose**: Concept development and validation
**Key Activities**:
- Market research and analysis
- Competitive landscape assessment
- Business model development
- Initial feasibility studies

**Agents Involved**: Startup Agent, Analytics Agent

### 2. Formation
**Purpose**: Legal setup and structure
**Key Activities**:
- Business registration and incorporation
- Legal documentation
- Initial funding and budgeting
- Team formation

**Agents Involved**: Legal Agent, Finance Agent

### 3. Launch
**Purpose**: Market entry and initial operations
**Key Activities**:
- Product/service development
- Brand identity and marketing
- Customer acquisition
- Operations setup

**Agents Involved**: Branding Agent, Marketing Agent, Sales Agent

### 4. Growth
**Purpose**: Scaling and expansion
**Key Activities**:
- Market expansion
- Team growth
- Process optimization
- Customer retention

**Agents Involved**: Sales Agent, Support Agent, Analytics Agent

### 5. Optimization
**Purpose**: Efficiency and innovation
**Key Activities**:
- Performance analysis
- Process refinement
- Technology upgrades
- Strategic planning

**Agents Involved**: Analytics Agent, Finance Agent

## Managing Transitions

Transitions between stages are managed automatically by the system:
- Criteria-based progression
- Agent handoffs
- Context preservation
- Performance tracking

## Monitoring Progress

Track business progress through:
- Stage completion metrics
- Revenue and growth indicators
- Agent performance scores
- Task completion rates`,
      category: 'lifecycle',
      tags: ['business', 'lifecycle', 'management'],
      lastUpdated: '2024-01-12'
    },
    {
      id: '5',
      title: 'API Reference',
      content: `# API Reference

Complete reference for BeeWise-AI platform APIs.

## Authentication

All API requests require authentication via API key:

\`\`\`
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
\`\`\`

## Base URL

Production: \`https://api.beewise-ai.com/v1\`
Development: \`https://dev-api.beewise-ai.com/v1\`

## Endpoints

### Agents

#### GET /agents
List all agents
\`\`\`json
{
  "agents": [
    {
      "id": 1,
      "name": "Marketing Agent",
      "type": "marketing",
      "status": "active",
      "capabilities": ["seo", "ads", "social"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

#### POST /agents
Create new agent
\`\`\`json
{
  "name": "Custom Agent",
  "type": "custom",
  "capabilities": ["analysis", "reporting"],
  "tools": ["api1", "api2"]
}
\`\`\`

#### GET /agents/:id
Get agent details
\`\`\`json
{
  "id": 1,
  "name": "Marketing Agent",
  "status": "active",
  "performance": {
    "tasks_completed": 150,
    "success_rate": 0.95,
    "avg_response_time": 2.3
  }
}
\`\`\`

### Tasks

#### GET /tasks
List tasks with filtering
\`\`\`
GET /tasks?status=pending&agent_id=1&limit=50
\`\`\`

#### POST /tasks
Create new task
\`\`\`json
{
  "title": "Market Analysis",
  "description": "Analyze target market for new product",
  "type": "research",
  "priority": "high",
  "assigned_agent_id": 1,
  "due_date": "2024-02-01T00:00:00Z"
}
\`\`\`

### Businesses

#### GET /businesses
List all businesses
\`\`\`json
{
  "businesses": [
    {
      "id": 1,
      "name": "TechStartup Inc",
      "stage": "growth",
      "progress": 75,
      "revenue": 150000,
      "employees": 8
    }
  ]
}
\`\`\`

## Error Handling

Standard HTTP status codes are used:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error response format:
\`\`\`json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request parameters are invalid"
  }
}
\`\`\`

## Rate Limiting

Default limits:
- 100 requests per minute per API key
- 1000 requests per hour per API key

Rate limit headers:
- X-RateLimit-Limit
- X-RateLimit-Remaining
- X-RateLimit-Reset`,
      category: 'reference',
      tags: ['api', 'reference', 'endpoints'],
      lastUpdated: '2024-01-11'
    },
    {
      id: '6',
      title: 'System Architecture Overview',
      content: `# System Architecture Overview

Understand the underlying architecture of the BeeWise-AI platform.

## High-Level Architecture

The BeeWise-AI platform consists of several interconnected components:

### Core Components

1. **Agent Orchestration Layer**
   - Manages agent lifecycle and task routing
   - Handles agent communication and coordination
   - Implements performance monitoring and optimization

2. **Business Lifecycle Engine**
   - Guides businesses through all lifecycle stages
   - Manages stage transitions and criteria
   - Tracks business progress and KPIs

3. **Task Management System**
   - Creates, assigns, and tracks tasks
   - Implements priority queues and scheduling
   - Provides task history and analytics

4. **API Integration Hub**
   - Manages external API connections
   - Handles authentication and rate limiting
   - Provides connection testing and monitoring

### Infrastructure

#### Microservices Architecture
- **Agent Service**: Manages agent creation, deployment, and monitoring
- **Business Service**: Handles business lifecycle management
- **Task Service**: Orchestrates task creation and assignment
- **API Service**: Manages external API integrations
- **Analytics Service**: Provides insights and reporting
- **User Service**: Manages user accounts and permissions

#### Data Layer
- **Primary Database**: PostgreSQL for structured data
- **Document Store**: MongoDB for unstructured data
- **Cache Layer**: Redis for performance optimization
- **Message Queue**: RabbitMQ for inter-service communication

#### Security
- **Authentication**: OAuth 2.0 and JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit
- **Compliance**: GDPR, SOC 2, and ISO 27001 compliant

### Scalability

#### Horizontal Scaling
- Containerized services using Docker
- Kubernetes orchestration for auto-scaling
- Load balancing with NGINX
- CDN for static assets

#### Performance Optimization
- Caching strategies for frequently accessed data
- Database indexing and query optimization
- Asynchronous processing for long-running tasks
- Content delivery network for global access

### Monitoring and Observability

#### Logging
- Centralized logging with ELK stack
- Structured logging for easy analysis
- Audit trails for compliance

#### Metrics
- Prometheus for metric collection
- Grafana for dashboard visualization
- Custom business metrics tracking

#### Tracing
- Distributed tracing with Jaeger
- End-to-end request tracking
- Performance bottleneck identification

## Deployment Architecture

### Cloud Infrastructure
- **Primary**: AWS with multi-AZ deployment
- **Backup**: GCP for disaster recovery
- **CDN**: Cloudflare for global content delivery

### Network Security
- VPC isolation for services
- Private subnets for sensitive components
- WAF for DDoS and attack protection
- Regular security scanning and penetration testing

### Backup and Recovery
- Automated daily backups
- Point-in-time recovery capabilities
- Cross-region replication for disaster recovery
- Regular restore testing procedures`,
      category: 'architecture',
      tags: ['architecture', 'system', 'infrastructure'],
      lastUpdated: '2024-01-10'
    },
    {
      id: '7',
      title: 'Agent Types and Capabilities',
      content: `# Agent Types and Capabilities

Detailed overview of all available agent types and their specific capabilities.

## Core Agent Types

### 1. Startup Agent
**Purpose**: Business ideation and validation
**Capabilities**:
- Market research and analysis
- Business model generation
- Competitive landscape assessment
- Opportunity identification
- Feasibility studies
- Niche analysis

**Tools**:
- GPT-4 for analysis and synthesis
- Market research APIs
- Industry databases
- Trend analysis tools

### 2. Branding Agent
**Purpose**: Brand identity creation and management
**Capabilities**:
- Logo and visual identity design
- Business naming and tagline creation
- Brand voice and messaging development
- Domain and trademark research
- Brand guidelines creation

**Tools**:
- DALL-E for logo generation
- Name generation algorithms
- Domain availability checkers
- Trademark databases

### 3. Legal Agent
**Purpose**: Legal setup and compliance management
**Capabilities**:
- Business incorporation assistance
- Contract generation and review
- Compliance monitoring
- Legal document management
- Regulatory guidance

**Tools**:
- Legal document templates
- Compliance databases
- Regulatory APIs
- E-signature services

### 4. Finance Agent
**Purpose**: Financial planning and management
**Capabilities**:
- Pricing strategy development
- Budget creation and management
- Revenue modeling and forecasting
- Expense tracking
- Financial reporting

**Tools**:
- Financial modeling software
- Accounting APIs
- Tax calculation services
- Investment analysis tools

### 5. Marketing Agent
**Purpose**: Marketing campaign creation and management
**Capabilities**:
- SEO optimization
- Social media campaign management
- Email marketing automation
- Paid advertising management
- Content creation and scheduling

**Tools**:
- Google Ads API
- Social media APIs (Meta, Twitter, LinkedIn)
- SEO tools (Ahrefs, SEMrush)
- Email marketing platforms
- Analytics tools

### 6. Sales Agent
**Purpose**: Sales process automation and lead management
**Capabilities**:
- CRM management
- Lead generation and qualification
- Outreach automation
- Proposal generation
- Sales pipeline tracking

**Tools**:
- CRM platforms (Salesforce, HubSpot)
- Lead generation tools
- Email outreach platforms
- Proposal software
- Communication APIs

### 7. Support Agent
**Purpose**: Customer service and support automation
**Capabilities**:
- Customer inquiry handling
- Ticket management
- Knowledge base maintenance
- Chatbot interactions
- Feedback collection and analysis

**Tools**:
- Helpdesk software (Zendesk, Freshdesk)
- Chatbot platforms
- Knowledge management systems
- Customer feedback tools
- Communication APIs

### 8. Analytics Agent
**Purpose**: Data analysis and business insights
**Capabilities**:
- KPI tracking and reporting
- Dashboard creation and management
- Trend analysis
- Predictive modeling
- Performance optimization recommendations

**Tools**:
- Business intelligence platforms
- Data visualization tools
- Statistical analysis software
- Machine learning libraries
- Reporting engines

## Specialized Agent Types

### Research Agent
**Purpose**: In-depth research and analysis
**Capabilities**:
- Academic research
- Industry analysis
- Technical research
- Data compilation
- Report generation

### Content Agent
**Purpose**: Content creation and management
**Capabilities**:
- Blog post writing
- Social media content creation
- Video script writing
- Copywriting
- Content scheduling

### Development Agent
**Purpose**: Software development assistance
**Capabilities**:
- Code generation
- Bug fixing
- Code review
- Documentation creation
- Testing automation

## Agent Configuration

### Performance Parameters
- **Response Time**: Expected response time for tasks
- **Accuracy**: Required accuracy level for outputs
- **Cost**: Budget constraints for API usage
- **Priority**: Task priority levels

### Memory Settings
- **Context Window**: Amount of conversation history to retain
- **Learning Rate**: How quickly the agent adapts to new information
- **Knowledge Base**: External knowledge sources to reference

### Integration Settings
- **API Connections**: Which external APIs to use
- **Tool Access**: Which tools the agent can utilize
- **Data Sources**: What data the agent can access

## Agent Monitoring

### Performance Metrics
- **Task Completion Rate**: Percentage of tasks completed successfully
- **Response Time**: Average time to complete tasks
- **Accuracy Score**: Quality of outputs based on feedback
- **Cost Efficiency**: API usage cost per task

### Health Indicators
- **Uptime**: Agent availability percentage
- **Error Rate**: Frequency of errors or failures
- **Resource Usage**: CPU, memory, and network utilization
- **Queue Length**: Number of pending tasks`,
      category: 'agents',
      tags: ['agents', 'capabilities', 'types'],
      lastUpdated: '2024-01-09'
    },
    {
      id: '8',
      title: 'User Manual',
      content: `# User Manual

Complete guide to using the BeeWise-AI platform effectively.

## Getting Started

### Account Setup
1. Visit the BeeWise-AI platform
2. Sign up for an account
3. Verify your email address
4. Complete your profile
5. Set up billing information

### Initial Configuration
1. Configure API integrations
2. Deploy your first agents
3. Create your first business
4. Assign initial tasks

## Dashboard Overview

### Main Navigation
- **Home**: Overview of all activities
- **Agents**: Manage AI agents
- **Businesses**: Track business progress
- **Tasks**: View and manage tasks
- **Analytics**: Performance insights
- **Settings**: Account and system configuration

### Control Center
The control center provides access to three main areas:
1. **Agent Orchestration**: Deploy and manage agents
2. **Business Lifecycle**: Track business progress
3. **Task Management**: Assign and monitor tasks

## Managing Agents

### Creating Agents
1. Navigate to the Agents section
2. Click "Create New Agent"
3. Select agent type
4. Configure capabilities and tools
5. Set performance parameters
6. Deploy the agent

### Agent Monitoring
- View agent status (active, inactive, error)
- Monitor performance metrics
- Review task history
- Adjust configurations as needed

### Agent Scaling
- Increase/decrease agent instances based on workload
- Adjust resource allocation
- Configure auto-scaling rules

## Business Lifecycle Management

### Creating a Business
1. Navigate to the Businesses section
2. Click "Create New Business"
3. Enter business details
4. Select industry and niche
5. Choose agents to deploy
6. Start the business lifecycle

### Tracking Progress
- View current lifecycle stage
- Monitor key performance indicators
- Review agent performance
- Track financial metrics

### Stage Transitions
- Automatic progression based on criteria
- Manual override options
- Transition requirements and checkpoints

## Task Management

### Creating Tasks
1. Navigate to the Tasks section
2. Click "Create New Task"
3. Enter task details
4. Assign to specific agent or let system route
5. Set priority and due date
6. Submit task

### Task Monitoring
- View task status (pending, in progress, completed, failed)
- Track progress and estimated completion
- Review task outputs and results
- Reassign or modify tasks as needed

### Task Automation
- Create recurring tasks
- Set up task dependencies
- Configure conditional task creation
- Implement workflow automation

## Analytics and Reporting

### Dashboard Views
- Real-time performance metrics
- Historical trend analysis
- Comparative performance data
- Customizable widgets

### Report Generation
- Automated daily/weekly/monthly reports
- Custom report builder
- Export options (PDF, CSV, Excel)
- Scheduled report delivery

### Insights and Recommendations
- Performance optimization suggestions
- Cost reduction recommendations
- Agent improvement opportunities
- Business growth strategies

## Settings and Configuration

### Account Settings
- Profile management
- Billing and subscription
- Notification preferences
- Security settings

### API Configuration
- Add/remove API integrations
- Test connection status
- Manage authentication keys
- Set rate limits and quotas

### System Preferences
- Default agent configurations
- Business lifecycle settings
- Task routing rules
- Performance thresholds

## Troubleshooting

### Common Issues
- Agent deployment failures
- API connection errors
- Task processing delays
- Performance degradation

### Support Resources
- Documentation and guides
- Community forums
- Support ticket system
- Live chat assistance

### Best Practices
- Regular system maintenance
- Performance monitoring
- Security updates
- Backup and recovery procedures`,
      category: 'guides',
      tags: ['user', 'manual', 'guide'],
      lastUpdated: '2024-01-08'
    },
    {
      id: '9',
      title: 'Technical Documentation',
      content: `# Technical Documentation

In-depth technical details for developers and system administrators.

## System Requirements

### Hardware Requirements
- **Minimum**: 4 CPU cores, 8GB RAM, 50GB storage
- **Recommended**: 8+ CPU cores, 16GB+ RAM, 100GB+ storage
- **For Production**: Cluster deployment with load balancing

### Software Requirements
- **Operating System**: Linux (Ubuntu 20.04+), macOS 11+, Windows 10+
- **Runtime**: Node.js 18+, Python 3.9+
- **Databases**: PostgreSQL 14+, MongoDB 5+
- **Containerization**: Docker 20+, Kubernetes 1.24+

### Network Requirements
- **Bandwidth**: 100Mbps+ for optimal performance
- **Latency**: <50ms to primary data centers
- **Ports**: 80, 443, 5432 (PostgreSQL), 27017 (MongoDB)

## Installation Guide

### Docker Installation
1. Install Docker and Docker Compose
2. Clone the repository
3. Configure environment variables
4. Run \`docker-compose up -d\`
5. Access the platform at http://localhost:3000

### Manual Installation
1. Install system dependencies
2. Set up databases
3. Configure environment variables
4. Install Node.js dependencies
5. Build the application
6. Start services

### Configuration
Environment variables:
- \`DATABASE_URL\`: PostgreSQL connection string
- \`MONGODB_URI\`: MongoDB connection string
- \`JWT_SECRET\`: Secret for JWT token generation
- \`API_KEYS\`: Comma-separated list of API keys
- \`PORT\`: Application port (default: 3000)

## API Documentation

### Authentication
All API requests require a valid JWT token in the Authorization header:
\`Authorization: Bearer <token>\`

### Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user
- Exceeding limits returns 429 status code

### Error Handling
All API errors follow this format:
\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "value"
    }
  }
}
\`\`\`

### Core Endpoints

#### Authentication
- \`POST /api/auth/register\`: User registration
- \`POST /api/auth/login\`: User authentication
- \`POST /api/auth/refresh\`: Token refresh

#### Agents
- \`GET /api/agents\`: List all agents
- \`POST /api/agents\`: Create new agent
- \`GET /api/agents/:id\`: Get agent details
- \`PUT /api/agents/:id\`: Update agent
- \`DELETE /api/agents/:id\`: Delete agent
- \`POST /api/agents/:id/deploy\`: Deploy agent
- \`POST /api/agents/:id/undeploy\`: Undeploy agent

#### Tasks
- \`GET /api/tasks\`: List tasks
- \`POST /api/tasks\`: Create new task
- \`GET /api/tasks/:id\`: Get task details
- \`PUT /api/tasks/:id\`: Update task
- \`DELETE /api/tasks/:id\`: Delete task
- \`POST /api/tasks/:id/execute\`: Execute task manually

#### Businesses
- \`GET /api/businesses\`: List businesses
- \`POST /api/businesses\`: Create new business
- \`GET /api/businesses/:id\`: Get business details
- \`PUT /api/businesses/:id\`: Update business
- \`DELETE /api/businesses/:id\`: Delete business
- \`POST /api/businesses/:id/advance\`: Advance lifecycle stage

## Database Schema

### Users
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Agents
\`\`\`sql
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSONB,
  status VARCHAR(20) DEFAULT 'inactive',
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tasks
\`\`\`sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'pending',
  assigned_agent_id INTEGER REFERENCES agents(id),
  business_id INTEGER REFERENCES businesses(id),
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  result JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Businesses
\`\`\`sql
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  stage VARCHAR(20) DEFAULT 'ideation',
  progress INTEGER DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0,
  employees INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Security Implementation

### Authentication
- JWT tokens with 24-hour expiration
- Refresh tokens with 7-day expiration
- Password hashing with bcrypt (12 rounds)
- Two-factor authentication support

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- API key-based access for integrations
- Audit logging for all actions

### Data Protection
- AES-256 encryption for sensitive data at rest
- TLS 1.3 encryption for data in transit
- Regular security scanning and penetration testing
- GDPR, SOC 2, and ISO 27001 compliance

## Performance Optimization

### Caching Strategy
- Redis for session storage and caching
- CDN for static assets
- Database query caching
- API response caching

### Database Optimization
- Proper indexing for frequently queried fields
- Connection pooling
- Query optimization
- Read replicas for high-traffic queries

### Code Optimization
- Asynchronous processing for long-running tasks
- Memory-efficient data structures
- Lazy loading for non-critical resources
- Compression for API responses

## Monitoring and Logging

### Application Monitoring
- Real-time performance metrics
- Error tracking and alerting
- Resource utilization monitoring
- Custom business metrics

### Logging
- Structured JSON logging
- Log levels (debug, info, warn, error)
- Centralized log aggregation
- Log retention policies

### Alerting
- Threshold-based alerts
- Anomaly detection
- Escalation policies
- Integration with notification systems

## Backup and Recovery

### Backup Strategy
- Daily full database backups
- Hourly incremental backups
- Cross-region backup replication
- Automated backup validation

### Recovery Procedures
- Point-in-time recovery
- Disaster recovery playbooks
- Regular recovery testing
- Backup retention policies

## Deployment and CI/CD

### Continuous Integration
- Automated testing on every commit
- Code quality checks
- Security scanning
- Performance testing

### Continuous Deployment
- Blue-green deployment strategy
- Canary releases for new features
- Automated rollback on failure
- Zero-downtime deployments

### Environment Management
- Development, staging, and production environments
- Environment-specific configurations
- Feature flags for controlled rollouts
- A/B testing capabilities`,
      category: 'reference',
      tags: ['technical', 'developer', 'api'],
      lastUpdated: '2024-01-07'
    }];


    setDocumentation(sampleDocs);
  };

  const handleCreateDocument = async (data: DocumentFormData) => {
    try {
      setLoading(true);

      const newDoc: DocumentationSection = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        category: data.category as any,
        tags: data.tags.split(',').map((t) => t.trim()),
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      setDocumentation((prev) => [newDoc, ...prev]);

      toast({
        title: "Success",
        description: "Documentation created successfully"
      });

      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating documentation:', error);
      toast({
        title: "Error",
        description: "Failed to create documentation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportDocs = () => {
    const content = documentation.
    map((doc) => `# ${doc.title}\n\n${doc.content}\n\n---\n\n`).
    join('');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beewise-ai-documentation.md';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Documentation exported successfully"
    });
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard"
    });
  };

  const filteredDocs = documentation.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'api':return <Code className="h-4 w-4" />;
      case 'agents':return <Zap className="h-4 w-4" />;
      case 'tutorials':return <Book className="h-4 w-4" />;
      case 'guides':return <BookOpen className="h-4 w-4" />;
      case 'reference':return <FileText className="h-4 w-4" />;
      case 'architecture':return <Network className="h-4 w-4" />;
      case 'lifecycle':return <GitBranch className="h-4 w-4" />;
      case 'getting-started':return <Play className="h-4 w-4" />;
      default:return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'api':return 'bg-blue-100 text-blue-800';
      case 'agents':return 'bg-purple-100 text-purple-800';
      case 'tutorials':return 'bg-green-100 text-green-800';
      case 'guides':return 'bg-orange-100 text-orange-800';
      case 'reference':return 'bg-gray-100 text-gray-800';
      case 'architecture':return 'bg-cyan-100 text-cyan-800';
      case 'lifecycle':return 'bg-teal-100 text-teal-800';
      case 'getting-started':return 'bg-indigo-100 text-indigo-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2">

                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">Documentation</h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive guides, tutorials, and API reference
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link to="/testing">
                <Button variant="outline" className="gap-2">
                  <TestTube className="h-4 w-4" />
                  Testing
                </Button>
              </Link>
              
              <Button variant="outline" onClick={handleExportDocs} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Documentation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create Documentation</DialogTitle>
                    <DialogDescription>
                      Add new documentation content to the knowledge base
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateDocument)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          rules={{ required: 'Title is required' }}
                          render={({ field }) =>
                          <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter documentation title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          } />

                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) =>
                          <FormItem>
                              <FormLabel>Category</FormLabel>
                              <select
                              className="w-full p-2 border rounded-md"
                              value={field.value}
                              onChange={field.onChange}>

                                <option value="getting-started">Getting Started</option>
                                <option value="guides">Guides</option>
                                <option value="tutorials">Tutorials</option>
                                <option value="api">API</option>
                                <option value="agents">Agents</option>
                                <option value="lifecycle">Business Lifecycle</option>
                                <option value="architecture">Architecture</option>
                                <option value="reference">Reference</option>
                              </select>
                              <FormMessage />
                            </FormItem>
                          } />

                      </div>
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) =>
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter tags separated by commas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        } />

                      
                      <FormField
                        control={form.control}
                        name="content"
                        rules={{ required: 'Content is required' }}
                        render={({ field }) =>
                        <FormItem>
                            <FormLabel>Content (Markdown supported)</FormLabel>
                            <FormControl>
                              <Textarea
                              placeholder="Write your documentation content here..."
                              className="min-h-[300px]"
                              {...field} />

                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        } />

                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Creating...' : 'Create Documentation'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8" />

              </div>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('all')}>

                    All Documentation
                  </Button>
                  {['getting-started', 'guides', 'tutorials', 'api', 'agents', 'lifecycle', 'architecture', 'reference'].map((category) =>
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start gap-2 capitalize"
                    onClick={() => setSelectedCategory(category)}>

                      {getCategoryIcon(category)}
                      {category.replace('-', ' ')}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/api-config">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Settings className="h-4 w-4" />
                      API Configuration
                    </Button>
                  </Link>
                  <Link to="/testing">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <TestTube className="h-4 w-4" />
                      Testing Suite
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={handleExportDocs}>

                    <Download className="h-4 w-4" />
                    Export Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedDocument ?
            // Document View
            <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{selectedDocument.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge className={getCategoryColor(selectedDocument.category)}>
                          {getCategoryIcon(selectedDocument.category)}
                          {selectedDocument.category.replace('-', ' ')}
                        </Badge>
                        <span>Last updated: {selectedDocument.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleCopyContent(selectedDocument.content)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedDocument(null)}>
                        <ArrowLeft className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {selectedDocument.content}
                    </pre>
                  </div>
                </CardContent>
              </Card> :

            // Document List
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {selectedCategory === 'all' ? 'All Documentation' : `${selectedCategory.replace('-', ' ').charAt(0).toUpperCase()}${selectedCategory.replace('-', ' ').slice(1)} Documentation`}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.map((doc) =>
                <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
                          <Badge className={getCategoryColor(doc.category)}>
                            {getCategoryIcon(doc.category)}
                            {doc.category.replace('-', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {doc.content.substring(0, 150)}...
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag, index) =>
                      <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                      )}
                          {doc.tags.length > 3 &&
                      <Badge variant="outline" className="text-xs">
                              +{doc.tags.length - 3}
                            </Badge>
                      }
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Updated {doc.lastUpdated}
                          </span>
                          <Button
                        size="sm"
                        onClick={() => setSelectedDocument(doc)}
                        className="gap-1">

                            <Eye className="h-3 w-3" />
                            Read
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                )}
                </div>

                {filteredDocs.length === 0 &&
              <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No documentation found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || selectedCategory !== 'all' ?
                    'Try adjusting your search or filter criteria' :
                    'Create your first documentation to get started.'}
                      </p>
                      {!searchQuery && selectedCategory === 'all' &&
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Documentation
                        </Button>
                  }
                    </CardContent>
                  </Card>
              }
              </div>
            }
          </div>
        </div>
      </main>
    </div>);

};

// Missing BookOpen import - add this component
const BookOpen: React.FC<{className?: string;}> = ({ className }) =>
<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>;


export default DocumentationPage;