
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  registerServiceWorker,
  unregisterServiceWorker,
  checkForUpdates } from
'@/utils/serviceWorker';

// Mock navigator.serviceWorker
const mockServiceWorker = {
  register: vi.fn(),
  getRegistrations: vi.fn(),
  ready: Promise.resolve({
    unregister: vi.fn(),
    update: vi.fn()
  })
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(navigator, 'serviceWorker', {
    value: mockServiceWorker,
    configurable: true
  });
});

describe('serviceWorker utilities', () => {
  describe('registerServiceWorker', () => {
    it('registers service worker successfully', async () => {
      mockServiceWorker.register.mockResolvedValue({
        installing: null,
        waiting: null,
        active: { state: 'activated' },
        addEventListener: vi.fn()
      });

      const result = await registerServiceWorker();
      expect(result).toBe(true);
      expect(mockServiceWorker.register).toHaveBeenCalledWith('/service-worker.js');
    });

    it('handles registration failure', async () => {
      mockServiceWorker.register.mockRejectedValue(new Error('Registration failed'));

      const result = await registerServiceWorker();
      expect(result).toBe(false);
    });

    it('skips registration when service worker not supported', async () => {
      // @ts-ignore
      delete navigator.serviceWorker;

      const result = await registerServiceWorker();
      expect(result).toBe(false);
    });

    it('registers with custom path', async () => {
      mockServiceWorker.register.mockResolvedValue({
        installing: null,
        waiting: null,
        active: { state: 'activated' },
        addEventListener: vi.fn()
      });

      await registerServiceWorker('/custom-sw.js');
      expect(mockServiceWorker.register).toHaveBeenCalledWith('/custom-sw.js');
    });
  });

  describe('unregisterServiceWorker', () => {
    it('unregisters service worker successfully', async () => {
      const mockUnregister = vi.fn().mockResolvedValue(true);
      mockServiceWorker.getRegistrations.mockResolvedValue([
      { unregister: mockUnregister }]
      );

      const result = await unregisterServiceWorker();
      expect(result).toBe(true);
      expect(mockUnregister).toHaveBeenCalled();
    });

    it('handles unregistration failure', async () => {
      mockServiceWorker.getRegistrations.mockRejectedValue(new Error('Failed'));

      const result = await unregisterServiceWorker();
      expect(result).toBe(false);
    });

    it('handles no registrations', async () => {
      mockServiceWorker.getRegistrations.mockResolvedValue([]);

      const result = await unregisterServiceWorker();
      expect(result).toBe(true);
    });
  });

  describe('checkForUpdates', () => {
    it('checks for updates successfully', async () => {
      const mockUpdate = vi.fn();
      mockServiceWorker.ready = Promise.resolve({
        update: mockUpdate,
        unregister: vi.fn()
      });

      await checkForUpdates();
      expect(mockUpdate).toHaveBeenCalled();
    });

    it('handles update check failure', async () => {
      const mockUpdate = vi.fn().mockRejectedValue(new Error('Update failed'));
      mockServiceWorker.ready = Promise.resolve({
        update: mockUpdate,
        unregister: vi.fn()
      });

      // Should not throw
      await expect(checkForUpdates()).resolves.toBeUndefined();
    });

    it('skips when service worker not available', async () => {
      // @ts-ignore
      delete navigator.serviceWorker;

      // Should not throw
      await expect(checkForUpdates()).resolves.toBeUndefined();
    });
  });
});