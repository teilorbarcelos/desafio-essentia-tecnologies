import { FastifyInstance } from 'fastify';
import { TaskController } from './Task.controller.js';
import { 
  registerGetRoute, 
  registerPostRoute, 
  registerPatchRoute, 
  registerDeleteRoute 
} from '../../core/RouteFactory.js';
import { 
  ListTasksConfig, 
  CreateTaskConfig, 
  UpdateTaskConfig, 
  DeleteTaskConfig,
  GetTaskConfig 
} from './Task.config.js';
import { CreateTaskDTO, UpdateTaskDTO, TaskParamsDTO } from './Task.schema.js';

export async function taskRoutes(fastify: FastifyInstance) {
  const controller = new TaskController();

  registerGetRoute(fastify, '/', ListTasksConfig, controller.listUserTasks.bind(controller));
  
  registerPostRoute<CreateTaskDTO>(fastify, '/', CreateTaskConfig, controller.createTask.bind(controller));
  
  registerPatchRoute<UpdateTaskDTO, TaskParamsDTO>(
    fastify, '/:id', UpdateTaskConfig, controller.updateTask.bind(controller)
  );
  
  registerDeleteRoute<TaskParamsDTO>(fastify, '/:id', DeleteTaskConfig, controller.deleteTask.bind(controller));
  
  registerGetRoute<TaskParamsDTO>(fastify, '/:id', GetTaskConfig, controller.getTaskById.bind(controller));

}
