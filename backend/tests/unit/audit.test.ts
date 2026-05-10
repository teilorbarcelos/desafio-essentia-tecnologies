import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.unmock('../../src/modules/Audit/Audit.repository.js');

import { AuditRepository, AuditLog } from '../../src/modules/Audit/Audit.repository.js';
import { auditHook } from '../../src/api/hooks/audit.hook.js';
import { FastifyReply, FastifyRequest } from 'fastify';

/* Mock dependencies */
vi.mock('../../src/infra/database/MongoProvider.js', () => ({
  mongoProvider: {
    getDb: vi.fn().mockReturnValue({
      collection: vi.fn().mockReturnValue({
        insertOne: vi.fn().mockResolvedValue({}),
        find: vi.fn().mockReturnValue({
          sort: vi.fn().mockReturnThis(),
          toArray: vi.fn().mockResolvedValue([])
        })
      })
    })
  }
}));

describe('Audit Module', () => {
  describe('AuditRepository', () => {
    it('should create an audit log', async () => {
      const log: AuditLog = {
        action: 'TEST',
        method: 'GET',
        path: '/test',
        payload: {},
        statusCode: 200,
        timestamp: new Date()
      };
      await AuditRepository.create(log);
      /* Se não estourar erro, passou (mock está configurado acima) */
    });

    it('should list all logs', async () => {
      const logs = await AuditRepository.listAll();
      expect(Array.isArray(logs)).toBe(true);
    });
  });

  describe('auditHook', () => {
    interface MockRequest {
      url: string;
      method: string;
      body: Record<string, unknown>;
      ip: string;
      user: { id: string; email: string };
    }

    let mockRequest: MockRequest;
    let mockReply: Partial<FastifyReply>;

    beforeEach(() => {
      mockRequest = {
        url: '/v1/tasks',
        method: 'POST',
        body: { password: 'secret', title: 'Task' },
        ip: '127.0.0.1',
        user: { id: '1', email: 'test@test.com' }
      };
      mockReply = {
        statusCode: 201
      };
      vi.clearAllMocks();
    });

    it('should skip health check', async () => {
      mockRequest.url = '/health';
      const spy = vi.spyOn(AuditRepository, 'create');
      await auditHook(mockRequest as unknown as FastifyRequest, mockReply as FastifyReply);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should skip auth routes', async () => {
      mockRequest.url = '/auth/login';
      const spy = vi.spyOn(AuditRepository, 'create');
      await auditHook(mockRequest as unknown as FastifyRequest, mockReply as FastifyReply);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should mask sensitive fields and create log', async () => {
      const spy = vi.spyOn(AuditRepository, 'create');
      await auditHook(mockRequest as unknown as FastifyRequest, mockReply as FastifyReply);
      
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        payload: expect.objectContaining({
          password: '********',
          title: 'Task'
        })
      }));
    });

    it('should handle repository errors gracefully', async () => {
      vi.spyOn(AuditRepository, 'create').mockRejectedValue(new Error('Mongo error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      
      await auditHook(mockRequest as unknown as FastifyRequest, mockReply as FastifyReply);
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to create audit log'), expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
