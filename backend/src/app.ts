import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify from 'fastify';
import { auditHook } from './api/hooks/audit.hook.js';
import { connectWithRetry } from './infra/database/DbConnector.js';
import { authRoutes } from './modules/Auth/Auth.routes.js';
import { taskRoutes } from './modules/Task/Task.routes.js';
import { CONFIG } from './shared/config/env.js';
import { errorHandler } from './api/hooks/error.handler.js';

export function buildApp() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test'
  });

  app.setErrorHandler(errorHandler);

  app.register(jwt, {
    secret: CONFIG.JWT_SECRET
  });

  app.register(cors, {
    origin: true
  });

  app.register(import('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'techx To-Do List API',
        description: 'API for managing tasks and user authentication',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/v1/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });

  app.addHook('onResponse', auditHook);

  app.register((v1, _opts, done) => {
    v1.register(authRoutes, { prefix: '/auth' });
    v1.register(taskRoutes, { prefix: '/tasks' });

    v1.get('/health', (_request, reply) => {
      return reply.send({
        status: 'ok',
        timestamp: new Date().toISOString(),
      });
    });

    done();
  }, { prefix: '/v1' });

  return app;
}

/* v8 ignore start */
export async function start() {
  const app = buildApp();

  try {
    await connectWithRetry();
    const address = await app.listen({ 
      port: CONFIG.PORT, 
      host: CONFIG.HOST 
    });
    console.log(`[server]: Server is running at ${address}`);
    console.log('[server]: Available routes:');
    console.log(app.printRoutes());
  } catch (err) {
    app.log.error(err as Error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}
/* v8 ignore stop */

export default buildApp;
