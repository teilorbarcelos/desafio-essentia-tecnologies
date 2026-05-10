import { TaskRepository, CreateTaskData, UpdateTaskData } from './Task.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export const TaskService = {
  async createTask(data: CreateTaskData) {
    return TaskRepository.create(data);
  },

  async listUserTasks(userId: string, page?: number, limit?: number) {
    return TaskRepository.findByUserId(userId, page, limit);
  },

  async updateTask(id: string, userId: string, data: UpdateTaskData) {
    try {
      return await TaskRepository.update(id, userId, data);
    } catch (err) {
      throw new NotFoundError('Task not found or unauthorized');
    }
  },

  async deleteTask(id: string, userId: string) {
    try {
      await TaskRepository.delete(id, userId);
    } catch (err) {
      throw new NotFoundError('Task not found or unauthorized');
    }
  }
};
