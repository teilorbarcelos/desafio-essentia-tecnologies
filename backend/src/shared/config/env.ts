import 'dotenv/config';

export const CONFIG = {
  PORT: Number(process.env.PORT) || 8888,
  DATABASE_URL: process.env.DATABASE_URL!,
  MONGO_URL: process.env.MONGO_URL!,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key',
  FIRST_USER: {
    EMAIL: process.env.FIRST_USER_EMAIL || 'admin@email.com',
    PASSWORD: process.env.FIRST_USER_PASSWORD || 'admin123',
  }
} as const;
