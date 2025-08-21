export interface ApiConfigurationTestData {
  name: string;
  provider: string;
  base_url: string;
  api_key: string;
  description?: string;
  is_active?: boolean;
  contact_email?: string;
  rate_limit?: number;
  timeout?: number;
  auth_type?: string;
  headers?: Record<string, string>;
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  data: Partial<ApiConfigurationTestData>;
  expectedResult: 'success' | 'validation_error' | 'server_error';
  validationErrors?: string[];
}

export class ComprehensiveTestDataGenerator {
  // Valid test data scenarios
  static getValidTestData(): TestScenario[] {
    return [
    {
      id: 'valid-rest-api',
      name: 'Valid REST API Configuration',
      description: 'Complete valid API configuration with all required fields',
      data: {
        name: 'Production REST API',
        provider: 'REST',
        base_url: 'https://api.example.com/v1',
        api_key: 'prod_key_12345',
        description: 'Main production REST API endpoint',
        is_active: true,
        contact_email: 'admin@example.com',
        rate_limit: 1000,
        timeout: 30,
        auth_type: 'bearer',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      expectedResult: 'success'
    },
    {
      id: 'valid-graphql-api',
      name: 'Valid GraphQL API Configuration',
      description: 'GraphQL API with proper configuration',
      data: {
        name: 'GraphQL API Gateway',
        provider: 'GraphQL',
        base_url: 'https://graphql.example.com/api',
        api_key: 'gql_token_67890',
        description: 'GraphQL endpoint for data queries',
        is_active: true,
        contact_email: 'graphql@example.com',
        rate_limit: 500,
        timeout: 60,
        auth_type: 'api_key'
      },
      expectedResult: 'success'
    },
    {
      id: 'valid-minimal-config',
      name: 'Minimal Valid Configuration',
      description: 'Configuration with only required fields',
      data: {
        name: 'Minimal API',
        provider: 'REST',
        base_url: 'https://minimal.example.com',
        api_key: 'min_key_123'
      },
      expectedResult: 'success'
    }];

  }

  // Invalid test data scenarios for validation testing
  static getInvalidTestData(): TestScenario[] {
    return [
    {
      id: 'missing-name',
      name: 'Missing Required Name Field',
      description: 'Configuration missing the required name field',
      data: {
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123'
      },
      expectedResult: 'validation_error',
      validationErrors: ['Name is required']
    },
    {
      id: 'missing-provider',
      name: 'Missing Provider Field',
      description: 'Configuration missing the provider field',
      data: {
        name: 'Test API',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123'
      },
      expectedResult: 'validation_error',
      validationErrors: ['Provider is required']
    },
    {
      id: 'invalid-url-format',
      name: 'Invalid URL Format',
      description: 'Configuration with malformed base URL',
      data: {
        name: 'Invalid URL API',
        provider: 'REST',
        base_url: 'not-a-valid-url',
        api_key: 'test_key_123'
      },
      expectedResult: 'validation_error',
      validationErrors: ['Base URL must be a valid URL']
    },
    {
      id: 'invalid-url-protocol',
      name: 'Invalid URL Protocol',
      description: 'URL with unsupported protocol',
      data: {
        name: 'FTP API',
        provider: 'REST',
        base_url: 'ftp://ftp.example.com/api',
        api_key: 'test_key_123'
      },
      expectedResult: 'validation_error',
      validationErrors: ['Only HTTP and HTTPS protocols are allowed']
    },
    {
      id: 'invalid-email',
      name: 'Invalid Email Format',
      description: 'Configuration with invalid contact email',
      data: {
        name: 'Email Test API',
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123',
        contact_email: 'invalid-email-format'
      },
      expectedResult: 'validation_error',
      validationErrors: ['Contact email must be a valid email address']
    },
    {
      id: 'empty-api-key',
      name: 'Empty API Key',
      description: 'Configuration with empty API key',
      data: {
        name: 'Empty Key API',
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: ''
      },
      expectedResult: 'validation_error',
      validationErrors: ['API key cannot be empty']
    },
    {
      id: 'negative-rate-limit',
      name: 'Negative Rate Limit',
      description: 'Configuration with negative rate limit',
      data: {
        name: 'Negative Limit API',
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123',
        rate_limit: -100
      },
      expectedResult: 'validation_error',
      validationErrors: ['Rate limit must be a positive number']
    },
    {
      id: 'excessive-timeout',
      name: 'Excessive Timeout Value',
      description: 'Configuration with unreasonably high timeout',
      data: {
        name: 'Long Timeout API',
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123',
        timeout: 999999
      },
      expectedResult: 'validation_error',
      validationErrors: ['Timeout cannot exceed 300 seconds']
    }];

  }

  // Edge case test data
  static getEdgeCaseTestData(): TestScenario[] {
    return [
    {
      id: 'very-long-name',
      name: 'Extremely Long Configuration Name',
      description: 'Configuration with name exceeding normal limits',
      data: {
        name: 'A'.repeat(500), // Very long name
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123'
      },
      expectedResult: 'validation_error',
      validationErrors: ['Name cannot exceed 255 characters']
    },
    {
      id: 'special-characters-name',
      name: 'Special Characters in Name',
      description: 'Configuration name with special characters',
      data: {
        name: 'Test API @#$%^&*()[]{}|\\:";\'<>?,./',
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123'
      },
      expectedResult: 'success' // Should handle special characters gracefully
    },
    {
      id: 'unicode-name',
      name: 'Unicode Characters in Name',
      description: 'Configuration with international characters',
      data: {
        name: 'Test API 测试 тест テスト 🚀',
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123'
      },
      expectedResult: 'success'
    },
    {
      id: 'localhost-url',
      name: 'Localhost URL',
      description: 'Configuration pointing to localhost',
      data: {
        name: 'Localhost API',
        provider: 'REST',
        base_url: 'http://localhost:3000/api',
        api_key: 'test_key_123'
      },
      expectedResult: 'success'
    },
    {
      id: 'ip-address-url',
      name: 'IP Address URL',
      description: 'Configuration with IP address instead of domain',
      data: {
        name: 'IP API',
        provider: 'REST',
        base_url: 'https://192.168.1.100:8080/api',
        api_key: 'test_key_123'
      },
      expectedResult: 'success'
    }];

  }

  // Search and filter test data
  static getSearchTestData(): {
    query: string;
    filters: Array<{field: string;value: any;operator: string;}>;
    expectedCount?: number;
    description: string;
  }[] {
    return [
    {
      query: 'REST',
      filters: [{ field: 'provider', value: 'REST', operator: 'Equal' }],
      description: 'Search for REST API providers'
    },
    {
      query: 'production',
      filters: [{ field: 'name', value: 'production', operator: 'StringContains' }],
      description: 'Search for configurations with "production" in name'
    },
    {
      query: '',
      filters: [{ field: 'is_active', value: true, operator: 'Equal' }],
      description: 'Filter for active configurations only'
    },
    {
      query: '',
      filters: [{ field: 'rate_limit', value: 500, operator: 'GreaterThan' }],
      description: 'Filter for high-throughput APIs (rate limit > 500)'
    },
    {
      query: 'example.com',
      filters: [{ field: 'base_url', value: 'example.com', operator: 'StringContains' }],
      description: 'Search for APIs hosted on example.com'
    }];

  }

  // Import/Export test data
  static getImportTestData(): {
    format: 'json' | 'csv' | 'xml';
    data: any;
    isValid: boolean;
    description: string;
  }[] {
    return [
    {
      format: 'json',
      data: JSON.stringify([
      {
        name: 'Import Test API 1',
        provider: 'REST',
        base_url: 'https://import1.example.com',
        api_key: 'import_key_1'
      },
      {
        name: 'Import Test API 2',
        provider: 'GraphQL',
        base_url: 'https://import2.example.com',
        api_key: 'import_key_2'
      }],
      null, 2),
      isValid: true,
      description: 'Valid JSON import data with multiple configurations'
    },
    {
      format: 'json',
      data: '{"invalid": "json"',
      isValid: false,
      description: 'Invalid JSON format (malformed)'
    },
    {
      format: 'json',
      data: JSON.stringify([
      {
        name: 'Missing Provider API',
        base_url: 'https://missing.example.com',
        api_key: 'missing_key'
        // Missing required provider field
      }]
      ),
      isValid: false,
      description: 'JSON with missing required fields'
    },
    {
      format: 'csv',
      data: 'name,provider,base_url,api_key\n"CSV Test API 1","REST","https://csv1.example.com","csv_key_1"\n"CSV Test API 2","GraphQL","https://csv2.example.com","csv_key_2"',
      isValid: true,
      description: 'Valid CSV import data'
    },
    {
      format: 'csv',
      data: 'name,provider\n"Incomplete CSV API","REST"',
      isValid: false,
      description: 'CSV missing required columns'
    }];

  }

  // Performance test data generators
  static generateBulkTestData(count: number): ApiConfigurationTestData[] {
    const providers = ['REST', 'GraphQL', 'SOAP', 'gRPC'];
    const domains = ['api.example.com', 'service.test.com', 'gateway.demo.org'];
    const authTypes = ['bearer', 'api_key', 'oauth', 'basic'];

    return Array.from({ length: count }, (_, index) => ({
      name: `Bulk Test API ${index + 1}`,
      provider: providers[index % providers.length],
      base_url: `https://${domains[index % domains.length]}/v${index % 3 + 1}`,
      api_key: `bulk_key_${String(index + 1).padStart(6, '0')}`,
      description: `Automatically generated test configuration ${index + 1}`,
      is_active: Math.random() > 0.2, // 80% active
      contact_email: `admin${index + 1}@example.com`,
      rate_limit: Math.floor(Math.random() * 1000) + 100,
      timeout: Math.floor(Math.random() * 60) + 10,
      auth_type: authTypes[index % authTypes.length]
    }));
  }

  // Security test data
  static getSecurityTestData(): TestScenario[] {
    return [
    {
      id: 'sql-injection-attempt',
      name: 'SQL Injection in Name Field',
      description: 'Attempt SQL injection through name field',
      data: {
        name: "'; DROP TABLE api_configurations; --",
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123'
      },
      expectedResult: 'success' // Should be sanitized, not cause error
    },
    {
      id: 'xss-attempt',
      name: 'XSS Attempt in Description',
      description: 'Cross-site scripting attempt in description field',
      data: {
        name: 'XSS Test API',
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key_123',
        description: '<script>alert("XSS")</script>'
      },
      expectedResult: 'success' // Should be sanitized
    },
    {
      id: 'command-injection-attempt',
      name: 'Command Injection Attempt',
      description: 'Attempt command injection through API key field',
      data: {
        name: 'Command Test API',
        provider: 'REST',
        base_url: 'https://api.example.com',
        api_key: 'test_key; rm -rf /'
      },
      expectedResult: 'success' // Should be handled safely
    }];

  }

  // Get all test scenarios combined
  static getAllTestScenarios(): TestScenario[] {
    return [
    ...this.getValidTestData(),
    ...this.getInvalidTestData(),
    ...this.getEdgeCaseTestData(),
    ...this.getSecurityTestData()];

  }
}