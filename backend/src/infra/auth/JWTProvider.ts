import { FastifyInstance } from 'fastify';

export interface AuthPayload {
  id: string;
  email: string;
}

export class JWTProvider {
  constructor(private fastify: FastifyInstance) {}

  async generateTokenPair(payload: AuthPayload) {
    const token = this.fastify.jwt.sign(payload, { expiresIn: '24h' });
    const refreshToken = this.fastify.jwt.sign(payload, { expiresIn: '7d' });

    return { token, refreshToken };
  }

  async verifyToken(token: string): Promise<AuthPayload> {
    return this.fastify.jwt.verify<AuthPayload>(token);
  }
}
