import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

import { CONFIG } from '../src/shared/config/env.js';

const url = new URL(CONFIG.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port),
  user: url.username,
  password: url.password,
  database: url.pathname.replace('/', ''),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash(CONFIG.FIRST_USER.PASSWORD, 12);
  
  const user = await prisma.user.upsert({
    where: { email: CONFIG.FIRST_USER.EMAIL },
    update: {},
    create: {
      email: CONFIG.FIRST_USER.EMAIL,
      name: 'Admin',
      password: password,
    },
  });

  console.log('Seed user created:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
