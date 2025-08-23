
import { describe, it, expect } from 'vitest';
import {
  generateApiTestData,
  generateUserTestData,
  generateRandomString,
  generateRandomEmail,
  generateTestEndpoints } from
'@/utils/testDataGenerator';

describe('testDataGenerator', () => {
  describe('generateRandomString', () => {
    it('generates string of specified length', () => {
      const length = 10;
      const randomString = generateRandomString(length);
      expect(randomString).toHaveLength(length);
      expect(typeof randomString).toBe('string');
    });

    it('generates different strings on multiple calls', () => {
      const string1 = generateRandomString(10);
      const string2 = generateRandomString(10);
      expect(string1).not.toBe(string2);
    });

    it('handles edge cases', () => {
      expect(generateRandomString(0)).toHaveLength(0);
      expect(generateRandomString(1)).toHaveLength(1);
    });
  });

  describe('generateRandomEmail', () => {
    it('generates valid email format', () => {
      const email = generateRandomEmail();
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('generates different emails', () => {
      const email1 = generateRandomEmail();
      const email2 = generateRandomEmail();
      expect(email1).not.toBe(email2);
    });

    it('accepts custom domain', () => {
      const email = generateRandomEmail('custom.com');
      expect(email).toContain('@custom.com');
    });
  });

  describe('generateUserTestData', () => {
    it('generates valid user data', () => {
      const userData = generateUserTestData();

      expect(userData).toHaveProperty('id');
      expect(userData).toHaveProperty('name');
      expect(userData).toHaveProperty('email');
      expect(userData).toHaveProperty('created_at');

      expect(typeof userData.id).toBe('number');
      expect(typeof userData.name).toBe('string');
      expect(userData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(userData.name.length).toBeGreaterThan(0);
    });

    it('generates different users', () => {
      const user1 = generateUserTestData();
      const user2 = generateUserTestData();

      expect(user1.id).not.toBe(user2.id);
      expect(user1.email).not.toBe(user2.email);
    });

    it('accepts count parameter', () => {
      const users = generateUserTestData(5);
      expect(Array.isArray(users)).toBe(true);
      expect(users).toHaveLength(5);

      users.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
      });
    });
  });

  describe('generateApiTestData', () => {
    it('generates API configuration data', () => {
      const apiData = generateApiTestData();

      expect(apiData).toHaveProperty('api_name');
      expect(apiData).toHaveProperty('base_url');
      expect(apiData).toHaveProperty('description');
      expect(apiData).toHaveProperty('auth_type');

      expect(typeof apiData.api_name).toBe('string');
      expect(apiData.base_url).toMatch(/^https?:\/\//);
      expect(['none', 'bearer', 'basic', 'api_key']).toContain(apiData.auth_type);
    });

    it('generates different API configs', () => {
      const api1 = generateApiTestData();
      const api2 = generateApiTestData();

      expect(api1.api_name).not.toBe(api2.api_name);
      expect(api1.base_url).not.toBe(api2.base_url);
    });
  });

  describe('generateTestEndpoints', () => {
    it('generates test endpoints', () => {
      const endpoints = generateTestEndpoints();

      expect(Array.isArray(endpoints)).toBe(true);
      expect(endpoints.length).toBeGreaterThan(0);

      endpoints.forEach((endpoint) => {
        expect(endpoint).toHaveProperty('path');
        expect(endpoint).toHaveProperty('method');
        expect(endpoint).toHaveProperty('description');

        expect(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).toContain(endpoint.method);
        expect(endpoint.path).toMatch(/^\//);
      });
    });

    it('accepts count parameter', () => {
      const count = 3;
      const endpoints = generateTestEndpoints(count);

      expect(endpoints).toHaveLength(count);
    });

    it('generates different endpoints', () => {
      const endpoints1 = generateTestEndpoints(2);
      const endpoints2 = generateTestEndpoints(2);

      expect(endpoints1).not.toEqual(endpoints2);
    });
  });

  describe('test data quality', () => {
    it('generates realistic API names', () => {
      const apiData = generateApiTestData();
      const commonWords = ['API', 'Service', 'Gateway', 'Platform', 'Hub'];

      expect(commonWords.some((word) =>
      apiData.api_name.includes(word)
      )).toBe(true);
    });

    it('generates valid URLs', () => {
      const apiData = generateApiTestData();
      expect(() => new URL(apiData.base_url)).not.toThrow();
    });

    it('generates meaningful descriptions', () => {
      const apiData = generateApiTestData();
      expect(apiData.description.length).toBeGreaterThan(10);
      expect(apiData.description).toContain(' ');
    });
  });
});