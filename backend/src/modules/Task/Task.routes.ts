import { FastifyInstance } from 'fastify';
import { authenticate } from '../../api/hooks/auth.hook.js';
import { AuthPayload } from '../../infra/auth/JWTProvider.js';
import { CreateTaskDto, TaskParamsDto, UpdateTaskDto } from './Task.dto.js';
import { TaskService } from './Task.service.js';

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.post<{ Body: CreateTaskDto }>('/', async (request, reply) => {
    const { id: userId } = request.user as AuthPayload;
    const { title, description } = request.body;

    try {
      const task = await TaskService.createTask({ title, description, userId });
      return reply.status(201).send(task);
    } catch (err) {
      const error = err as Error;
      return reply.status(400).send({ message: error.message });
    }
  });

  fastify.get('/', async (request) => {
    const { id: userId } = request.user as AuthPayload;
    return await TaskService.listUserTasks(userId);
  });

  fastify.patch<{ Params: TaskParamsDto; Body: UpdateTaskDto }>('/:id', async (request, reply) => {
    const { id: userId } = request.user as AuthPayload;
    const { id } = request.params;
    const data = request.body;

    try {
      const task = await TaskService.updateTask(id, userId, data);
      return task;
    } catch (err) {
      const error = err as Error;
      const status = error.message === 'Unauthorized' ? 403 : 404;
      return reply.status(status).send({ message: error.message });
    }
  });

  fastify.delete<{ Params: TaskParamsDto }>('/:id', async (request, reply) => {
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
  });
}
