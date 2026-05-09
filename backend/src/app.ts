import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify from 'fastify';
import { authRoutes } from './modules/Auth/Auth.routes.js';
import { CONFIG } from './shared/config/env.js';

const app = Fastify({
  logger: true
});

await app.register(jwt, {
  secret: CONFIG.JWT_SECRET
});

await app.register(cors, {
  origin: true
});

await app.register(authRoutes, { prefix: '/auth' });

app.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
});

try {
  await app.listen({ port: CONFIG.PORT, host: '0.0.0.0' });
  console.log(`[server]: Server is running at http://localhost:${CONFIG.PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

export default app;
