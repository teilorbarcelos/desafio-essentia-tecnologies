import { vi } from 'vitest';

/* Mock Redis */
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  keys: vi.fn().mockResolvedValue([]),
  on: vi.fn(),
  connect: vi.fn(),
};

vi.mock('ioredis', () => ({
  Redis: vi.fn().mockImplementation(() => mockRedis),
  default: vi.fn().mockImplementation(() => mockRedis),
}));

/* Mock Prisma */
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  task: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

vi.mock('../src/infra/database/PrismaProvider.js', () => ({
  PrismaProvider: {
    getInstance: () => mockPrisma
  },
  prisma: mockPrisma /* Exportação nomeada mockada */
}));

vi.mock('../src/infra/database/RedisProvider.js', () => ({
  redis: mockRedis,
}));

/* Mock Mongo */
const mockMongoDb = {
  collection: vi.fn().mockReturnThis(),
  insertOne: vi.fn().mockResolvedValue({}),
  find: vi.fn().mockReturnThis(),
  sort: vi.fn().mockReturnThis(),
  toArray: vi.fn().mockResolvedValue([]),
};

vi.mock('../src/infra/database/MongoProvider.js', () => ({
  mongoProvider: {
    connect: vi.fn().mockResolvedValue(mockMongoDb),
    getDb: vi.fn().mockReturnValue(mockMongoDb),
    disconnect: vi.fn(),
  }
}));

/* Mock Audit */
vi.mock('../src/modules/Audit/Audit.repository.js', () => ({
  AuditRepository: {
    create: vi.fn().mockResolvedValue({}),
    listAll: vi.fn().mockResolvedValue([]),
  }
}));

export { mockPrisma, mockRedis, mockMongoDb };
