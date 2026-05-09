import { TaskRepository, CreateTaskData, UpdateTaskData } from './Task.repository.js';

export class TaskService {
  static async createTask(data: CreateTaskData) {
    if (!data.title) throw new Error('Title is required');
    return TaskRepository.create(data);
  }

  static async listUserTasks(userId: string) {
    return TaskRepository.findByUserId(userId);
  }

  static async updateTask(id: string, userId: string, data: UpdateTaskData) {
    const task = await TaskRepository.findById(id);
    
    if (!task) throw new Error('Task not found');
    if (task.userId !== userId) throw new Error('Unauthorized');

    return TaskRepository.update(id, data);
  }

  static async deleteTask(id: string, userId: string) {
    const task = await TaskRepository.findById(id);
    
    if (!task) throw new Error('Task not found');
    if (task.userId !== userId) throw new Error('Unauthorized');

    return TaskRepository.delete(id);
  }
}
