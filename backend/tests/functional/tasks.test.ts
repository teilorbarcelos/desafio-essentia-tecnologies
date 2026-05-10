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

  const generateAuthHeaders = (userId = '00000000-0000-0000-0000-000000000001') => {
    const token = app.jwt.sign({ id: userId, email: 'test@test.com' });
    mockRedis.get.mockResolvedValue(JSON.stringify({ id: userId }));
    return { authorization: `Bearer ${token}` };
  };

  describe('POST /tasks', () => {
    it('should create a task and log audit', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.create.mockResolvedValue({ 
        id: '11111111-1111-1111-1111-111111111111', 
        title: 'Test', 
        userId: '00000000-0000-0000-0000-000000000001',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const auditSpy = vi.spyOn(AuditRepository, 'create');

      const res = await app.inject({
        method: 'POST',
        url: '/v1/tasks',
        headers,
        payload: { title: 'Test' }
      });

      expect(res.statusCode).toBe(201);
      expect(auditSpy).toHaveBeenCalled();
    });

    it('should return 400 if title missing', async () => {
      const headers = generateAuthHeaders();
      const res = await app.inject({ method: 'POST', url: '/v1/tasks', headers, payload: {} });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    it('should list user tasks', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findMany.mockResolvedValue([{ 
        id: '11111111-1111-1111-1111-111111111111', 
        title: 'T1',
        userId: '00000000-0000-0000-0000-000000000001',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
      const res = await app.inject({ method: 'GET', url: '/v1/tasks', headers });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toHaveLength(1);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update successfully', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findUnique.mockResolvedValue({ 
        id: '11111111-1111-1111-1111-111111111111', 
        userId: '00000000-0000-0000-0000-000000000001' 
      });
      mockPrisma.task.update.mockResolvedValue({ 
        id: '11111111-1111-1111-1111-111111111111', 
        title: 'Updated',
        userId: '00000000-0000-0000-0000-000000000001',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const res = await app.inject({
        method: 'PATCH',
        url: '/v1/tasks/11111111-1111-1111-1111-111111111111',
        headers,
        payload: { title: 'Updated' }
      });
      expect(res.statusCode).toBe(200);
    });

    it('should return 403 if not owner', async () => {
      const headers = generateAuthHeaders('00000000-0000-0000-0000-000000000001');
      mockPrisma.task.findUnique.mockResolvedValue({ 
        id: '11111111-1111-1111-1111-111111111111', 
        userId: '00000000-0000-0000-0000-000000000002' 
      });

      const res = await app.inject({
        method: 'PATCH',
        url: '/v1/tasks/11111111-1111-1111-1111-111111111111',
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
        url: '/v1/tasks/99999999-9999-9999-9999-999999999999',
        headers,
        payload: { title: 'Ghost' }
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete successfully', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findUnique.mockResolvedValue({ 
        id: '11111111-1111-1111-1111-111111111111', 
        userId: '00000000-0000-0000-0000-000000000001' 
      });
      mockPrisma.task.delete.mockResolvedValue({ id: '11111111-1111-1111-1111-111111111111' });

      const res = await app.inject({ method: 'DELETE', url: '/v1/tasks/11111111-1111-1111-1111-111111111111', headers });
      expect(res.statusCode).toBe(204);
    });

    it('should return 403 if not owner', async () => {
      const headers = generateAuthHeaders('00000000-0000-0000-0000-000000000001');
      mockPrisma.task.findUnique.mockResolvedValue({ 
        id: '11111111-1111-1111-1111-111111111111', 
        userId: '00000000-0000-0000-0000-000000000002' 
      });

      const res = await app.inject({ method: 'DELETE', url: '/v1/tasks/11111111-1111-1111-1111-111111111111', headers });
      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if not found', async () => {
      const headers = generateAuthHeaders();
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const res = await app.inject({ method: 'DELETE', url: '/v1/tasks/99999999-9999-9999-9999-999999999999', headers });
      expect(res.statusCode).toBe(404);
    });
  });
});
