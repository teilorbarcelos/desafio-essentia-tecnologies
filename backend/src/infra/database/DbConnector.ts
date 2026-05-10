import { mongoProvider } from './MongoProvider.js';
import { PrismaProvider } from './PrismaProvider.js';

export async function connectWithRetry(maxRetries = 10, intervalMs = 3000): Promise<void> {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoProvider.connect();
      
      const prisma = PrismaProvider.getInstance();
      await prisma.$connect();
      
      console.log('[database]: All databases connected successfully');
      return;
    } catch (err) {
      retries++;
      console.error(`[database]: Connection failed (attempt ${String(retries)}/${String(maxRetries)}). Retrying in ${String(intervalMs / 1000)}s...`);
      
      if (retries >= maxRetries) {
        throw new Error('Max retries reached. Could not connect to databases.');
      }
      
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
}
