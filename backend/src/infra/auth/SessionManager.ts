import crypto from 'node:crypto';
import { redis } from '../database/RedisProvider.js';
import { AuthPayload } from './JWTProvider.js';

const PREFIX = 'session:user:';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export const SessionManager = {
  async createSession(userId: string, token: string, refreshToken: string, payload: AuthPayload) {
    const tokenHash = hashToken(token);
    const refreshTokenHash = hashToken(refreshToken);

    const accessKey = `${PREFIX}${userId}:access:${tokenHash}`;
    const refreshKey = `${PREFIX}${userId}:refresh:${refreshTokenHash}`;

    await redis.set(accessKey, JSON.stringify(payload), 'EX', 24 * 60 * 60);
    await redis.set(refreshKey, '1', 'EX', 7 * 24 * 60 * 60);
  },

  async validateSession(userId: string, token: string): Promise<boolean> {
    const tokenHash = hashToken(token);
    const key = `${PREFIX}${userId}:access:${tokenHash}`;
    const session = await redis.get(key);
    return !!session;
  },

  async validateRefreshSession(userId: string, refreshToken: string): Promise<boolean> {
    const refreshTokenHash = hashToken(refreshToken);
    const key = `${PREFIX}${userId}:refresh:${refreshTokenHash}`;
    const session = await redis.get(key);
    return !!session;
  },

  async invalidateRefreshSession(userId: string, refreshToken: string) {
    const refreshTokenHash = hashToken(refreshToken);
    const key = `${PREFIX}${userId}:refresh:${refreshTokenHash}`;
    await redis.del(key);
  },

  async invalidateAllUserSessions(userId: string) {
    const pattern = `${PREFIX}${userId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
};
