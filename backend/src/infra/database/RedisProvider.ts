import { Redis } from 'ioredis';
import { CONFIG } from '../../shared/config/env.js';

export class RedisProvider {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisProvider.instance) {
      RedisProvider.instance = new Redis(CONFIG.REDIS_URL, {
        retryStrategy(times) {
          return Math.min(times * 50, 2000);
        },
        maxRetriesPerRequest: null,
      });

      RedisProvider.instance.on('error', (err) => {
        console.error('[Redis] Error:', err);
      });

      RedisProvider.instance.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });
    }

    return RedisProvider.instance;
  }
}

export const redis = RedisProvider.getInstance();
