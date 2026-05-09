import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { buildApp } from '../../src/app.js';
import { mockPrisma, mockRedis } from '../setup.js';
import { AuditRepository } from '../../src/modules/Audit/Audit.repository.js';

describe('Task Functional Tests', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const generateAuthHeaders = (userId = 'user-1') => {
    const token = app.jwt.sign({ id: userId, email: 'test@test.com' });
    mockRedis.get.mockResolvedValue(JSON.stringify({ id: userId }));
    return { authorization: `Bearer ${token}` };
  };

  describe('POST /tasks', () => {
    it('should create a task and log audit', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.create.mockResolvedValue({ id: 't1', title: 'Test', userId: 'user-1' });

      const res = await app.inject({
        method: 'POST',
        url: '/tasks',
        headers,
        payload: { title: 'Test' }
      });

      expect(res.statusCode).toBe(201);
      expect(AuditRepository.create).toHaveBeenCalled();
    });

    it('should return 400 if title missing', async () => {
      const headers = generateAuthHeaders();
      const res = await app.inject({ method: 'POST', url: '/tasks', headers, payload: {} });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    it('should list user tasks', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findMany.mockResolvedValue([{ id: 't1', title: 'T1' }]);
      const res = await app.inject({ method: 'GET', url: '/tasks', headers });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toHaveLength(1);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update successfully', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1', userId: 'user-1' });
      mockPrisma.task.update.mockResolvedValue({ id: 't1', title: 'Updated' });

      const res = await app.inject({
        method: 'PATCH',
        url: '/tasks/t1',
        headers,
        payload: { title: 'Updated' }
      });
      expect(res.statusCode).toBe(200);
    });

    it('should return 403 if not owner', async () => {
      const headers = generateAuthHeaders('user-1');
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1', userId: 'other' });

      const res = await app.inject({
        method: 'PATCH',
        url: '/tasks/t1',
        headers,
        payload: { title: 'Steal' }
      });
      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if not found', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const res = await app.inject({
        method: 'PATCH',
        url: '/tasks/t999',
        headers,
        payload: { title: 'Ghost' }
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete successfully', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1', userId: 'user-1' });
      mockPrisma.task.delete.mockResolvedValue({ id: 't1' });

      const res = await app.inject({ method: 'DELETE', url: '/tasks/t1', headers });
      expect(res.statusCode).toBe(204);
    });

    it('should return 403 if not owner', async () => {
      const headers = generateAuthHeaders('user-1');
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1', userId: 'other' });

      const res = await app.inject({ method: 'DELETE', url: '/tasks/t1', headers });
      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if not found', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const res = await app.inject({ method: 'DELETE', url: '/tasks/t999', headers });
      expect(res.statusCode).toBe(404);
    });
  });
});
