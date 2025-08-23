
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Comprehensive Test Suite...\n');

const testCommands = [
{
  name: 'Lint Check',
  command: 'npm run lint',
  description: 'Running ESLint checks...'
},
{
  name: 'Type Check',
  command: 'npx tsc --noEmit',
  description: 'Running TypeScript type checks...'
},
{
  name: 'Unit Tests',
  command: 'npm run test:run',
  description: 'Running unit tests...'
},
{
  name: 'Coverage Report',
  command: 'npm run test:coverage',
  description: 'Generating coverage report...'
}];


let allTestsPassed = true;
const results = [];

for (const test of testCommands) {
  console.log(`📋 ${test.description}`);

  try {
    const startTime = Date.now();
    const output = execSync(test.command, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    const duration = Date.now() - startTime;

    console.log(`✅ ${test.name} passed (${duration}ms)\n`);
    results.push({
      name: test.name,
      status: 'passed',
      duration,
      output: output.slice(-500) // Last 500 chars
    });
  } catch (error) {
    console.log(`❌ ${test.name} failed\n`);
    console.log(error.stdout?.slice(-1000) || error.message);
    console.log('\n');

    allTestsPassed = false;
    results.push({
      name: test.name,
      status: 'failed',
      error: error.message,
      output: error.stdout
    });
  }
}

// Generate test report
const reportPath = path.join(__dirname, '..', 'test-results.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  overall: allTestsPassed ? 'passed' : 'failed',
  results
}, null, 2));

console.log(`📊 Test report saved to: ${reportPath}`);

if (allTestsPassed) {
  console.log('🎉 All tests passed! Ready for deployment.');
  process.exit(0);
} else {
  console.log('💥 Some tests failed. Please review and fix issues.');
  process.exit(1);
}