import dotenv from 'dotenv';

dotenv.config();

/* v8 ignore start */
export const CONFIG = {
  PORT: Number(process.env.PORT) || 3333,
  HOST: process.env.HOST ?? '0.0.0.0',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
  FIRST_USER_EMAIL: process.env.FIRST_USER_EMAIL ?? 'admin@admin.com',
  FIRST_USER_PASSWORD: process.env.FIRST_USER_PASSWORD ?? 'admin123',
  MONGO_URL: process.env.MONGO_URL ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development'
};
/* v8 ignore stop */
