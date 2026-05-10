import { createPaginatedResponseSchema } from '../../shared/utils/schema.util.js';
import { defineRouteConfig } from '../../shared/utils/RouteContract.js';
import { CreateTaskSchema, PaginationQuerySchema, TaskParamsSchema, TaskResponseSchema, UpdateTaskSchema } from './Task.schema.js';

const TAG = 'Task';

export const ListTasksConfig = defineRouteConfig({
  tag: TAG,
  summary: 'List user tasks',
  querystring: PaginationQuerySchema,
  response: { 200: createPaginatedResponseSchema(TaskResponseSchema, 'TaskPaginatedResponse') }
});

export const CreateTaskConfig = defineRouteConfig({
  tag: TAG,
  summary: 'Create a new task',
  body: CreateTaskSchema,
  response: { 201: TaskResponseSchema }
});

export const UpdateTaskConfig = defineRouteConfig({
  tag: TAG,
  summary: 'Update a task',
  params: TaskParamsSchema,
  body: UpdateTaskSchema,
  response: { 200: TaskResponseSchema }
});

export const DeleteTaskConfig = defineRouteConfig({
  tag: TAG,
  summary: 'Delete a task',
  params: TaskParamsSchema,
  response: { 204: { type: 'null' } }
});

export const GetTaskConfig = defineRouteConfig({
  tag: TAG,
  summary: 'Get a task by id',
  params: TaskParamsSchema,
  response: { 200: TaskResponseSchema }
});
