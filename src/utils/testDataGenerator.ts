import type { ApiConfigTestData } from '@/types/testing';

export class TestDataGenerator {
  static generateValidApiConfig(index: number = 1): ApiConfigTestData {
    return {
      name: `Test API Config ${index}`,
      provider: `Provider ${index}`,
      baseUrl: `https://api-${index}.example.com`,
      apiKey: `test-api-key-${index}-${Date.now()}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Test-Header': `test-value-${index}`
      },
      isActive: true,
      description: `Test API configuration ${index} for automated testing`
    };
  }

  static generateInvalidApiConfigs(): ApiConfigTestData[] {
    return [
    {
      name: '',
      provider: 'Invalid Provider',
      baseUrl: 'invalid-url',
      apiKey: 'test-key',
      headers: {},
      isActive: true,
      description: 'Invalid config with empty name and invalid URL'
    },
    {
      name: 'Valid Name',
      provider: '',
      baseUrl: 'https://api.example.com',
      apiKey: '',
      headers: {},
      isActive: true,
      description: 'Invalid config with empty provider and API key'
    },
    {
      name: 'Very Long Name That Exceeds Normal Limits And Should Be Rejected By Validation',
      provider: 'Test Provider',
      baseUrl: 'ftp://invalid-protocol.com',
      apiKey: 'test-key',
      headers: {},
      isActive: true,
      description: 'Invalid config with long name and unsupported protocol'
    }];

  }

  static generateBulkTestData(count: number = 10): ApiConfigTestData[] {
    return Array.from({ length: count }, (_, index) =>
    this.generateValidApiConfig(index + 1)
    );
  }

  static generateExportTestData(): any {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      apiConfigurations: [
      this.generateValidApiConfig(1),
      this.generateValidApiConfig(2),
      {
        ...this.generateValidApiConfig(3),
        provider: 'Export Test Provider',
        description: 'Configuration for export/import testing'
      }]

    };
  }

  static generateInvalidExportData(): any[] {
    return [
    { invalid: 'structure' },
    null,
    'invalid string data',
    { version: '1.0', apiConfigurations: 'not an array' },
    {
      version: '1.0',
      apiConfigurations: [
      { name: 'Missing required fields' }]

    }];

  }
}