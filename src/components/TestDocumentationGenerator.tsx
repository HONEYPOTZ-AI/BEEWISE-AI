import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  ExternalLink } from
'lucide-react';

interface TestResult {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  expectedResult: string;
  actualResult: string;
  error?: string;
  screenshot?: string;
  timestamp: Date;
}

interface TestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  totalDuration: number;
  testDate: Date;
  environment: string;
}

interface TestDocumentationGeneratorProps {
  testResults: TestResult[];
  summary: TestSummary;
}

const TestDocumentationGenerator: React.FC<TestDocumentationGeneratorProps> = ({
  testResults,
  summary
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHTMLReport = useCallback(() => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Configuration Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .summary {
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card.passed { border-left-color: #28a745; }
        .summary-card.failed { border-left-color: #dc3545; }
        .summary-card.skipped { border-left-color: #ffc107; }
        .test-results {
            padding: 30px;
        }
        .test-category {
            margin-bottom: 30px;
        }
        .test-item {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        .test-header {
            padding: 15px 20px;
            background: #f8f9fa;
            display: flex;
            justify-content: between;
            align-items: center;
            border-bottom: 1px solid #dee2e6;
        }
        .test-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-passed { background: #d4edda; color: #155724; }
        .status-failed { background: #f8d7da; color: #721c24; }
        .status-skipped { background: #fff3cd; color: #856404; }
        .test-content {
            padding: 20px;
        }
        .test-details {
            display: grid;
            gap: 15px;
            margin-top: 15px;
        }
        .detail-row {
            display: grid;
            grid-template-columns: 120px 1fr;
            gap: 10px;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        .error-message {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
        }
        .screenshot {
            max-width: 100%;
            height: auto;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            margin-top: 10px;
        }
        .footer {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            color: #6c757d;
            font-size: 14px;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>API Configuration Test Report</h1>
            <p>Comprehensive testing results for API configuration management system</p>
            <p>Generated on ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
        </div>

        <div class="summary">
            <h2>Test Execution Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Tests</h3>
                    <div style="font-size: 2em; font-weight: bold; margin-top: 10px;">
                        ${summary.totalTests}
                    </div>
                </div>
                <div class="summary-card passed">
                    <h3>Passed</h3>
                    <div style="font-size: 2em; font-weight: bold; margin-top: 10px; color: #28a745;">
                        ${summary.passed}
                    </div>
                    <div style="color: #6c757d;">
                        ${summary.totalTests > 0 ? Math.round(summary.passed / summary.totalTests * 100) : 0}% success rate
                    </div>
                </div>
                <div class="summary-card failed">
                    <h3>Failed</h3>
                    <div style="font-size: 2em; font-weight: bold; margin-top: 10px; color: #dc3545;">
                        ${summary.failed}
                    </div>
                </div>
                <div class="summary-card">
                    <h3>Duration</h3>
                    <div style="font-size: 2em; font-weight: bold; margin-top: 10px;">
                        ${Math.round(summary.totalDuration / 1000)}s
                    </div>
                </div>
            </div>
        </div>

        <div class="test-results">
            <h2>Detailed Test Results</h2>
            ${Object.entries(
      testResults.reduce((acc, test) => {
        if (!acc[test.category]) acc[test.category] = [];
        acc[test.category].push(test);
        return acc;
      }, {} as Record<string, TestResult[]>)
    ).map(([category, tests]) => `
                <div class="test-category">
                    <h3 style="color: #495057; text-transform: capitalize; margin-bottom: 20px;">
                        ${category.replace('-', ' ')} Tests (${tests.length})
                    </h3>
                    ${tests.map((test) => `
                        <div class="test-item">
                            <div class="test-header">
                                <div>
                                    <strong>${test.name}</strong>
                                    <span class="test-status status-${test.status}">${test.status}</span>
                                </div>
                                <div style="color: #6c757d; font-size: 14px;">
                                    ${test.duration}ms
                                </div>
                            </div>
                            <div class="test-content">
                                <p style="color: #6c757d; margin-bottom: 15px;">${test.description}</p>
                                <div class="test-details">
                                    <div class="detail-row">
                                        <div class="detail-label">Expected:</div>
                                        <div>${test.expectedResult}</div>
                                    </div>
                                    <div class="detail-row">
                                        <div class="detail-label">Actual:</div>
                                        <div>${test.actualResult}</div>
                                    </div>
                                    ${test.error ? `
                                        <div class="error-message">
                                            <strong>Error:</strong> ${test.error}
                                        </div>
                                    ` : ''}
                                    ${test.screenshot ? `
                                        <div class="detail-row">
                                            <div class="detail-label">Screenshot:</div>
                                            <div>
                                                <img src="${test.screenshot}" alt="Test screenshot" class="screenshot" />
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Report generated by API Configuration Test Suite</p>
            <p>Environment: ${summary.environment} | Test Date: ${summary.testDate.toLocaleString()}</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }, [testResults, summary]);

  const generateMarkdownReport = useCallback(() => {
    const markdown = `# API Configuration Test Report

Generated on ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Tests | ${summary.totalTests} |
| Passed | ${summary.passed} (${summary.totalTests > 0 ? Math.round(summary.passed / summary.totalTests * 100) : 0}%) |
| Failed | ${summary.failed} |
| Skipped | ${summary.skipped} |
| Total Duration | ${Math.round(summary.totalDuration / 1000)}s |
| Environment | ${summary.environment} |

## Test Results by Category

${Object.entries(
      testResults.reduce((acc, test) => {
        if (!acc[test.category]) acc[test.category] = [];
        acc[test.category].push(test);
        return acc;
      }, {} as Record<string, TestResult[]>)
    ).map(([category, tests]) => `
### ${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Tests

${tests.map((test) => `
#### ${test.name} ${test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️'}

**Description:** ${test.description}  
**Status:** ${test.status.toUpperCase()}  
**Duration:** ${test.duration}ms  
**Expected Result:** ${test.expectedResult}  
**Actual Result:** ${test.actualResult}  
${test.error ? `**Error:** ${test.error}  ` : ''}
${test.screenshot ? `**Screenshot:** ![Test Screenshot](${test.screenshot})  ` : ''}

---
`).join('')}
`).join('')}

## Issues and Recommendations

${testResults.filter((test) => test.status === 'failed').length > 0 ? `
### Failed Tests
${testResults.filter((test) => test.status === 'failed').map((test) => `
- **${test.name}**: ${test.error || 'Test failed without specific error message'}
`).join('')}

### Recommendations
1. Review failed test cases and address underlying issues
2. Ensure all validation rules are properly implemented
3. Verify API endpoint configurations and responses
4. Check database connectivity and data integrity
5. Update test cases if requirements have changed
` : `
### All Tests Passed ✅
No issues detected. The API configuration system is functioning correctly.
`}

---
*Report generated by API Configuration Test Suite*
`;

    return markdown;
  }, [testResults, summary]);

  const generateJSONReport = useCallback(() => {
    const report = {
      metadata: {
        reportType: 'API Configuration Test Results',
        generatedAt: new Date().toISOString(),
        environment: summary.environment,
        version: '1.0.0'
      },
      summary: {
        totalTests: summary.totalTests,
        passed: summary.passed,
        failed: summary.failed,
        skipped: summary.skipped,
        passRate: summary.totalTests > 0 ? Math.round(summary.passed / summary.totalTests * 100) : 0,
        totalDuration: summary.totalDuration,
        testDate: summary.testDate.toISOString()
      },
      categories: Object.entries(
        testResults.reduce((acc, test) => {
          if (!acc[test.category]) acc[test.category] = [];
          acc[test.category].push(test);
          return acc;
        }, {} as Record<string, TestResult[]>)
      ).map(([category, tests]) => ({
        name: category,
        totalTests: tests.length,
        passed: tests.filter((t) => t.status === 'passed').length,
        failed: tests.filter((t) => t.status === 'failed').length,
        skipped: tests.filter((t) => t.status === 'skipped').length
      })),
      testResults: testResults.map((test) => ({
        id: test.id,
        name: test.name,
        description: test.description,
        category: test.category,
        status: test.status,
        duration: test.duration,
        timestamp: test.timestamp.toISOString(),
        expectedResult: test.expectedResult,
        actualResult: test.actualResult,
        error: test.error,
        screenshot: test.screenshot
      }))
    };

    return JSON.stringify(report, null, 2);
  }, [testResults, summary]);

  const downloadReport = useCallback(async (format: 'html' | 'markdown' | 'json') => {
    setIsGenerating(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'html':
          content = generateHTMLReport();
          filename = `api-test-report-${Date.now()}.html`;
          mimeType = 'text/html';
          break;
        case 'markdown':
          content = generateMarkdownReport();
          filename = `api-test-report-${Date.now()}.md`;
          mimeType = 'text/markdown';
          break;
        case 'json':
          content = generateJSONReport();
          filename = `api-test-report-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        default:
          throw new Error('Unsupported format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generateHTMLReport, generateMarkdownReport, generateJSONReport]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':return 'text-green-600 bg-green-50';
      case 'failed':return 'text-red-600 bg-red-50';
      case 'skipped':return 'text-yellow-600 bg-yellow-50';
      default:return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':return <CheckCircle2 className="w-4 h-4" />;
      case 'failed':return <XCircle className="w-4 h-4" />;
      case 'skipped':return <AlertTriangle className="w-4 h-4" />;
      default:return <Clock className="w-4 h-4" />;
    }
  };

  if (!testResults.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Test Results Available</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Run the test suite to generate comprehensive documentation and reports.
          </p>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Test Documentation & Reports
          </CardTitle>
          <CardDescription>
            Generate comprehensive documentation and export test results in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => downloadReport('html')}
              disabled={isGenerating}
              className="flex items-center gap-2">

              <Download className="w-4 h-4" />
              HTML Report
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadReport('markdown')}
              disabled={isGenerating}
              className="flex items-center gap-2">

              <Download className="w-4 h-4" />
              Markdown Report
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadReport('json')}
              disabled={isGenerating}
              className="flex items-center gap-2">

              <Download className="w-4 h-4" />
              JSON Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Execution Summary</CardTitle>
          <CardDescription className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {summary.testDate.toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.round(summary.totalDuration / 1000)}s total
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{summary.totalTests}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {summary.totalTests > 0 ? Math.round(summary.passed / summary.totalTests * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results Overview</CardTitle>
          <CardDescription>
            Detailed breakdown of all test cases and their results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {Object.entries(
                testResults.reduce((acc, test) => {
                  if (!acc[test.category]) acc[test.category] = [];
                  acc[test.category].push(test);
                  return acc;
                }, {} as Record<string, TestResult[]>)
              ).map(([category, tests]) =>
              <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 capitalize">
                    {category.replace('-', ' ')} Tests ({tests.length})
                  </h4>
                  <div className="space-y-2">
                    {tests.map((test) =>
                  <div key={test.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-1 rounded ${getStatusColor(test.status)}`}>
                            {getStatusIcon(test.status)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{test.name}</div>
                            <div className="text-sm text-muted-foreground">{test.description}</div>
                            {test.error &&
                        <Alert className="mt-2">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  {test.error}
                                </AlertDescription>
                              </Alert>
                        }
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{test.duration}ms</Badge>
                          {test.screenshot &&
                      <Button variant="ghost" size="sm">
                              <Camera className="w-4 h-4" />
                            </Button>
                      }
                        </div>
                      </div>
                  )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {summary.failed > 0 &&
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Issues & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {summary.failed} test(s) failed. Review the detailed results and address the underlying issues.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Recommended Actions:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Review failed test cases and error messages</li>
                  <li>Verify API endpoint configurations and responses</li>
                  <li>Check database connectivity and data integrity</li>
                  <li>Ensure all validation rules are properly implemented</li>
                  <li>Update test cases if requirements have changed</li>
                  <li>Run individual tests to isolate issues</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default TestDocumentationGenerator;