function generateTestReport(testResults) {
  try {
    const timestamp = new Date().toISOString();

    // Calculate test statistics
    const totalTests = testResults.length;
    const passedTests = testResults.filter((r) => r.status === 'passed').length;
    const failedTests = testResults.filter((r) => r.status === 'failed').length;
    const skippedTests = testResults.filter((r) => r.status === 'skipped').length;
    const successRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(2) : 0;

    // Calculate performance metrics
    const totalDuration = testResults.reduce((sum, r) => sum + (r.duration || 0), 0);
    const averageDuration = totalTests > 0 ? (totalDuration / totalTests).toFixed(2) : 0;
    const slowestTest = testResults.reduce((slowest, current) => {
      return (current.duration || 0) > (slowest.duration || 0) ? current : slowest;
    }, testResults[0] || {});

    // Group results by category
    const resultsByCategory = testResults.reduce((groups, result) => {
      const category = result.category || 'UNKNOWN';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
      return groups;
    }, {});

    // Generate detailed report
    const report = {
      metadata: {
        generatedAt: timestamp,
        reportVersion: '1.0.0',
        testSuite: 'API Configuration Management Tests',
        environment: 'Testing Environment'
      },
      summary: {
        totalTests,
        passedTests,
        failedTests,
        skippedTests,
        successRate: `${successRate}%`,
        totalDuration: `${totalDuration}ms`,
        averageDuration: `${averageDuration}ms`
      },
      performance: {
        totalExecutionTime: totalDuration,
        averageTestTime: parseFloat(averageDuration),
        slowestTest: slowestTest ? {
          name: slowestTest.name,
          duration: slowestTest.duration,
          category: slowestTest.category
        } : null,
        fastestTest: testResults.reduce((fastest, current) => {
          return (current.duration || Infinity) < (fastest.duration || Infinity) ? current : fastest;
        }, testResults[0] || {})
      },
      categoryBreakdown: Object.keys(resultsByCategory).map((category) => {
        const categoryTests = resultsByCategory[category];
        const categoryPassed = categoryTests.filter((r) => r.status === 'passed').length;
        const categoryFailed = categoryTests.filter((r) => r.status === 'failed').length;

        return {
          category,
          total: categoryTests.length,
          passed: categoryPassed,
          failed: categoryFailed,
          successRate: `${(categoryPassed / categoryTests.length * 100).toFixed(2)}%`
        };
      }),
      detailedResults: testResults.map((result) => ({
        id: result.id,
        name: result.name,
        description: result.description,
        category: result.category,
        status: result.status,
        duration: result.duration,
        expectedResult: result.expectedResult,
        actualResult: result.actualResult,
        error: result.error,
        screenshot: result.screenshot,
        timestamp: result.timestamp || timestamp
      })),
      failedTests: testResults.
      filter((r) => r.status === 'failed').
      map((result) => ({
        name: result.name,
        category: result.category,
        error: result.error,
        expectedResult: result.expectedResult,
        actualResult: result.actualResult,
        duration: result.duration
      })),
      recommendations: generateRecommendations(testResults, resultsByCategory),
      exportFormats: {
        html: generateHtmlReport(testResults),
        csv: generateCsvReport(testResults),
        json: JSON.stringify(testResults, null, 2)
      }
    };

    return report;
  } catch (error) {
    throw new Error(`Test report generation failed: ${error.message}`);
  }
}

function generateRecommendations(testResults, resultsByCategory) {
  const recommendations = [];
  const failedTests = testResults.filter((r) => r.status === 'failed');

  // Performance recommendations
  const slowTests = testResults.filter((r) => (r.duration || 0) > 5000);
  if (slowTests.length > 0) {
    recommendations.push({
      type: 'performance',
      priority: 'medium',
      title: 'Slow Test Performance',
      description: `${slowTests.length} tests took longer than 5 seconds to execute`,
      suggestion: 'Consider optimizing database queries and API call timeouts'
    });
  }

  // Validation recommendations
  const validationFailures = failedTests.filter((r) => r.category === 'VALIDATION');
  if (validationFailures.length > 0) {
    recommendations.push({
      type: 'validation',
      priority: 'high',
      title: 'Validation Issues',
      description: `${validationFailures.length} validation tests failed`,
      suggestion: 'Review input validation rules and error handling'
    });
  }

  // CRUD operation recommendations
  const crudFailures = failedTests.filter((r) => ['CREATE', 'READ', 'UPDATE', 'DELETE'].includes(r.category));
  if (crudFailures.length > 0) {
    recommendations.push({
      type: 'crud',
      priority: 'high',
      title: 'CRUD Operation Failures',
      description: `${crudFailures.length} CRUD operations failed`,
      suggestion: 'Check database connections and table permissions'
    });
  }

  // Success rate recommendations
  const totalTests = testResults.length;
  const passedTests = testResults.filter((r) => r.status === 'passed').length;
  const successRate = passedTests / totalTests * 100;

  if (successRate < 80) {
    recommendations.push({
      type: 'overall',
      priority: 'critical',
      title: 'Low Test Success Rate',
      description: `Only ${successRate.toFixed(2)}% of tests passed`,
      suggestion: 'Investigate failing tests and address underlying issues before deployment'
    });
  }

  return recommendations;
}

function generateHtmlReport(testResults) {
  const timestamp = new Date().toISOString();
  const totalTests = testResults.length;
  const passedTests = testResults.filter((r) => r.status === 'passed').length;
  const failedTests = testResults.filter((r) => r.status === 'failed').length;

  return `
<!DOCTYPE html>
<html>
<head>
    <title>API Configuration Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e1e5e9; text-align: center; flex: 1; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .test-result { margin: 10px 0; padding: 15px; border-radius: 8px; border: 1px solid #e1e5e9; }
        .test-passed { background: #d4edda; border-color: #c3e6cb; }
        .test-failed { background: #f8d7da; border-color: #f5c6cb; }
        .test-name { font-weight: bold; margin-bottom: 5px; }
        .test-details { font-size: 0.9em; color: #6c757d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>API Configuration Test Report</h1>
        <p>Generated on: ${timestamp}</p>
    </div>
    
    <div class="summary">
        <div class="stat">
            <h3>Total Tests</h3>
            <div style="font-size: 2em; font-weight: bold;">${totalTests}</div>
        </div>
        <div class="stat">
            <h3>Passed</h3>
            <div style="font-size: 2em; font-weight: bold;" class="passed">${passedTests}</div>
        </div>
        <div class="stat">
            <h3>Failed</h3>
            <div style="font-size: 2em; font-weight: bold;" class="failed">${failedTests}</div>
        </div>
        <div class="stat">
            <h3>Success Rate</h3>
            <div style="font-size: 2em; font-weight: bold;">${(passedTests / totalTests * 100).toFixed(1)}%</div>
        </div>
    </div>
    
    <h2>Test Results</h2>
    ${testResults.map((result) => `
        <div class="test-result test-${result.status}">
            <div class="test-name">${result.name} (${result.category})</div>
            <div class="test-details">
                <p><strong>Status:</strong> ${result.status.toUpperCase()}</p>
                <p><strong>Description:</strong> ${result.description}</p>
                ${result.expectedResult ? `<p><strong>Expected:</strong> ${result.expectedResult}</p>` : ''}
                ${result.actualResult ? `<p><strong>Actual:</strong> ${result.actualResult}</p>` : ''}
                ${result.error ? `<p><strong>Error:</strong> ${result.error}</p>` : ''}
                ${result.duration ? `<p><strong>Duration:</strong> ${result.duration}ms</p>` : ''}
            </div>
        </div>
    `).join('')}
</body>
</html>`;
}

function generateCsvReport(testResults) {
  const headers = ['Test Name', 'Category', 'Status', 'Duration (ms)', 'Expected Result', 'Actual Result', 'Error'];
  const csvRows = [
  headers.join(','),
  ...testResults.map((result) => [
  `"${result.name || ''}"`,
  `"${result.category || ''}"`,
  `"${result.status || ''}"`,
  result.duration || '',
  `"${result.expectedResult || ''}"`,
  `"${result.actualResult || ''}"`,
  `"${result.error || ''}"`].
  join(','))];


  return csvRows.join('\n');
}