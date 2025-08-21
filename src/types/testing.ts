export interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'VALIDATION' | 'SEARCH' | 'IMPORT_EXPORT' | 'UI';
  execute: () => Promise<TestResult>;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED';
  duration: number;
  message: string;
  details?: any;
  screenshot?: string;
  expectedResult?: string;
  actualResult?: string;
}

export interface TestSuite {
  name: string;
  description: string;
  testCases: TestCase[];
}

export interface ApiConfigTestData {
  name: string;
  provider: string;
  baseUrl: string;
  apiKey: string;
  headers: Record<string, string>;
  isActive: boolean;
  description: string;
}

export interface TestReport {
  suiteId: string;
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  totalDuration: number;
  startTime: Date;
  endTime: Date;
  results: TestResult[];
}