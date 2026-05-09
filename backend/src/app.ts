import cors from '@fastify/cors';
import 'dotenv/config';
import Fastify from 'fastify';

const app = Fastify({
  logger: true
});

const PORT = Number(process.env.PORT) || 8888;

await app.register(cors, {
  origin: true
});

app.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
});

try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

export default app;
