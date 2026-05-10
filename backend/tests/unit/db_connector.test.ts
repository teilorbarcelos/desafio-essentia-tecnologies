import { describe, it, expect, vi, beforeEach } from 'vitest';
import { connectWithRetry } from '../../src/infra/database/DbConnector.js';
import { mongoProvider } from '../../src/infra/database/MongoProvider.js';
import { PrismaProvider } from '../../src/infra/database/PrismaProvider.js';

vi.mock('../../src/infra/database/MongoProvider.js', () => ({
  mongoProvider: {
    connect: vi.fn()
  }
}));

vi.mock('../../src/infra/database/PrismaProvider.js', () => ({
  PrismaProvider: {
    getInstance: vi.fn(() => ({
      $connect: vi.fn()
    }))
  }
}));

describe('DbConnector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should connect successfully on first attempt', async () => {
    await connectWithRetry(3, 10);
    expect(mongoProvider.connect).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('[database]: All databases connected successfully');
  });

  it('should retry if connection fails and eventually succeed', async () => {
    const mockPrisma = { $connect: vi.fn() };
    vi.mocked(PrismaProvider.getInstance).mockReturnValue(mockPrisma as any);
    
    mockPrisma.$connect
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockResolvedValueOnce(undefined);

    await connectWithRetry(3, 10);
    expect(mockPrisma.$connect).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalled();
  });

  it('should throw error after max retries', async () => {
    vi.mocked(mongoProvider.connect).mockRejectedValue(new Error('Always fails'));

    await expect(connectWithRetry(2, 10)).rejects.toThrow('Max retries reached');
    expect(mongoProvider.connect).toHaveBeenCalledTimes(2);
  });
});
