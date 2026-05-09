import { FastifyInstance } from 'fastify';
import { authenticate } from '../../api/hooks/auth.hook.js';
import { AuthPayload } from '../../infra/auth/JWTProvider.js';
import { ChangePasswordDto, LoginDto, RefreshDto } from './Auth.dto.js';
import { AuthService } from './Auth.service.js';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);

  fastify.post<{ Body: LoginDto }>('/login', async (request, reply) => {
    const { email, password } = request.body;
    try {
      return await authService.login(email, password);
    } catch (err) {
      const error = err as Error;
      return reply.status(401).send({ message: error.message });
    }
  });

  fastify.post<{ Body: RefreshDto }>('/refresh', async (request, reply) => {
    const { refreshToken } = request.body;
    try {
      return await authService.refreshToken(refreshToken);
    } catch (err) {
      const error = err as Error;
      return reply.status(401).send({ message: error.message });
    }
  });

  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.user as AuthPayload;
      return await authService.getMe(id);
    } catch (err) {
      const error = err as Error;
      return reply.status(404).send({ message: error.message });
    }
  });

  fastify.post<{ Body: ChangePasswordDto }>('/change-password', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.user as AuthPayload;
    const { currentPassword, newPassword } = request.body;

    try {
      await authService.changePassword(id, currentPassword, newPassword);
      return { message: 'Password changed successfully' };
    } catch (err) {
      const error = err as Error;
      return reply.status(400).send({ message: error.message });
    }
  });
}
