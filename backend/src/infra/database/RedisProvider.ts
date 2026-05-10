import { Redis } from 'ioredis';
import { CONFIG } from '../../shared/config/env.js';

let redisInstance: Redis | null = null;

export const RedisProvider = {
  getInstance(): Redis {
    redisInstance ??= new Redis(CONFIG.REDIS_URL, {
      maxRetriesPerRequest: null,
    });

    return redisInstance;
  }
};

export const redis = RedisProvider.getInstance();
