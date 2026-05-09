import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { CONFIG } from '../../shared/config/env.js';

const url = new URL(CONFIG.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port),
  user: url.username,
  password: url.password,
  database: url.pathname.replace('/', ''),
});

export const prisma = new PrismaClient({ adapter });
