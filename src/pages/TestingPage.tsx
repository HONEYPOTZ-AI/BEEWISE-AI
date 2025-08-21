import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Database, 
  TestTube, 
  FileText, 
  Settings,
  CheckCircle,
  Camera,
  Search,
  Clock
} from 'lucide-react';
import ApiConfigTestRunner from '@/components/ApiConfigTestRunner';
import TestDocumentationGenerator from '@/components/TestDocumentationGenerator';
import ApiConfigTestSuite from '@/components/ApiConfigTestSuite';
import { useToast } from '@/hooks/use-toast';

const TestingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiTableId, setApiTableId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the API configurations table ID
    const checkApiTable = async () => {
      try {
        // For now, we'll use a hardcoded table ID for api_configurations
        // In a real application, this would be retrieved from the database schema
        setApiTableId(36659); // Based on the provided table ID
        setIsLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to initialize testing environment',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    checkApiTable();
  }, [toast]);

  const testingDocumentation = [
    {
      category: 'CREATE Operations',
      tests: [
        'Create valid API configuration with all required fields',
        'Create API configuration with minimum required fields',
        'Validate required field enforcement',
        'Test URL format validation',
        'Test duplicate name prevention',
        'Test API key encryption/storage'
      ]
    },
    {
      category: 'READ Operations',
      tests: [
        'Retrieve all API configurations with pagination',
        'Filter configurations by provider',
        'Filter configurations by status (active/inactive)',
        'Search configurations by name/description',
        'Sort configurations by various fields',
        'Test pagination limits and boundaries'
      ]
    },
    {
      category: 'UPDATE Operations',
      tests: [
        'Update API configuration name and description',
        'Update API endpoints and authentication',
        'Toggle configuration active/inactive status',
        'Update configuration headers and parameters',
        'Test concurrent update handling',
        'Validate update field constraints'
      ]
    },
    {
      category: 'DELETE Operations',
      tests: [
        'Delete unused API configuration',
        'Prevent deletion of configurations in use',
        'Soft delete vs hard delete behavior',
        'Test cascade deletion rules',
        'Bulk delete operations',
        'Delete confirmation and rollback'
      ]
    },
    {
      category: 'Validation & Security',
      tests: [
        'Input sanitization for all fields',
        'SQL injection prevention',
        'XSS attack prevention',
        'API key encryption validation',
        'Access control and permissions',
        'Rate limiting compliance'
      ]
    },
    {
      category: 'UI & UX Testing',
      tests: [
        'Form validation and error messages',
        'Search and filter responsiveness',
        'Loading states and progress indicators',
        'Mobile responsiveness',
        'Accessibility compliance',
        'Browser compatibility'
      ]
    },
    {
      category: 'Import/Export',
      tests: [
        'Export configurations to JSON/CSV',
        'Import configurations from various formats',
        'Validate imported configuration data',
        'Handle duplicate imports',
        'Test large dataset imports',
        'Error handling for malformed data'
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Initializing test environment...</p>
        </div>
      </div>
    );
  }

  if (!apiTableId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">API Configuration Testing</h1>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Testing Environment Not Available</h3>
              <p className="text-muted-foreground mb-4">
                The API configurations table is not available for testing.
              </p>
              <Button onClick={() => navigate('/apiconfig')}>
                Go to API Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">API Configuration Testing</h1>
          <p className="text-muted-foreground">
            Comprehensive test suite for API configuration CRUD operations
          </p>
        </div>
      </div>

      <Tabs defaultValue="runner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="crud" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            CRUD Testing
          </TabsTrigger>
          <TabsTrigger value="runner" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test Runner
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="runner" className="space-y-6">
          <ApiConfigTestRunner tableId={apiTableId} />
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Test Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                This comprehensive test suite validates all aspects of the API Configuration management system,
                including CRUD operations, validation, security, and user experience.
              </p>
              
              <div className="space-y-6">
                {testingDocumentation.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-3">{section.category}</h3>
                    <div className="grid gap-2">
                      {section.tests.map((test, testIndex) => (
                        <div key={testIndex} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Badge variant="outline" className="text-xs">
                            {testIndex + 1}
                          </Badge>
                          <span className="text-sm">{test}</span>
                        </div>
                      ))}
                    </div>
                    {index < testingDocumentation.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Test Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Database Table ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{apiTableId}</span>
                    <Badge variant="secondary">api_configurations</Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Test Environment</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default">Production</Badge>
                    <span className="text-xs text-muted-foreground">
                      Tests run against live database
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Test Data Management</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Test configurations are created with unique identifiers</p>
                  <p>• Cleanup operations remove test data after completion</p>
                  <p>• Failed tests preserve data for debugging</p>
                  <p>• Screenshots are captured for visual verification</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Safety Measures</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• All test operations are reversible</p>
                  <p>• Production data is never modified without explicit test markers</p>
                  <p>• Test configurations use clearly identifiable naming patterns</p>
                  <p>• Validation tests do not persist invalid data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingPage;