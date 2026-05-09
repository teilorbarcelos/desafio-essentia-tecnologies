import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify from 'fastify';
import { auditHook } from './api/hooks/audit.hook.js';
import { mongoProvider } from './infra/database/MongoProvider.js';
import { authRoutes } from './modules/Auth/Auth.routes.js';
import { taskRoutes } from './modules/Task/Task.routes.js';
import { CONFIG } from './shared/config/env.js';

export function buildApp() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test'
  });

  app.register(jwt, {
    secret: CONFIG.JWT_SECRET
  });

  app.register(cors, {
    origin: true
  });

  app.addHook('onResponse', auditHook);

  app.register(authRoutes, { prefix: '/auth' });
  app.register(taskRoutes, { prefix: '/tasks' });

  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });

  return app;
}

/* v8 ignore start */
export async function start() {
  const app = buildApp();
  try {
    await mongoProvider.connect();
    await app.listen({ port: CONFIG.PORT, host: '0.0.0.0' });
    console.log(`[server]: Server is running at http://localhost:${CONFIG.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}
/* v8 ignore stop */

export default buildApp;
