import { PrismaProvider } from '../../infra/database/PrismaProvider.js';
import { CONFIG } from '../../shared/config/env.js';

export interface CreateTaskData {
  title: string;
  description?: string;
  userId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

const prisma = PrismaProvider.getInstance();

export const TaskRepository = {
  async create(data: CreateTaskData) {
    return prisma.task.create({
      data
    });
  },

  async findByUserId(userId: string, page = 1, limit = 25) {
    const safeLimit = Math.min(limit, CONFIG.MAX_PAGE_SIZE);
    const skip = (page - 1) * safeLimit;
    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit
      }),
      prisma.task.count({ where: { userId } })
    ]);

    return {
      items,
      total,
      page,
      size: items.length
    };
  },

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id }
    });
  },

  async update(id: string, userId: string, data: UpdateTaskData) {
    return prisma.task.update({
      where: { 
        id_userId: { id, userId }
      },
      data
    });
  },

  async delete(id: string, userId: string) {
    return prisma.task.delete({
      where: { 
        id_userId: { id, userId }
      }
    });
  }
};
