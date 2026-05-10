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

  async findByUserId(userId: string) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id }
    });
  },

  async update(id: string, data: UpdateTaskData) {
    return prisma.task.update({
      where: { id },
      data
    });
  },

  async delete(id: string) {
    return prisma.task.delete({
      where: { id }
    });
  }
};
