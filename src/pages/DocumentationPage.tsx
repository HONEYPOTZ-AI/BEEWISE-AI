import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  Search,
  Download,
  Code,
  Settings,
  TestTube,
  Rocket,
  Shield,
  Zap,
  FileText,
  Users,
  Server,
  Database,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowLeft,
  ExternalLink,
  Copy,
  Play,
  Globe } from
'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface DocumentationSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  searchable: string;
}

const DocumentationPage: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Handle navigation from URL parameters or hash
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sectionParam = urlParams.get('section');
    const hash = location.hash.replace('#', '');

    if (sectionParam) {
      setActiveTab(sectionParam);
    }

    // Scroll to specific section if hash is present
    if (hash && hash.endsWith('-section')) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code example has been copied to your clipboard."
    });
  };

  const documentationSections: DocumentationSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: <BookOpen className="h-4 w-4" />,
    searchable: 'overview introduction system architecture features capabilities API configuration management',
    content:
    <div className="space-y-6">
          <div>
            <h2 id="overview-section" className="text-2xl font-bold mb-4">API Configuration Management System</h2>
            <p className="text-muted-foreground mb-6">
              A comprehensive platform for managing API configurations with built-in testing, monitoring, and deployment capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  Configuration Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create, read, update, and delete API configurations with support for multiple environments and versioning.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TestTube className="h-5 w-5" />
                  Testing Suite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive testing framework with automated test generation, execution, and detailed reporting.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="h-5 w-5" />
                  Health Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time health checks, performance monitoring, and automated alerting for API endpoints.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">System Architecture</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-sm">
            {`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  Configuration  │    │  Testing Engine │
│   (React App)   │◄──►│    Service      │◄──►│   & Reports     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Health Check  │    │   Performance   │
│   (PostgreSQL)  │    │    Monitor      │    │    Analytics    │
└─────────────────┘    └─────────────────┘    └─────────────────┘`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>CRUD Operations for API Configurations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time Connection Testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Import/Export Configurations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Advanced Search and Filtering</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Comprehensive Test Suite</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Performance Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Security & Error Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Multi-Environment Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Rocket className="h-4 w-4" />,
    searchable: 'getting started quick start tutorial setup first time basic usage examples',
    content:
    <div className="space-y-6">
          <div>
            <h2 id="getting-started-section" className="text-2xl font-bold mb-4">Quick Start Guide</h2>
            <p className="text-muted-foreground mb-6">
              Get up and running with the API Configuration Management System in just a few steps.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This guide assumes you have the necessary permissions to create and manage API configurations.
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-xl font-semibold mb-3">Step 1: Access the System</h3>
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Navigation Options:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/apiconfig">
                      <Settings className="h-4 w-4 mr-1" />
                      API Configuration
                    </Link>
                  </Button>
                  <span className="text-sm text-muted-foreground">Manage API configurations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/apitesting">
                      <TestTube className="h-4 w-4 mr-1" />
                      API Testing
                    </Link>
                  </Button>
                  <span className="text-sm text-muted-foreground">Run API tests and view results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/testing">
                      <Play className="h-4 w-4 mr-1" />
                      Testing Suite
                    </Link>
                  </Button>
                  <span className="text-sm text-muted-foreground">Comprehensive test management</span>
                </div>
              </div>
            </div>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Navigate to the application URL</li>
              <li>Log in with your credentials</li>
              <li>Verify your role permissions for API configuration management</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Step 2: Create Your First Configuration</h3>
            <div className="space-y-4">
              <p>Navigate to the API Configuration page and click "Add New Configuration".</p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Example Configuration:</h4>
                  <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`{
  "name": "User Service API",
  "baseUrl": "https://api.example.com/v1",
  "environment": "development",
  "authentication": {
    "type": "bearer",
    "token": "your-api-token"
  },
  "endpoints": [
    {
      "path": "/users",
      "method": "GET",
      "description": "Fetch user list"
    }
  ]
}`)}>

                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="text-sm overflow-x-auto">
              {`{
  "name": "User Service API",
  "baseUrl": "https://api.example.com/v1",
  "environment": "development",
  "authentication": {
    "type": "bearer",
    "token": "your-api-token"
  },
  "endpoints": [
    {
      "path": "/users",
      "method": "GET",
      "description": "Fetch user list"
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Step 3: Test Your Configuration</h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Use the "Test Connection" feature to verify connectivity</li>
              <li>Run the automated test suite to validate endpoints</li>
              <li>Review test results and fix any issues</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Step 4: Monitor and Maintain</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Set up health monitoring for your APIs</li>
              <li>Configure alerts for failures or performance issues</li>
              <li>Regularly review performance metrics</li>
              <li>Update configurations as needed</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4">
            <h4 className="font-medium mb-2">💡 Pro Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use environment-specific configurations for better organization</li>
              <li>Leverage the import/export feature for backup and migration</li>
              <li>Set up regular automated testing schedules</li>
              <li>Use descriptive names and documentation for configurations</li>
            </ul>
          </div>
        </div>

  },
  {
    id: 'features',
    title: 'Feature Documentation',
    icon: <Settings className="h-4 w-4" />,
    searchable: 'features documentation CRUD operations search filtering import export status management connection testing',
    content:
    <div className="space-y-6">
          <div>
            <h2 id="features-section" className="text-2xl font-bold mb-4">Feature Documentation</h2>
            <p className="text-muted-foreground mb-6">
              Detailed documentation of all system features and capabilities.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">API Configuration CRUD Operations</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Create new API configurations with comprehensive validation and testing.
                  </p>
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <strong>Required Fields:</strong> Name, Base URL, Environment<br />
                    <strong>Optional Fields:</strong> Authentication, Headers, Timeouts
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Read & Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    View and search configurations with advanced filtering options.
                  </p>
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <strong>Search Fields:</strong> Name, Environment, Status, Tags<br />
                    <strong>Filters:</strong> Environment, Status, Date Range, Owner
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Modify existing configurations with version tracking and rollback capability.
                  </p>
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <strong>Features:</strong> Version History, Change Tracking, Rollback<br />
                    <strong>Validation:</strong> Real-time validation and testing
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delete Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Safely remove configurations with confirmation and dependency checking.
                  </p>
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <strong>Safety Features:</strong> Confirmation Dialog, Dependency Check<br />
                    <strong>Options:</strong> Soft Delete, Archive, Permanent Removal
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3">Import/Export Functionality</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Import Configurations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Import configurations from JSON, YAML, or other supported formats.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">JSON</Badge>
                    <Badge variant="outline">YAML</Badge>
                    <Badge variant="outline">CSV</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Configurations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Export configurations for backup, migration, or sharing.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">Full Export</Badge>
                    <Badge variant="outline">Filtered Export</Badge>
                    <Badge variant="outline">Template Export</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3">Status Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configuration is active and being monitored.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Inactive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configuration exists but is not currently active.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configuration has errors and needs attention.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3">Connection Testing</h3>
            <Alert>
              <TestTube className="h-4 w-4" />
              <AlertDescription>
                Test your API configurations before deployment to ensure reliability.
              </AlertDescription>
            </Alert>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <strong>Real-time Testing:</strong> Test configurations instantly with live API calls
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <strong>Comprehensive Validation:</strong> Validates endpoints, authentication, and response formats
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <strong>Detailed Reports:</strong> Get detailed test results with performance metrics
                </div>
              </div>
            </div>
          </div>
        </div>

  },
  {
    id: 'testing',
    title: 'Testing Documentation',
    icon: <TestTube className="h-4 w-4" />,
    searchable: 'testing documentation test suite categories results reports generation automated',
    content:
    <div className="space-y-6">
          <div>
            <h2 id="testing-section" className="text-2xl font-bold mb-4">Testing Documentation</h2>
            <p className="text-muted-foreground mb-6">
              Comprehensive testing framework with automated test generation and detailed reporting.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Test Suite Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Automated Testing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automated test generation and execution for all API configurations with customizable test parameters.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Test Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Detailed test reports with metrics, performance data, and actionable insights for improvement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Test Categories</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connectivity Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Basic connection validation</li>
                    <li>SSL/TLS certificate verification</li>
                    <li>Network latency measurement</li>
                    <li>DNS resolution testing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Authentication Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>API key validation</li>
                    <li>Bearer token verification</li>
                    <li>OAuth flow testing</li>
                    <li>Permission and role validation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Endpoint Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>HTTP method validation</li>
                    <li>Response format verification</li>
                    <li>Status code validation</li>
                    <li>Response time monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Response time analysis</li>
                    <li>Throughput measurement</li>
                    <li>Load testing capabilities</li>
                    <li>Memory usage monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">How to Run Tests</h3>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Manual Test Execution:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Navigate to the Testing page</li>
                  <li>Select configurations to test</li>
                  <li>Choose test categories</li>
                  <li>Click "Run Tests" to execute</li>
                </ol>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Automated Test Scheduling:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Configure test schedules in settings</li>
                  <li>Set up notification preferences</li>
                  <li>Define failure thresholds</li>
                  <li>Enable automatic reporting</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Understanding Test Results</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <strong>Passed Tests:</strong> All validations successful, configuration is working correctly
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <strong>Warning Tests:</strong> Tests passed but with performance or minor issues
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <strong>Failed Tests:</strong> Critical issues found, configuration needs attention
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Test Report Generation</h3>
            <p className="text-muted-foreground mb-4">
              Generate comprehensive reports for stakeholders and compliance requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report Formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline">PDF</Badge>
                    <Badge variant="outline">HTML</Badge>
                    <Badge variant="outline">JSON</Badge>
                    <Badge variant="outline">CSV</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Executive summary</li>
                    <li>Detailed test results</li>
                    <li>Performance metrics</li>
                    <li>Recommendations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: <Server className="h-4 w-4" />,
    searchable: 'deployment environment setup build process configuration troubleshooting nginx docker static hosting',
    content:
    <div className="space-y-6">
          <div>
            <h2 id="deployment-section" className="text-2xl font-bold mb-4">Deployment Documentation</h2>
            <p className="text-muted-foreground mb-6">
              Complete guide for deploying the API Configuration Management System across different environments.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This section includes comprehensive deployment instructions from the DEPLOYMENT.md file with additional system-specific guidance.
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Node.js 18.x or higher</li>
              <li>npm 9.x or higher</li>
              <li>Access to deployment target (server, hosting platform, etc.)</li>
              <li>Proper access credentials for each environment</li>
              <li>Database access (PostgreSQL for production)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Environment Configuration</h3>
            <p className="text-muted-foreground mb-4">
              The application uses environment variables for configuration. There are three environment files:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">.env.development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Used for local development environment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">.env.staging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Used for the staging environment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">.env.production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Used for the production environment
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Required Environment Variables:</h4>
                <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(`VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_LOGGING=true
VITE_SENTRY_DSN=https://...@sentry.io/...`)}>

                  <Copy className="h-4 w-4 mr-1" />
                  Copy Example
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Variable</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Example</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-b">
                      <td className="p-2 font-mono">VITE_APP_ENV</td>
                      <td className="p-2">Current environment</td>
                      <td className="p-2">production</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">VITE_API_BASE_URL</td>
                      <td className="p-2">Base URL for API requests</td>
                      <td className="p-2">https://api.example.com</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">VITE_ENABLE_LOGGING</td>
                      <td className="p-2">Enable application logging</td>
                      <td className="p-2">true</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">VITE_SENTRY_DSN</td>
                      <td className="p-2">Sentry error tracking DSN</td>
                      <td className="p-2">https://...@sentry.io/...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Build Process</h3>
            <p className="text-muted-foreground mb-4">
              The application uses Vite for building. The build process is optimized for production.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Build Commands:</h4>
                <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(`# Development build
npm run build:dev

# Staging build
npm run build --mode staging

# Production build
npm run build`)}>

                  <Copy className="h-4 w-4 mr-1" />
                  Copy Commands
                </Button>
              </div>
              <pre className="text-sm">
            {`# Development build
npm run build:dev

# Staging build
npm run build --mode staging

# Production build
npm run build`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Deployment Options</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Static Hosting (Recommended)</CardTitle>
                  <CardDescription>Deploy to any static hosting service</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Build the application using the appropriate build command</li>
                    <li>Upload the contents of the `dist` directory to your hosting provider</li>
                    <li>Configure the hosting provider to redirect all routes to `index.html`</li>
                  </ol>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">Example Nginx Configuration:</h5>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # Serve static files directly
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        add_header Cache-Control "public, max-age=31536000";
    }

    # For client-side routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
}`)}>

                        <Copy className="h-4 w-4 mr-1" />
                        Copy Config
                      </Button>
                    </div>
                    <pre className="text-xs bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto">
                  {`server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # Serve static files directly
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        add_header Cache-Control "public, max-age=31536000";
    }

    # For client-side routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Docker Deployment</CardTitle>
                  <CardDescription>Containerized deployment option</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">1. Create Dockerfile:</h5>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`)}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto">
                    {`FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
                      </pre>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">2. Build and run:</h5>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`docker build -t api-config-app .
docker run -p 80:80 api-config-app`)}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy Commands
                        </Button>
                      </div>
                      <pre className="text-xs bg-black/5 dark:bg-white/5 p-3 rounded">
                    {`docker build -t api-config-app .
docker run -p 80:80 api-config-app`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Environment Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Clone the repository</li>
                    <li>Install dependencies: `npm install`</li>
                    <li>Create `.env.development` file</li>
                    <li>Start dev server: `npm run dev`</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Staging</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Set up hosting environment</li>
                    <li>Configure staging variables</li>
                    <li>Deploy staging build</li>
                    <li>Set up monitoring services</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Set up production environment</li>
                    <li>Configure production variables</li>
                    <li>Deploy production build</li>
                    <li>Configure monitoring & alerts</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Troubleshooting</h3>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Application Shows Blank Screen</strong>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    <li>Check browser console for JavaScript errors</li>
                    <li>Verify API endpoints are accessible</li>
                    <li>Check environment variables</li>
                    <li>Verify client-side routing configuration</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Performance Issues</strong>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    <li>Check performance monitoring data</li>
                    <li>Review server resources</li>
                    <li>Analyze network requests</li>
                    <li>Consider additional caching</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>API Connection Issues</strong>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    <li>Verify VITE_API_BASE_URL setting</li>
                    <li>Check for CORS issues</li>
                    <li>Verify API accessibility</li>
                    <li>Check network/firewall restrictions</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: <Code className="h-4 w-4" />,
    searchable: 'API reference endpoints request response formats error handling authentication requirements',
    content:
    <div className="space-y-6">
          <div>
            <h2 id="api-reference-section" className="text-2xl font-bold mb-4">API Reference</h2>
            <p className="text-muted-foreground mb-6">
              Complete reference for all available API endpoints and their usage.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Authentication</h3>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All API requests require proper authentication. The system supports multiple authentication methods.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Authentication Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">Bearer Token</Badge>
                      <div className="flex justify-end mb-1">
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('Authorization: Bearer your-access-token')}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted/50 p-3 rounded">
Authorization: Bearer your-access-token
                      </pre>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">API Key</Badge>
                      <div className="flex justify-end mb-1">
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('X-API-Key: your-api-key')}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted/50 p-3 rounded">
X-API-Key: your-api-key
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Configuration Management Endpoints</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    /api/configurations
                  </CardTitle>
                  <CardDescription>Retrieve paginated list of API configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium">Query Parameters:</h5>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                        <li><code>page</code> - Page number (default: 1)</li>
                        <li><code>limit</code> - Items per page (default: 10)</li>
                        <li><code>search</code> - Search term</li>
                        <li><code>environment</code> - Filter by environment</li>
                        <li><code>status</code> - Filter by status</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Response:</h5>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "data": {
    "List": [
      {
        "id": 1,
        "name": "User Service API",
        "base_url": "https://api.example.com",
        "environment": "production",
        "status": "active",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "VirtualCount": 100
  },
  "error": null
}`)}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto">
                    {`{
  "data": {
    "List": [
      {
        "id": 1,
        "name": "User Service API",
        "base_url": "https://api.example.com",
        "environment": "production",
        "status": "active",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "VirtualCount": 100
  },
  "error": null
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">POST</Badge>
                    /api/configurations
                  </CardTitle>
                  <CardDescription>Create a new API configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Request Body:</h5>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "name": "New API Service",
  "base_url": "https://api.newservice.com",
  "environment": "development",
  "authentication_type": "bearer",
  "authentication_token": "token-here",
  "timeout": 5000,
  "headers": {
    "Content-Type": "application/json"
  }
}`)}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto">
                    {`{
  "name": "New API Service",
  "base_url": "https://api.newservice.com",
  "environment": "development",
  "authentication_type": "bearer",
  "authentication_token": "token-here",
  "timeout": 5000,
  "headers": {
    "Content-Type": "application/json"
  }
}`}
                      </pre>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Response:</h5>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "data": {
    "id": 123,
    "message": "Configuration created successfully"
  },
  "error": null
}`)}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted/50 p-3 rounded">
                    {`{
  "data": {
    "id": 123,
    "message": "Configuration created successfully"
  },
  "error": null
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">PUT</Badge>
                    /api/configurations/:id
                  </CardTitle>
                  <CardDescription>Update an existing API configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium">Path Parameters:</h5>
                      <ul className="list-disc list-inside text-sm ml-4">
                        <li><code>id</code> - Configuration ID</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium">Request Body:</h5>
                      <p className="text-sm text-muted-foreground">Same as POST request body</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">DELETE</Badge>
                    /api/configurations/:id
                  </CardTitle>
                  <CardDescription>Delete an API configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium">Path Parameters:</h5>
                      <ul className="list-disc list-inside text-sm ml-4">
                        <li><code>id</code> - Configuration ID</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Response:</h5>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "data": {
    "message": "Configuration deleted successfully"
  },
  "error": null
}`)}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted/50 p-3 rounded">
                    {`{
  "data": {
    "message": "Configuration deleted successfully"
  },
  "error": null
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Testing Endpoints</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">POST</Badge>
                    /api/test/configuration
                  </CardTitle>
                  <CardDescription>Test a specific API configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Request Body:</h5>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "configuration_id": 123,
  "test_types": ["connectivity", "authentication", "endpoints"]
}`)}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted/50 p-3 rounded">
                    {`{
  "configuration_id": 123,
  "test_types": ["connectivity", "authentication", "endpoints"]
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    /api/test/results/:testId
                  </CardTitle>
                  <CardDescription>Get test results for a specific test run</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Response:</h5>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "data": {
    "test_id": "test-123",
    "configuration_id": 123,
    "status": "completed",
    "results": {
      "connectivity": "passed",
      "authentication": "passed",
      "endpoints": "failed"
    },
    "details": [...],
    "created_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}`)}>

                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto">
                    {`{
  "data": {
    "test_id": "test-123",
    "configuration_id": 123,
    "status": "completed",
    "results": {
      "connectivity": "passed",
      "authentication": "passed",
      "endpoints": "failed"
    },
    "details": [...],
    "created_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Error Handling</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Standard Error Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span></span>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`{
  "data": null,
  "error": "Detailed error message for user display"
}`)}>

                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto">
                {`{
  "data": null,
  "error": "Detailed error message for user display"
}`}
                  </pre>
                  <div className="mt-3">
                    <h5 className="font-medium mb-2">Common HTTP Status Codes:</h5>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li><Badge variant="outline">200</Badge> - Success</li>
                      <li><Badge variant="outline">400</Badge> - Bad Request</li>
                      <li><Badge variant="outline">401</Badge> - Unauthorized</li>
                      <li><Badge variant="outline">403</Badge> - Forbidden</li>
                      <li><Badge variant="outline">404</Badge> - Not Found</li>
                      <li><Badge variant="outline">500</Badge> - Internal Server Error</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Rate Limiting</h3>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                API requests are rate limited to ensure system stability. Current limits are 1000 requests per hour per user.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rate Limit Headers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span></span>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200`)}>

                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="text-xs bg-muted/50 p-3 rounded">
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    icon: <Shield className="h-4 w-4" />,
    searchable: 'best practices configuration management security performance optimization maintenance recommendations guidelines',
    content:
    <div className="space-y-6">
          <div>
            <h2 id="best-practices-section" className="text-2xl font-bold mb-4">Best Practices</h2>
            <p className="text-muted-foreground mb-6">
              Guidelines and recommendations for optimal use of the API Configuration Management System.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Configuration Management Guidelines</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Naming Conventions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Descriptive Names:</strong> Use clear, descriptive names that indicate the service and environment</li>
                    <li><strong>Consistent Format:</strong> Follow format like "ServiceName - Environment" (e.g., "User Service - Production")</li>
                    <li><strong>Avoid Abbreviations:</strong> Use full words to prevent confusion</li>
                    <li><strong>Version Indicators:</strong> Include version information when managing multiple API versions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Environment Separation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Clear Separation:</strong> Maintain separate configurations for each environment</li>
                    <li><strong>Environment-Specific URLs:</strong> Use different base URLs for different environments</li>
                    <li><strong>Access Control:</strong> Implement proper access controls for production configurations</li>
                    <li><strong>Configuration Validation:</strong> Always test configurations before promoting to higher environments</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Documentation Standards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Comprehensive Descriptions:</strong> Include detailed descriptions for each configuration</li>
                    <li><strong>Contact Information:</strong> Specify responsible team/person for each configuration</li>
                    <li><strong>Change History:</strong> Maintain changelog for significant modifications</li>
                    <li><strong>Dependencies:</strong> Document dependencies and related services</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Security Considerations</h3>
            <Alert className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Security should be a primary concern when managing API configurations. Follow these guidelines to maintain system security.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Authentication & Authorization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Strong Authentication:</strong> Use secure authentication methods (OAuth 2.0, JWT tokens)</li>
                    <li><strong>Token Rotation:</strong> Regularly rotate API keys and access tokens</li>
                    <li><strong>Least Privilege:</strong> Grant minimum necessary permissions for each configuration</li>
                    <li><strong>Role-Based Access:</strong> Implement role-based access control for configuration management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Sensitive Data:</strong> Never store sensitive information in plain text</li>
                    <li><strong>Encryption:</strong> Encrypt sensitive configuration data at rest and in transit</li>
                    <li><strong>Audit Logging:</strong> Enable comprehensive audit logging for all configuration changes</li>
                    <li><strong>Access Monitoring:</strong> Monitor and alert on suspicious access patterns</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>HTTPS Only:</strong> Always use HTTPS for API communications</li>
                    <li><strong>Certificate Validation:</strong> Implement proper SSL/TLS certificate validation</li>
                    <li><strong>IP Restrictions:</strong> Use IP whitelisting where appropriate</li>
                    <li><strong>Firewall Rules:</strong> Configure proper firewall rules for API access</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Performance Optimization</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Configuration Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Timeout Settings:</strong> Configure appropriate timeout values for different API types</li>
                    <li><strong>Connection Pooling:</strong> Use connection pooling for frequently accessed APIs</li>
                    <li><strong>Caching Strategy:</strong> Implement caching for static or rarely-changing data</li>
                    <li><strong>Retry Logic:</strong> Configure intelligent retry mechanisms with exponential backoff</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Monitoring & Alerting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Performance Metrics:</strong> Monitor response times, throughput, and error rates</li>
                    <li><strong>Health Checks:</strong> Implement regular health checks for all configurations</li>
                    <li><strong>Alert Thresholds:</strong> Set appropriate alert thresholds for different metrics</li>
                    <li><strong>Dashboard Views:</strong> Create dashboards for quick performance overview</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Testing Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Automated Testing:</strong> Set up automated testing for all configurations</li>
                    <li><strong>Load Testing:</strong> Perform load testing for critical API configurations</li>
                    <li><strong>Continuous Testing:</strong> Implement continuous testing in CI/CD pipelines</li>
                    <li><strong>Test Data Management:</strong> Use appropriate test data that doesn't impact production</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Maintenance Recommendations</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Regular Maintenance Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium">Daily Tasks:</h5>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                        <li>Review system health and alerts</li>
                        <li>Check for failed configurations</li>
                        <li>Monitor performance metrics</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium">Weekly Tasks:</h5>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                        <li>Review and clean up unused configurations</li>
                        <li>Update documentation for recent changes</li>
                        <li>Analyze performance trends</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium">Monthly Tasks:</h5>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                        <li>Review and rotate authentication credentials</li>
                        <li>Update system dependencies</li>
                        <li>Conduct security reviews</li>
                        <li>Backup configuration data</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuration Lifecycle Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Planning:</strong> Define requirements and design configuration structure</li>
                    <li><strong>Implementation:</strong> Create and test configuration in development environment</li>
                    <li><strong>Testing:</strong> Comprehensive testing in staging environment</li>
                    <li><strong>Deployment:</strong> Careful deployment to production with monitoring</li>
                    <li><strong>Monitoring:</strong> Continuous monitoring and performance tracking</li>
                    <li><strong>Maintenance:</strong> Regular updates and optimizations</li>
                    <li><strong>Retirement:</strong> Proper decommissioning when no longer needed</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4">
            <h4 className="font-medium mb-2">🎯 Key Success Factors</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Consistency:</strong> Maintain consistent practices across all configurations</li>
              <li><strong>Documentation:</strong> Keep comprehensive and up-to-date documentation</li>
              <li><strong>Automation:</strong> Automate repetitive tasks and testing processes</li>
              <li><strong>Monitoring:</strong> Implement comprehensive monitoring and alerting</li>
              <li><strong>Security:</strong> Prioritize security in all configuration management activities</li>
              <li><strong>Continuous Improvement:</strong> Regularly review and improve processes</li>
            </ul>
          </div>
        </div>

  }];


  const filteredSections = useMemo(() => {
    if (!searchTerm) return documentationSections;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return documentationSections.filter((section) =>
    section.title.toLowerCase().includes(lowerSearchTerm) ||
    section.searchable.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm, documentationSections]);

  const handleExportDocumentation = async () => {
    try {
      // Create documentation content for export
      const exportContent = {
        title: 'API Configuration Management System Documentation',
        generated: new Date().toISOString(),
        sections: documentationSections.map((section) => ({
          id: section.id,
          title: section.title,
          content: section.searchable // Using searchable text for export
        }))
      };

      // Create and download file
      const dataStr = JSON.stringify(exportContent, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = 'api-config-documentation.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Documentation Exported",
        description: "Documentation has been exported successfully."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export documentation. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/apiconfig">
                <Settings className="h-4 w-4 mr-2" />
                API Config
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/apitesting">
                <TestTube className="h-4 w-4 mr-2" />
                Testing
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive guide for the API Configuration Management System
          </p>
        </div>
        <Button onClick={handleExportDocumentation} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Documentation
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10" />

          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-4 pt-0">
                  {filteredSections.map((section) =>
                  <Button
                    key={section.id}
                    variant={activeTab === section.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(section.id)}
                    className="w-full justify-start gap-2 h-auto p-3">

                      {section.icon}
                      <span className="text-left">{section.title}</span>
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/apiconfig">
                  <Settings className="h-4 w-4 mr-2" />
                  API Configuration
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/apitesting">
                  <TestTube className="h-4 w-4 mr-2" />
                  API Testing
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/testing">
                  <Play className="h-4 w-4 mr-2" />
                  Testing Suite
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {documentationSections.map((section) =>
              <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-1 text-xs">
                  {section.icon}
                  <span className="hidden sm:inline">{section.title}</span>
                </TabsTrigger>
              )}
            </TabsList>

            {filteredSections.map((section) =>
            <TabsContent key={section.id} value={section.id}>
                <Card>
                  <CardContent className="p-6">
                    <ScrollArea className="h-[600px] lg:h-[800px]">
                      {section.content}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>);

};

export default DocumentationPage;