import crypto from 'node:crypto';
import { redis } from '../database/RedisProvider.js';
import { AuthPayload } from './JWTProvider.js';

export class SessionManager {
  private static PREFIX = 'session:user:';

  static async createSession(userId: string, token: string, refreshToken: string, payload: AuthPayload) {
    const tokenHash = this.hashToken(token);
    const refreshTokenHash = this.hashToken(refreshToken);

    const accessKey = `${this.PREFIX}${userId}:access:${tokenHash}`;
    const refreshKey = `${this.PREFIX}${userId}:refresh:${refreshTokenHash}`;

    await redis.set(accessKey, JSON.stringify(payload), 'EX', 24 * 60 * 60);
    await redis.set(refreshKey, '1', 'EX', 7 * 24 * 60 * 60);
  }

  static async validateSession(userId: string, token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);
    const key = `${this.PREFIX}${userId}:access:${tokenHash}`;
    const session = await redis.get(key);
    return !!session;
  }

  static async validateRefreshSession(userId: string, refreshToken: string): Promise<boolean> {
    const refreshTokenHash = this.hashToken(refreshToken);
    const key = `${this.PREFIX}${userId}:refresh:${refreshTokenHash}`;
    const session = await redis.get(key);
    return !!session;
  }

  static async invalidateRefreshSession(userId: string, refreshToken: string) {
    const refreshTokenHash = this.hashToken(refreshToken);
    const key = `${this.PREFIX}${userId}:refresh:${refreshTokenHash}`;
    await redis.del(key);
  }

  static async invalidateAllUserSessions(userId: string) {
    const pattern = `${this.PREFIX}${userId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  private static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
