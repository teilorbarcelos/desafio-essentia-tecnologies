import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';
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
  const password = await bcrypt.hash(CONFIG.FIRST_USER_PASSWORD, 12);
  
  const user = await prisma.user.upsert({
    where: { email: CONFIG.FIRST_USER_EMAIL },
    update: {},
    create: {
      email: CONFIG.FIRST_USER_EMAIL,
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
