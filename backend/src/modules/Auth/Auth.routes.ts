import { FastifyInstance } from 'fastify';
import { AuthService } from './Auth.service.js';
import { authenticate } from '../../api/hooks/auth.hook.js';

export async function authRoutes(fastify: FastifyInstance) {
  const service = new AuthService(fastify);

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;
    try {
      const result = await service.login(email, password);
      return result;
    } catch (err: any) {
      return reply.status(401).send({ message: err.message });
    }
  });

  fastify.post('/refresh', async (request, reply) => {
    const { refreshToken } = request.body as any;
    try {
      const result = await service.refreshToken(refreshToken);
      return result;
    } catch (err: any) {
      return reply.status(401).send({ message: err.message });
    }
  });

  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user as any;
    try {
      const result = await service.getMe(user.id);
      return result;
    } catch (err: any) {
      return reply.status(404).send({ message: err.message });
    }
  });

  fastify.post('/change-password', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user as any;
    const { currentPassword, newPassword } = request.body as any;
    try {
      await service.changePassword(user.id, currentPassword, newPassword);
      return { message: 'Password changed successfully. All sessions invalidated.' };
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  });
}
