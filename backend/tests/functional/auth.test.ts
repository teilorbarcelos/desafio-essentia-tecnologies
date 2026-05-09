import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { buildApp } from '../../src/app.js';
import { mockPrisma, mockRedis } from '../setup.js';
import bcrypt from 'bcrypt';

describe('Auth Functional Tests', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Infrastructure', () => {
    it('should return 200 ok on health check', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('2. Login Flow', () => {
    it('should login successfully with valid credentials', async () => {
      const hashed = await bcrypt.hash('pass123', 12);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'test@test.com', password: hashed, name: 'User' });
      mockRedis.set.mockResolvedValue('OK');
      const res = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: 'test@test.com', password: 'pass123' }});
      expect(res.statusCode).toBe(200);
    });

    it('should return 401 if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const res = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: 'w@a.com', password: 'any' }});
      expect(res.statusCode).toBe(401);
    });

    it('should return 401 for wrong password', async () => {
      const hashed = await bcrypt.hash('correct', 12);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', password: hashed });
      const res = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: 't@t.com', password: 'wrong' }});
      expect(res.statusCode).toBe(401);
    });
  });

  describe('3. Profile (Me) Flow', () => {
    it('should get profile info successfully', async () => {
      const token = app.jwt.sign({ id: 'u1' });
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 'u1' }));
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 't@t.com' });
      const res = await app.inject({ method: 'GET', url: '/auth/me', headers: { authorization: `Bearer ${token}` }});
      expect(res.statusCode).toBe(200);
    });

    it('should return 401 if JWT is malformed (Hook Catch)', async () => {
      const res = await app.inject({ method: 'GET', url: '/auth/me', headers: { authorization: 'Bearer invalid-token' }});
      expect(res.statusCode).toBe(401);
    });

    it('should return 401 if session is missing in Redis', async () => {
      const token = app.jwt.sign({ id: 'u1' });
      mockRedis.get.mockResolvedValue(null);
      const res = await app.inject({ method: 'GET', url: '/auth/me', headers: { authorization: `Bearer ${token}` }});
      expect(res.statusCode).toBe(401);
    });

    it('should return 404 if user profile is not found in DB', async () => {
      const token = app.jwt.sign({ id: 'u1' });
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 'u1' }));
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const res = await app.inject({ method: 'GET', url: '/auth/me', headers: { authorization: `Bearer ${token}` }});
      expect(res.statusCode).toBe(404);
    });
  });

  describe('4. Token & Session Management', () => {
    it('should refresh tokens successfully', async () => {
      const rt = app.jwt.sign({ id: 'u1' });
      mockRedis.get.mockResolvedValue('1');
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@a.com' });
      const res = await app.inject({ method: 'POST', url: '/auth/refresh', payload: { refreshToken: rt }});
      expect(res.statusCode).toBe(200);
    });

    it('should return 401 if refresh token session is missing in Redis (Branch coverage line 52)', async () => {
      const rt = app.jwt.sign({ id: 'u1' });
      mockRedis.get.mockResolvedValue(null);
      const res = await app.inject({ method: 'POST', url: '/auth/refresh', payload: { refreshToken: rt }});
      expect(res.statusCode).toBe(401);
    });

    it('should return 401 if user not found during refresh', async () => {
      const rt = app.jwt.sign({ id: 'ghost' });
      mockRedis.get.mockResolvedValue('1');
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const res = await app.inject({ method: 'POST', url: '/auth/refresh', payload: { refreshToken: rt }});
      expect(res.statusCode).toBe(401);
    });

    it('should change password successfully (With sessions)', async () => {
      const token = app.jwt.sign({ id: 'u1' });
      const hashed = await bcrypt.hash('old', 12);
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 'u1' }));
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', password: hashed });
      mockRedis.keys.mockResolvedValue(['sess1']);
      const res = await app.inject({
        method: 'POST',
        url: '/auth/change-password',
        headers: { authorization: `Bearer ${token}` },
        payload: { currentPassword: 'old', newPassword: 'new' }
      });
      expect(res.statusCode).toBe(200);
    });

    it('should change password successfully (No sessions)', async () => {
      const token = app.jwt.sign({ id: 'u1' });
      const hashed = await bcrypt.hash('old', 12);
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 'u1' }));
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', password: hashed });
      mockRedis.keys.mockResolvedValue([]);
      const res = await app.inject({
        method: 'POST',
        url: '/auth/change-password',
        headers: { authorization: `Bearer ${token}` },
        payload: { currentPassword: 'old', newPassword: 'new' }
      });
      expect(res.statusCode).toBe(200);
    });

    it('should return 400 if user not found during password change', async () => {
      const token = app.jwt.sign({ id: 'u1' });
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 'u1' }));
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const res = await app.inject({
        method: 'POST',
        url: '/auth/change-password',
        headers: { authorization: `Bearer ${token}` },
        payload: { currentPassword: 'any', newPassword: 'new' }
      });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for incorrect current password', async () => {
      const token = app.jwt.sign({ id: 'u1' });
      const hashed = await bcrypt.hash('old', 12);
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 'u1' }));
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', password: hashed });
      const res = await app.inject({
        method: 'POST',
        url: '/auth/change-password',
        headers: { authorization: `Bearer ${token}` },
        payload: { currentPassword: 'wrong', newPassword: 'new' }
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
