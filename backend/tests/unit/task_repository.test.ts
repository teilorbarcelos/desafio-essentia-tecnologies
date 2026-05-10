import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskRepository } from '../../src/modules/Task/Task.repository.js';
import { mockPrisma } from '../setup.js';

describe('TaskRepository Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find a task by id', async () => {
    const mockTask = { id: '1', title: 'Test' };
    mockPrisma.task.findUnique.mockResolvedValue(mockTask);

    const result = await TaskRepository.findById('1');
    expect(result).toEqual(mockTask);
    expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
