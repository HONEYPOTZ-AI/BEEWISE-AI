
import { describe, it, expect } from 'vitest'
import { securityManager } from '@/utils/security'

describe('securityManager', () => {
  describe('sanitizeInput', () => {
    it('removes script tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      const sanitized = securityManager.sanitizeInput(input)
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('Hello')
    })

    it('removes dangerous HTML attributes', () => {
      const input = '<div onclick="alert(\'xss\')">Content</div>'
      const sanitized = securityManager.sanitizeInput(input)
      expect(sanitized).not.toContain('onclick')
      expect(sanitized).toContain('Content')
    })

    it('allows safe HTML tags', () => {
      const input = '<p>Safe <strong>content</strong></p>'
      const sanitized = securityManager.sanitizeInput(input)
      expect(sanitized).toContain('<p>')
      expect(sanitized).toContain('<strong>')
    })

    it('handles empty input', () => {
      const sanitized = securityManager.sanitizeInput('')
      expect(sanitized).toBe('')
    })

    it('handles null and undefined', () => {
      expect(securityManager.sanitizeInput(null)).toBe('')
      expect(securityManager.sanitizeInput(undefined)).toBe('')
    })
  })

  describe('validateCSRFToken', () => {
    it('validates valid tokens', () => {
      const validToken = 'valid-csrf-token-123'
      expect(securityManager.validateCSRFToken(validToken)).toBe(true)
    })

    it('rejects invalid tokens', () => {
      const invalidToken = ''
      expect(securityManager.validateCSRFToken(invalidToken)).toBe(false)
    })

    it('rejects null/undefined tokens', () => {
      expect(securityManager.validateCSRFToken(null)).toBe(false)
      expect(securityManager.validateCSRFToken(undefined)).toBe(false)
    })
  })

  describe('encryptSensitiveData', () => {
    it('encrypts data', () => {
      const data = 'sensitive-information'
      const encrypted = securityManager.encryptSensitiveData(data)
      expect(encrypted).toBeDefined()
      expect(encrypted).not.toBe(data)
    })

    it('handles empty data', () => {
      const encrypted = securityManager.encryptSensitiveData('')
      expect(encrypted).toBeDefined()
    })

    it('produces different outputs for same input', () => {
      const data = 'test-data'
      const encrypted1 = securityManager.encryptSensitiveData(data)
      const encrypted2 = securityManager.encryptSensitiveData(data)
      // Should be different due to salt/IV
      expect(encrypted1).not.toBe(encrypted2)
    })
  })

  describe('rate limiting', () => {
    it('allows requests within limit', () => {
      const allowed = securityManager.checkRateLimit('user123', 1)
      expect(allowed).toBe(true)
    })

    it('blocks requests exceeding limit', () => {
      const userId = 'user456'
      
      // Make multiple requests
      for (let i = 0; i < 10; i++) {
        securityManager.checkRateLimit(userId, 5)
      }
      
      const blocked = securityManager.checkRateLimit(userId, 5)
      expect(blocked).toBe(false)
    })
  })
})
