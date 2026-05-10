import { TaskRepository, CreateTaskData, UpdateTaskData } from './Task.repository.js';

export const TaskService = {
  async createTask(data: CreateTaskData) {
    return TaskRepository.create(data);
  },

  async listUserTasks(userId: string) {
    return TaskRepository.findByUserId(userId);
  },

  async updateTask(id: string, userId: string, data: UpdateTaskData) {
    const task = await TaskRepository.findById(id);
    
    if (!task) throw new Error('Task not found');
    if (task.userId !== userId) throw new Error('Unauthorized');

    return TaskRepository.update(id, data);
  },

  async deleteTask(id: string, userId: string) {
    const task = await TaskRepository.findById(id);
    
    if (!task) throw new Error('Task not found');
    if (task.userId !== userId) throw new Error('Unauthorized');

    return TaskRepository.delete(id);
  }
};
