
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, TestTube, Settings, FileText, Play } from 'lucide-react';
import ApiConfigTestRunner from '@/components/ApiConfigTestRunner';
import TestDocumentationGenerator from '@/components/TestDocumentationGenerator';
import ApiConfigTestSuite from '@/components/ApiConfigTestSuite';
import TaskManager from '@/components/TaskManager';
import { useToast } from '@/hooks/use-toast';

const TestingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuickTest = () => {
    toast({
      title: "Quick Test Started",
      description: "Running basic system validation tests...",
    });
  };

  const handleFullTest = () => {
    toast({
      title: "Full Test Suite Started", 
      description: "Running comprehensive system tests...",
    });
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
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">Testing & Validation</h1>
                <p className="text-sm text-muted-foreground">
                  Test AI agents, APIs, and system components
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link to="/api-config">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  API Config
                </Button>
              </Link>
              
              <Link to="/documentation">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleQuickTest}>
            <CardContent className="p-6 text-center">
              <TestTube className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Quick Test</h3>
              <p className="text-sm text-muted-foreground">Basic system validation</p>
              <Badge variant="secondary" className="mt-2">2 min</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleFullTest}>
            <CardContent className="p-6 text-center">
              <Play className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Full Test Suite</h3>
              <p className="text-sm text-muted-foreground">Comprehensive testing</p>
              <Badge variant="secondary" className="mt-2">15 min</Badge>
            </CardContent>
          </Card>

          <Link to="/api-config" className="block">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold mb-1">API Testing</h3>
                <p className="text-sm text-muted-foreground">Test API connections</p>
                <Badge variant="outline" className="mt-2">Configure</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/documentation" className="block">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold mb-1">Generate Docs</h3>
                <p className="text-sm text-muted-foreground">Auto-generate docs</p>
                <Badge variant="outline" className="mt-2">Generate</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Testing Interface */}
        <Tabs defaultValue="api-testing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api-testing">API Testing</TabsTrigger>
            <TabsTrigger value="agent-testing">Agent Testing</TabsTrigger>
            <TabsTrigger value="task-management">Task Management</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          {/* API Testing Tab */}
          <TabsContent value="api-testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <ApiConfigTestRunner />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agent Testing Tab */}
          <TabsContent value="agent-testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <ApiConfigTestSuite />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Management Tab */}
          <TabsContent value="task-management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Orchestration Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Documentation Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <TestDocumentationGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TestingPage;
