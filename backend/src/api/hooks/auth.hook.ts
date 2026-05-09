import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthPayload } from '../../infra/auth/JWTProvider.js';
import { SessionManager } from '../../infra/auth/SessionManager.js';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    
    const user = request.user as AuthPayload;
    const token = request.headers.authorization!.replace('Bearer ', '');

    const isValid = await SessionManager.validateSession(user.id, token);
    if (!isValid) {
      return reply.status(401).send({ message: 'Session invalid or expired' });
    }
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
}
