import { PrismaProvider } from '../../infra/database/PrismaProvider.js';

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

  async findByUserId(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
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
