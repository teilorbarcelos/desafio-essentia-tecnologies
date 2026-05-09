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

export class TaskRepository {
  private static prisma = PrismaProvider.getInstance();

  static async create(data: CreateTaskData) {
    return this.prisma.task.create({
      data
    });
  }

  static async findByUserId(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(id: string) {
    return this.prisma.task.findUnique({
      where: { id }
    });
  }

  static async update(id: string, data: UpdateTaskData) {
    return this.prisma.task.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    return this.prisma.task.delete({
      where: { id }
    });
  }
}
