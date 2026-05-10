import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { buildApp } from '../../src/app.js';
import { mockRedis } from '../setup.js';

describe('API Validation Tests', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const generateAuthHeaders = () => {
    const userId = '00000000-0000-0000-0000-000000000001';
    const token = app.jwt.sign({ id: userId, email: 'test@test.com' });
    mockRedis.get.mockResolvedValue(JSON.stringify({ id: userId }));
    return { authorization: `Bearer ${token}` };
  };

  describe('Auth Validation', () => {
    it('should return 400 for invalid email format', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: { email: 'invalid-email', password: 'password123' }
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body) as Record<string, unknown>;
      expect(String(body.message)).toContain('format');
    });

    it('should return 400 for short password', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: { email: 'test@test.com', password: '123' }
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body) as Record<string, unknown>;
      expect(String(body.message)).toContain('6 characters');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: { email: 'test@test.com' }
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Task Validation', () => {
    it('should return 400 for missing title in creation', async () => {
      const headers = generateAuthHeaders();
      const res = await app.inject({
        method: 'POST',
        url: '/v1/tasks',
        headers,
        payload: { description: 'No title' }
      });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid UUID in task ID', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: '/v1/tasks/not-a-uuid',
        payload: { title: 'Update' }
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body) as Record<string, unknown>;
      expect(String(body.message)).toContain('format');
    });

    it('should return 400 for invalid body type (boolean instead of string)', async () => {
      const headers = generateAuthHeaders();
      const res = await app.inject({
        method: 'POST',
        url: '/v1/tasks',
        headers,
        payload: { title: { invalid: 'object' } }
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
