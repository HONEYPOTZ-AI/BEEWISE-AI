import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle, Clock, Play, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TestCase, TestResult, TestReport } from '@/types/testing';
import { TestDataGenerator } from '@/utils/testDataGenerator';
import { TestScreenshots } from '@/utils/testScreenshots';

interface ApiConfigTestRunnerProps {
  tableId: number;
}

const ApiConfigTestRunner: React.FC<ApiConfigTestRunnerProps> = ({ tableId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testReport, setTestReport] = useState<TestReport | null>(null);
  const { toast } = useToast();

  // Define test cases
  const testCases: TestCase[] = [
    // CREATE tests
    {
      id: 'create-valid-config',
      name: 'Create Valid API Configuration',
      description: 'Tests creation of a valid API configuration with all required fields',
      category: 'CREATE',
      execute: async () => {
        const testData = TestDataGenerator.generateValidApiConfig(1);
        const screenshot = await TestScreenshots.captureScreenshot('create-valid-config', 'Creating valid API config');
        
        try {
          const { error } = await window.ezsite.apis.tableCreate(tableId, testData);
          if (error) throw new Error(error);
          
          return {
            id: 'create-valid-config',
            name: 'Create Valid API Configuration',
            status: 'PASSED',
            duration: 0,
            message: 'Successfully created valid API configuration',
            screenshot,
            expectedResult: 'API configuration created without errors',
            actualResult: 'Configuration created successfully'
          };
        } catch (error) {
          return {
            id: 'create-valid-config',
            name: 'Create Valid API Configuration',
            status: 'FAILED',
            duration: 0,
            message: `Failed to create configuration: ${error}`,
            screenshot,
            expectedResult: 'API configuration created without errors',
            actualResult: `Error: ${error}`
          };
        }
      }
    },
    {
      id: 'create-invalid-config',
      name: 'Create Invalid API Configuration',
      description: 'Tests validation by attempting to create invalid configurations',
      category: 'VALIDATION',
      execute: async () => {
        const invalidConfigs = TestDataGenerator.generateInvalidApiConfigs();
        const screenshot = await TestScreenshots.captureScreenshot('create-invalid-config', 'Testing invalid config creation');
        let failedValidations = 0;
        
        for (const invalidConfig of invalidConfigs) {
          try {
            const { error } = await window.ezsite.apis.tableCreate(tableId, invalidConfig);
            if (error) {
              failedValidations++;
            }
          } catch (error) {
            failedValidations++;
          }
        }
        
        const allValidated = failedValidations === invalidConfigs.length;
        
        return {
          id: 'create-invalid-config',
          name: 'Create Invalid API Configuration',
          status: allValidated ? 'PASSED' : 'FAILED',
          duration: 0,
          message: allValidated 
            ? 'All invalid configurations were properly rejected'
            : `Only ${failedValidations}/${invalidConfigs.length} invalid configs were rejected`,
          screenshot,
          expectedResult: 'All invalid configurations should be rejected',
          actualResult: `${failedValidations}/${invalidConfigs.length} configurations rejected`
        };
      }
    },
    // READ tests
    {
      id: 'read-configurations',
      name: 'Read API Configurations',
      description: 'Tests retrieval of API configurations with pagination',
      category: 'READ',
      execute: async () => {
        const screenshot = await TestScreenshots.captureScreenshot('read-configurations', 'Reading API configurations');
        
        try {
          const { data, error } = await window.ezsite.apis.tablePage(tableId, {
            PageNo: 1,
            PageSize: 10,
            OrderByField: 'ID',
            IsAsc: false,
            Filters: []
          });
          
          if (error) throw new Error(error);
          
          const hasData = data && data.List && Array.isArray(data.List);
          
          return {
            id: 'read-configurations',
            name: 'Read API Configurations',
            status: hasData ? 'PASSED' : 'FAILED',
            duration: 0,
            message: hasData 
              ? `Successfully retrieved ${data.List.length} configurations`
              : 'Failed to retrieve configurations or invalid data structure',
            screenshot,
            expectedResult: 'Should return array of configurations',
            actualResult: hasData ? `Retrieved ${data.List.length} items` : 'Invalid or missing data'
          };
        } catch (error) {
          return {
            id: 'read-configurations',
            name: 'Read API Configurations',
            status: 'FAILED',
            duration: 0,
            message: `Failed to read configurations: ${error}`,
            screenshot,
            expectedResult: 'Should return array of configurations',
            actualResult: `Error: ${error}`
          };
        }
      }
    },
    // SEARCH tests
    {
      id: 'search-configurations',
      name: 'Search API Configurations',
      description: 'Tests search and filter functionality',
      category: 'SEARCH',
      execute: async () => {
        const screenshot = await TestScreenshots.captureScreenshot('search-configurations', 'Testing search functionality');
        
        try {
          // First create a test config to search for
          const testData = TestDataGenerator.generateValidApiConfig(999);
          testData.name = 'SEARCH_TEST_CONFIG';
          await window.ezsite.apis.tableCreate(tableId, testData);
          
          // Now search for it
          const { data, error } = await window.ezsite.apis.tablePage(tableId, {
            PageNo: 1,
            PageSize: 10,
            OrderByField: 'ID',
            IsAsc: false,
            Filters: [
              {
                name: 'name',
                op: 'StringContains',
                value: 'SEARCH_TEST'
              }
            ]
          });
          
          if (error) throw new Error(error);
          
          const foundConfig = data?.List?.some((config: any) => config.name === 'SEARCH_TEST_CONFIG');
          
          return {
            id: 'search-configurations',
            name: 'Search API Configurations',
            status: foundConfig ? 'PASSED' : 'FAILED',
            duration: 0,
            message: foundConfig 
              ? 'Search functionality working correctly'
              : 'Search did not find expected configuration',
            screenshot,
            expectedResult: 'Should find configuration with search term',
            actualResult: foundConfig ? 'Configuration found' : 'Configuration not found'
          };
        } catch (error) {
          return {
            id: 'search-configurations',
            name: 'Search API Configurations',
            status: 'FAILED',
            duration: 0,
            message: `Search test failed: ${error}`,
            screenshot,
            expectedResult: 'Should find configuration with search term',
            actualResult: `Error: ${error}`
          };
        }
      }
    },
    // UPDATE tests
    {
      id: 'update-configuration',
      name: 'Update API Configuration',
      description: 'Tests updating existing API configuration fields',
      category: 'UPDATE',
      execute: async () => {
        const screenshot = await TestScreenshots.captureScreenshot('update-configuration', 'Testing configuration update');
        
        try {
          // First create a test config to update
          const testData = TestDataGenerator.generateValidApiConfig(998);
          testData.name = 'UPDATE_TEST_CONFIG';
          const createResult = await window.ezsite.apis.tableCreate(tableId, testData);
          
          if (createResult.error) throw new Error(createResult.error);
          if (!createResult.data?.ID) throw new Error('Failed to create test configuration');
          
          const configId = createResult.data.ID;
          
          // Update the configuration
          const updatedData = {
            ...testData,
            ID: configId,
            name: 'UPDATED_TEST_CONFIG',
            provider: 'UpdatedProvider',
            baseUrl: 'https://updated-api.example.com',
            description: 'This configuration has been updated'
          };
          
          const updateResult = await window.ezsite.apis.tableUpdate(tableId, updatedData);
          
          if (updateResult.error) throw new Error(updateResult.error);
          
          // Verify the update
          const { data: readData, error: readError } = await window.ezsite.apis.tablePage(tableId, {
            PageNo: 1,
            PageSize: 10,
            OrderByField: 'ID',
            IsAsc: false,
            Filters: [
              {
                name: 'ID',
                op: 'Equal',
                value: configId
              }
            ]
          });
          
          if (readError) throw new Error(readError);
          
          const updatedConfig = readData?.List?.find((config: any) => config.ID === configId);
          
          if (updatedConfig && updatedConfig.name === 'UPDATED_TEST_CONFIG') {
            return {
              id: 'update-configuration',
              name: 'Update API Configuration',
              status: 'PASSED',
              duration: 0,
              message: 'Successfully updated and verified configuration changes',
              screenshot,
              expectedResult: 'Configuration should be updated with new values',
              actualResult: `Configuration updated successfully. New name: ${updatedConfig.name}`
            };
          } else {
            throw new Error('Failed to verify configuration update');
          }
        } catch (error) {
          return {
            id: 'update-configuration',
            name: 'Update API Configuration',
            status: 'FAILED',
            duration: 0,
            message: `Failed to update configuration: ${error}`,
            screenshot,
            expectedResult: 'Configuration should be updated with new values',
            actualResult: `Error: ${error}`
          };
        }
      }
    },
    // DELETE tests
    {
      id: 'delete-configuration',
      name: 'Delete API Configuration',
      description: 'Tests deleting API configuration and verifies removal',
      category: 'DELETE',
      execute: async () => {
        const screenshot = await TestScreenshots.captureScreenshot('delete-configuration', 'Testing configuration deletion');
        
        try {
          // First create a test config to delete
          const testData = TestDataGenerator.generateValidApiConfig(997);
          testData.name = 'DELETE_TEST_CONFIG';
          const createResult = await window.ezsite.apis.tableCreate(tableId, testData);
          
          if (createResult.error) throw new Error(createResult.error);
          if (!createResult.data?.ID) throw new Error('Failed to create test configuration');
          
          const configId = createResult.data.ID;
          
          // Delete the configuration
          const deleteResult = await window.ezsite.apis.tableDelete(tableId, { ID: configId });
          
          if (deleteResult.error) throw new Error(deleteResult.error);
          
          // Verify deletion by trying to read it
          const { data: readData, error: readError } = await window.ezsite.apis.tablePage(tableId, {
            PageNo: 1,
            PageSize: 10,
            OrderByField: 'ID',
            IsAsc: false,
            Filters: [
              {
                name: 'ID',
                op: 'Equal',
                value: configId
              }
            ]
          });
          
          if (readError) throw new Error(readError);
          
          const deletedConfig = readData?.List?.find((config: any) => config.ID === configId);
          
          if (!deletedConfig) {
            return {
              id: 'delete-configuration',
              name: 'Delete API Configuration',
              status: 'PASSED',
              duration: 0,
              message: 'Successfully deleted configuration and verified removal',
              screenshot,
              expectedResult: 'Configuration should be deleted and no longer retrievable',
              actualResult: 'Configuration deleted successfully and not found in subsequent queries'
            };
          } else {
            throw new Error('Configuration still exists after deletion attempt');
          }
        } catch (error) {
          return {
            id: 'delete-configuration',
            name: 'Delete API Configuration',
            status: 'FAILED',
            duration: 0,
            message: `Failed to delete configuration: ${error}`,
            screenshot,
            expectedResult: 'Configuration should be deleted and no longer retrievable',
            actualResult: `Error: ${error}`
          };
        }
      }
    }
  ];

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);
    
    const startTime = new Date();
    const results: TestResult[] = [];
    
    try {
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        setCurrentTest(testCase.name);
        
        const testStartTime = performance.now();
        const result = await testCase.execute();
        const testEndTime = performance.now();
        
        result.duration = testEndTime - testStartTime;
        results.push(result);
        setTestResults(prev => [...prev, result]);
        
        setProgress(((i + 1) / testCases.length) * 100);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const endTime = new Date();
      const report: TestReport = {
        suiteId: 'api-config-crud-tests',
        suiteName: 'API Configuration CRUD Tests',
        totalTests: testCases.length,
        passedTests: results.filter(r => r.status === 'PASSED').length,
        failedTests: results.filter(r => r.status === 'FAILED').length,
        skippedTests: results.filter(r => r.status === 'SKIPPED').length,
        totalDuration: endTime.getTime() - startTime.getTime(),
        startTime,
        endTime,
        results
      };
      
      setTestReport(report);
      
      toast({
        title: 'Test Suite Completed',
        description: `${report.passedTests}/${report.totalTests} tests passed`,
        variant: report.failedTests > 0 ? 'destructive' : 'default'
      });
      
    } catch (error) {
      toast({
        title: 'Test Suite Error',
        description: `Failed to complete test suite: ${error}`,
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  }, [tableId, testCases, toast]);

  const exportTestReport = useCallback(() => {
    if (!testReport) return;
    
    const reportData = {
      ...testReport,
      exportedAt: new Date().toISOString(),
      configuration: {
        tableId,
        testFrameworkVersion: '1.0.0'
      }
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-config-test-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [testReport, tableId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'RUNNING':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED':
        return 'bg-green-500';
      case 'FAILED':
        return 'bg-red-500';
      case 'RUNNING':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            API Configuration Test Runner
            <div className="flex gap-2">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
              {testReport && (
                <Button onClick={exportTestReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isRunning && (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Running: {currentTest}
              </p>
            </div>
          )}
          
          {testReport && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testReport.passedTests}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testReport.failedTests}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{testReport.totalTests}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(testReport.totalDuration)}ms</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <ScrollArea className="h-96">
                  {testResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-muted-foreground">{result.message}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{Math.round(result.duration)}ms</Badge>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="detailed" className="space-y-4">
                <ScrollArea className="h-96">
                  {testResults.map((result) => (
                    <Card key={result.id} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{result.name}</CardTitle>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <strong>Message:</strong> {result.message}
                        </div>
                        {result.expectedResult && (
                          <div>
                            <strong>Expected:</strong> {result.expectedResult}
                          </div>
                        )}
                        {result.actualResult && (
                          <div>
                            <strong>Actual:</strong> {result.actualResult}
                          </div>
                        )}
                        <div>
                          <strong>Duration:</strong> {Math.round(result.duration)}ms
                        </div>
                        {result.screenshot && (
                          <div>
                            <strong>Screenshot:</strong>
                            <img 
                              src={result.screenshot} 
                              alt={`Screenshot for ${result.name}`}
                              className="mt-2 max-w-full h-48 object-contain border rounded"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiConfigTestRunner;