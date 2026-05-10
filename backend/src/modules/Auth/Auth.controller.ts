import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthPayload } from '../../infra/auth/JWTProvider.js';
import { ChangePasswordDTO, LoginDTO, RefreshDTO } from './Auth.schema.js';
import { AuthService } from './Auth.service.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(request: FastifyRequest<{ Body: LoginDTO }>, reply: FastifyReply) {
    const { email, password } = request.body;
    try {
      const result = await this.authService.login(email, password);
      return reply.status(200).send(result);
    } catch (err) {
      const error = err as Error;
      return reply.status(401).send({ message: error.message });
    }
  }

  async refresh(request: FastifyRequest<{ Body: RefreshDTO }>, reply: FastifyReply) {
    const { refreshToken } = request.body;
    try {
      const result = await this.authService.refreshToken(refreshToken);
      return reply.status(200).send(result);
    } catch (err) {
      const error = err as Error;
      return reply.status(401).send({ message: error.message });
    }
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.user as AuthPayload;
    try {
      const result = await this.authService.getMe(id);
      return reply.status(200).send(result);
    } catch (err) {
      const error = err as Error;
      return reply.status(404).send({ message: error.message });
    }
  }

  async changePassword(request: FastifyRequest<{ Body: ChangePasswordDTO }>, reply: FastifyReply) {
    const { id } = request.user as AuthPayload;
    const { currentPassword, newPassword } = request.body;

    try {
      await this.authService.changePassword(id, currentPassword, newPassword);
      return reply.status(200).send({ message: 'Password changed successfully' });
    } catch (err) {
      const error = err as Error;
      return reply.status(400).send({ message: error.message });
    }
  }
}
