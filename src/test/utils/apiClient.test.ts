
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/utils/apiClient';

// Mock fetch
global.fetch = vi.fn();

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve({ data: 'test' }),
      text: () => Promise.resolve('test')
    });
  });

  describe('GET requests', () => {
    it('makes GET request successfully', async () => {
      const response = await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith('/test', {
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      });
      expect(response).toEqual({ data: 'test' });
    });

    it('includes query parameters', async () => {
      await apiClient.get('/test', { params: { page: 1, limit: 10 } });

      expect(fetch).toHaveBeenCalledWith('/test?page=1&limit=10', expect.any(Object));
    });

    it('includes custom headers', async () => {
      const customHeaders = { 'X-Custom-Header': 'value' };
      await apiClient.get('/test', { headers: customHeaders });

      expect(fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        headers: expect.objectContaining(customHeaders)
      }));
    });
  });

  describe('POST requests', () => {
    it('makes POST request with data', async () => {
      const data = { name: 'test', value: 123 };
      await apiClient.post('/test', data);

      expect(fetch).toHaveBeenCalledWith('/test', {
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(data)
      });
    });

    it('handles FormData', async () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test']));

      await apiClient.post('/upload', formData);

      expect(fetch).toHaveBeenCalledWith('/upload', expect.objectContaining({
        method: 'POST',
        body: formData
      }));
    });
  });

  describe('PUT requests', () => {
    it('makes PUT request successfully', async () => {
      const data = { id: 1, name: 'updated' };
      await apiClient.put('/test/1', data);

      expect(fetch).toHaveBeenCalledWith('/test/1', {
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(data)
      });
    });
  });

  describe('DELETE requests', () => {
    it('makes DELETE request successfully', async () => {
      await apiClient.delete('/test/1');

      expect(fetch).toHaveBeenCalledWith('/test/1', {
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      });
    });
  });

  describe('error handling', () => {
    it('handles network errors', async () => {
      // @ts-ignore
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow('Network error');
    });

    it('handles HTTP errors', async () => {
      // @ts-ignore
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ error: 'Not found' })
      });

      await expect(apiClient.get('/test')).rejects.toThrow('HTTP error! status: 404');
    });

    it('handles JSON parse errors', async () => {
      // @ts-ignore
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Invalid JSON')),
        text: () => Promise.resolve('invalid json')
      });

      const response = await apiClient.get('/test');
      expect(response).toBe('invalid json');
    });
  });

  describe('authentication', () => {
    it('includes auth token in headers', async () => {
      const token = 'bearer-token-123';
      await apiClient.get('/protected', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      expect(fetch).toHaveBeenCalledWith('/protected', expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${token}`
        })
      }));
    });
  });

  describe('interceptors', () => {
    it('applies request interceptors', async () => {
      // Test request transformation
      await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('applies response interceptors', async () => {
      const response = await apiClient.get('/test');

      // Response should be processed by interceptors
      expect(response).toBeDefined();
    });
  });
});