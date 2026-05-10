import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthPayload } from '../../infra/auth/JWTProvider.js';
import { CreateTaskDTO, PaginationQueryDTO, TaskParamsDTO, UpdateTaskDTO } from './Task.schema.js';
import { TaskService } from './Task.service.js';

export class TaskController {
  async listUserTasks(request: FastifyRequest<{ Querystring: PaginationQueryDTO }>, reply: FastifyReply) {
    const { id: userId } = request.user as AuthPayload;
    const { page, limit } = request.query;
    const result = await TaskService.listUserTasks(userId, page, limit);
    return reply.status(200).send(result);
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

    const task = await TaskService.updateTask(id, userId, data);
    return reply.status(200).send(task);
  }

  async deleteTask(request: FastifyRequest<{ Params: TaskParamsDTO }>, reply: FastifyReply) {
    const { id: userId } = request.user as AuthPayload;
    const { id } = request.params;

    await TaskService.deleteTask(id, userId);
    return reply.status(204).send();
  }
}
