import { describe, it, expect, vi } from 'vitest';

const { mockMongoClientInstance } = vi.hoisted(() => ({
  mockMongoClientInstance: {
    connect: vi.fn().mockResolvedValue({}),
    db: vi.fn().mockReturnValue({}),
    close: vi.fn().mockResolvedValue({}),
  }
}));

/* Unmock our providers to test their logic */
vi.unmock('../../src/infra/database/RedisProvider.js');
vi.unmock('../../src/infra/database/PrismaProvider.js');
vi.unmock('../../src/infra/database/MongoProvider.js');

/* Mock the external libraries they use */
vi.mock('ioredis', () => {
  return {
    Redis: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      quit: vi.fn(),
    })),
  };
});

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      $connect: vi.fn(),
    })),
  };
});

vi.mock('@prisma/adapter-mariadb', () => {
  return {
    PrismaMariaDb: vi.fn(),
  };
});

vi.mock('mongodb', () => {
  return {
    MongoClient: vi.fn().mockImplementation(() => mockMongoClientInstance),
  };
});

import { RedisProvider } from '../../src/infra/database/RedisProvider.js';
import { PrismaProvider } from '../../src/infra/database/PrismaProvider.js';
import { mongoProvider } from '../../src/infra/database/MongoProvider.js';

describe('Infra Providers', () => {
  it('RedisProvider should return a singleton instance', () => {
    const instance1 = RedisProvider.getInstance();
    const instance2 = RedisProvider.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('PrismaProvider should return a singleton instance', () => {
    const instance1 = PrismaProvider.getInstance();
    const instance2 = PrismaProvider.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('MongoProvider', () => {
    it('should connect and return db', async () => {
      const db = await mongoProvider.connect();
      expect(db).toBeDefined();
      
      const dbAgain = await mongoProvider.connect();
      expect(dbAgain).toBe(db);
    });

    it('should return db if connected', () => {
      const db = mongoProvider.getDb();
      expect(db).toBeDefined();
    });

    it('should disconnect', async () => {
      await mongoProvider.disconnect();
      expect(() => mongoProvider.getDb()).toThrow('Mongo database not initialized');
    });

    it('should throw if getting db before connecting', async () => {
      expect(() => mongoProvider.getDb()).toThrow();
    });

    it('should handle connection errors', async () => {
      mockMongoClientInstance.connect.mockRejectedValueOnce(new Error('Connection failed'));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      
      await mongoProvider.disconnect();
      await expect(mongoProvider.connect()).rejects.toThrow('Connection failed');
      expect(consoleSpy).toHaveBeenCalledWith('[mongodb]: Connection error', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});
