import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthPayload } from '../../infra/auth/JWTProvider.js';
import { CreateTaskDTO, TaskParamsDTO, UpdateTaskDTO } from './Task.schema.js';
import { TaskService } from './Task.service.js';

export class TaskController {
  async listUserTasks(request: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = request.user as AuthPayload;
    const tasks = await TaskService.listUserTasks(userId);
    return reply.status(200).send(tasks);
  }

  async createTask(request: FastifyRequest<{ Body: CreateTaskDTO }>, reply: FastifyReply) {
    const { id: userId } = request.user as AuthPayload;
    const data = request.body;
    
    const task = await TaskService.createTask({ ...data, userId });
    return reply.status(201).send(task);
  }

  async updateTask(request: FastifyRequest<{ Params: TaskParamsDTO; Body: UpdateTaskDTO }>, reply: FastifyReply) {
    const { id: userId } = request.user as AuthPayload;
    const { id } = request.params;
    const data = request.body;

    try {
      const task = await TaskService.updateTask(id, userId, data);
      return reply.status(200).send(task);
    } catch (err) {
      const error = err as Error;
      const status = error.message === 'Unauthorized' ? 403 : 404;
      return reply.status(status).send({ message: error.message });
    }
  }

  async deleteTask(request: FastifyRequest<{ Params: TaskParamsDTO }>, reply: FastifyReply) {
    const { id: userId } = request.user as AuthPayload;
    const { id } = request.params;

    try {
      await TaskService.deleteTask(id, userId);
      return reply.status(204).send();
    } catch (err) {
      const error = err as Error;
      const status = error.message === 'Unauthorized' ? 403 : 404;
      return reply.status(status).send({ message: error.message });
    }
  }
}
