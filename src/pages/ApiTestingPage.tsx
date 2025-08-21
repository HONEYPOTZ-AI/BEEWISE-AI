import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TestTube, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  BarChart3,
  FileText,
  Download,
  Settings,
  Zap,
  Monitor,
  Database,
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import LearnMoreButton from '@/components/LearnMoreButton';
import ContextualHelp from '@/components/ContextualHelp';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'running';
  duration: number;
  timestamp: string;
  details: string;
  endpoint?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warningTests: number;
  averageDuration: number;
}

const ApiTestingPage: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string>('connectivity');
  const [testProgress, setTestProgress] = useState(0);

  const testSuites: TestSuite[] = [
    {
      id: 'connectivity',
      name: 'Connectivity Tests',
      description: 'Basic connection validation and network checks',
      icon: <Monitor className="h-5 w-5" />,
      totalTests: 12,
      passedTests: 10,
      failedTests: 1,
      warningTests: 1,
      averageDuration: 245,
      tests: [
        {
          id: 'conn-1',
          name: 'API Endpoint Reachability',
          status: 'passed',
          duration: 123,
          timestamp: '2024-01-15T10:30:00Z',
          details: 'Successfully connected to API endpoint',
          endpoint: 'https://api.example.com/v1/health'
        },
        {
          id: 'conn-2',
          name: 'SSL Certificate Validation',
          status: 'passed',
          duration: 89,
          timestamp: '2024-01-15T10:30:01Z',
          details: 'SSL certificate is valid and not expired'
        },
        {
          id: 'conn-3',
          name: 'DNS Resolution',
          status: 'failed',
          duration: 5000,
          timestamp: '2024-01-15T10:30:02Z',
          details: 'DNS resolution timeout - check domain configuration'
        },
        {
          id: 'conn-4',
          name: 'Network Latency',
          status: 'warning',
          duration: 890,
          timestamp: '2024-01-15T10:30:03Z',
          details: 'High latency detected (>800ms) - consider performance optimization'
        }
      ]
    },
    {
      id: 'authentication',
      name: 'Authentication Tests',
      description: 'API key validation and OAuth flow testing',
      icon: <Shield className="h-5 w-5" />,
      totalTests: 8,
      passedTests: 7,
      failedTests: 0,
      warningTests: 1,
      averageDuration: 156,
      tests: [
        {
          id: 'auth-1',
          name: 'API Key Validation',
          status: 'passed',
          duration: 145,
          timestamp: '2024-01-15T10:31:00Z',
          details: 'API key authentication successful'
        },
        {
          id: 'auth-2',
          name: 'Bearer Token Verification',
          status: 'passed',
          duration: 167,
          timestamp: '2024-01-15T10:31:01Z',
          details: 'Bearer token is valid and not expired'
        },
        {
          id: 'auth-3',
          name: 'Token Refresh Flow',
          status: 'warning',
          duration: 234,
          timestamp: '2024-01-15T10:31:02Z',
          details: 'Token refresh successful but approaching expiry'
        }
      ]
    },
    {
      id: 'endpoints',
      name: 'Endpoint Tests',
      description: 'HTTP method validation and response format checks',
      icon: <Database className="h-5 w-5" />,
      totalTests: 15,
      passedTests: 13,
      failedTests: 2,
      warningTests: 0,
      averageDuration: 298,
      tests: [
        {
          id: 'ep-1',
          name: 'GET /users endpoint',
          status: 'passed',
          duration: 234,
          timestamp: '2024-01-15T10:32:00Z',
          details: 'Endpoint returned 200 OK with valid JSON response'
        },
        {
          id: 'ep-2',
          name: 'POST /users endpoint',
          status: 'failed',
          duration: 1234,
          timestamp: '2024-01-15T10:32:01Z',
          details: 'Endpoint returned 500 Internal Server Error - check server logs'
        },
        {
          id: 'ep-3',
          name: 'Response Schema Validation',
          status: 'passed',
          duration: 45,
          timestamp: '2024-01-15T10:32:02Z',
          details: 'Response matches expected JSON schema'
        }
      ]
    },
    {
      id: 'performance',
      name: 'Performance Tests',
      description: 'Load testing and performance metrics analysis',
      icon: <TrendingUp className="h-5 w-5" />,
      totalTests: 6,
      passedTests: 4,
      failedTests: 1,
      warningTests: 1,
      averageDuration: 1245,
      tests: [
        {
          id: 'perf-1',
          name: 'Response Time Analysis',
          status: 'passed',
          duration: 567,
          timestamp: '2024-01-15T10:33:00Z',
          details: 'Average response time: 234ms (within acceptable range)'
        },
        {
          id: 'perf-2',
          name: 'Concurrent User Load',
          status: 'warning',
          duration: 2345,
          timestamp: '2024-01-15T10:33:01Z',
          details: 'Performance degradation noticed above 100 concurrent users'
        },
        {
          id: 'perf-3',
          name: 'Memory Usage Monitoring',
          status: 'failed',
          duration: 890,
          timestamp: '2024-01-15T10:33:02Z',
          details: 'Memory usage exceeded threshold - potential memory leak detected'
        }
      ]
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestProgress(0);

    // Simulate test execution with progress updates
    const progressInterval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsRunning(false);
          toast({
            title: "Tests Completed",
            description: "All test suites have been executed successfully."
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const stopTests = () => {
    setIsRunning(false);
    setTestProgress(0);
    toast({
      title: "Tests Stopped",
      description: "Test execution has been cancelled.",
      variant: "destructive"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'default',
      failed: 'destructive', 
      warning: 'secondary',
      running: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const currentSuite = testSuites.find(suite => suite.id === selectedSuite);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Settings className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline">
              <TestTube className="h-4 w-4 mr-1" />
              API Testing Suite
            </Badge>
            <LearnMoreButton 
              section="testing"
              mode="link"
              label="Testing Guide"
              tooltip="Learn about comprehensive API testing strategies and best practices"
              className="text-muted-foreground"
            />
            <LearnMoreButton 
              section="best-practices"
              mode="link"
              label="Testing Best Practices"
              tooltip="Learn testing best practices and quality assurance guidelines"
              className="text-muted-foreground"
            />
          </div>
          
          <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Execute comprehensive tests and monitor API performance across all configurations
          </p>
        </div>

        <div className="flex items-center gap-4">
          {!isRunning ? (
            <div className="flex gap-2">
              <Button onClick={runTests} className="gap-2">
                <Play className="h-4 w-4" />
                Run All Tests
              </Button>
              <LearnMoreButton 
                section="testing"
                mode="icon"
                tooltip="Learn how to configure and run comprehensive API tests"
                variant="outline"
              />
            </div>
          ) : (
            <Button onClick={stopTests} variant="destructive" className="gap-2">
              <Square className="h-4 w-4" />
              Stop Tests
            </Button>
          )}
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Results
          </Button>
          <LearnMoreButton 
            section="api-reference"
            mode="icon"
            tooltip="View API reference documentation for understanding test results"
            variant="outline"
          />
        </div>
      </div>

      {/* Test Progress */}
      {isRunning && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <CardTitle>Running Tests...</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test Progress</span>
                <span>{testProgress}%</span>
              </div>
              <Progress value={testProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contextual Help */}
      <div className="mb-8">
        <ContextualHelp 
          title="API Testing Overview"
          description="Understand how to effectively test your API configurations and interpret results."
          tips={[
            "Run connectivity tests first to verify basic API access",
            "Authentication tests ensure your credentials are valid and secure",
            "Endpoint tests validate individual API methods and responses",
            "Performance tests help identify bottlenecks and optimization opportunities"
          ]}
          warnings={[
            "Failed tests may indicate configuration issues that need immediate attention",
            "High latency warnings suggest potential performance problems"
          ]}
          relatedSections={[
            {
              section: "testing",
              label: "Testing Documentation",
              description: "Complete guide to API testing"
            },
            {
              section: "api-reference",
              label: "API Reference",
              description: "Understanding API endpoints"
            }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Test Suites Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Test Suites
              </CardTitle>
              <CardDescription>
                Select a test suite to view detailed results
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 pt-0 space-y-2">
                  {testSuites.map((suite) => (
                    <Button
                      key={suite.id}
                      variant={selectedSuite === suite.id ? "default" : "ghost"}
                      onClick={() => setSelectedSuite(suite.id)}
                      className="w-full justify-start gap-3 h-auto p-4"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          {suite.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{suite.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {suite.totalTests} tests
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-xs text-green-500">
                            {suite.passedTests} passed
                          </div>
                          {suite.failedTests > 0 && (
                            <div className="text-xs text-red-500">
                              {suite.failedTests} failed
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/testing">
                  <Zap className="h-4 w-4 mr-2" />
                  Test Management
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/apiconfig">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration
                </Link>
              </Button>
              <div className="pt-2">
                <LearnMoreButton 
                  section="testing"
                  mode="button"
                  label="Testing Best Practices"
                  tooltip="Learn about API testing strategies, automation, and optimization techniques"
                  size="sm"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {currentSuite && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentSuite.icon}
                    <div>
                      <CardTitle>{currentSuite.name}</CardTitle>
                      <CardDescription>{currentSuite.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <LearnMoreButton 
                      section="testing"
                      mode="icon"
                      tooltip={`Learn more about ${currentSuite.name.toLowerCase()}`}
                      variant="outline"
                    />
                  </div>
                </div>

                {/* Suite Statistics */}
                <div className="grid grid-cols-4 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {currentSuite.totalTests}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Tests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {currentSuite.passedTests}
                    </div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {currentSuite.failedTests}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {currentSuite.warningTests}
                    </div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="results" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="results">Test Results</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="logs">Execution Logs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="results" className="mt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {currentSuite.tests.map((test, index) => (
                        <AccordionItem key={test.id} value={test.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full mr-4">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(test.status)}
                                <span className="font-medium text-left">{test.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(test.status)}
                                <span className="text-sm text-muted-foreground">
                                  {test.duration}ms
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Duration:</span>
                                  <span className="ml-2 font-mono">{test.duration}ms</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Timestamp:</span>
                                  <span className="ml-2 font-mono">
                                    {new Date(test.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                {test.endpoint && (
                                  <div className="col-span-2">
                                    <span className="text-muted-foreground">Endpoint:</span>
                                    <span className="ml-2 font-mono text-primary">
                                      {test.endpoint}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <Separator />
                              <div>
                                <h5 className="font-medium mb-2">Test Details</h5>
                                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                  {test.details}
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="performance" className="mt-6">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <BarChart3 className="h-5 w-5" />
                              Performance Metrics
                            </CardTitle>
                            <LearnMoreButton 
                              section="testing"
                              mode="icon"
                              tooltip="Learn how to interpret performance metrics and optimize API performance"
                              variant="ghost"
                              size="sm"
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {currentSuite.averageDuration}ms
                              </div>
                              <div className="text-sm text-muted-foreground">Average Response Time</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-green-500">
                                {((currentSuite.passedTests / currentSuite.totalTests) * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-muted-foreground">Success Rate</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="text-center text-muted-foreground">
                        <p>Detailed performance charts and analytics will be displayed here</p>
                        <LearnMoreButton 
                          section="testing"
                          mode="link"
                          label="Learn about performance testing"
                          tooltip="Understand how to interpret performance metrics and optimize API performance"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="mt-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Execution Logs
                          </CardTitle>
                          <LearnMoreButton 
                            section="testing"
                            mode="icon"
                            tooltip="Learn how to read and debug test execution logs"
                            variant="ghost"
                            size="sm"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] w-full border rounded-md p-4 font-mono text-sm bg-muted/20">
                          <div className="space-y-1">
                            {currentSuite.tests.map((test, index) => (
                              <div key={test.id} className="text-muted-foreground">
                                <span className="text-blue-500">
                                  [{new Date(test.timestamp).toLocaleTimeString()}]
                                </span>
                                <span className="ml-2">Running {test.name}...</span>
                                <span className={`ml-2 ${
                                  test.status === 'passed' ? 'text-green-500' : 
                                  test.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                                }`}>
                                  [{test.status.toUpperCase()}]
                                </span>
                                <span className="ml-2">({test.duration}ms)</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="mt-4 text-center">
                          <LearnMoreButton 
                            section="testing"
                            mode="link"
                            label="Learn about test logging"
                            tooltip="Understand test execution logs and how to debug test failures"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTestingPage;
