import { Static, Type } from '@sinclair/typebox';
import { CONFIG } from '../../shared/config/env.js';

export const TaskResponseSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  completed: Type.Boolean(),
  userId: Type.String({ format: 'uuid' }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
}, { $id: 'TaskResponse' });

export type TaskResponse = Static<typeof TaskResponseSchema>;

export const CreateTaskSchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
}, { $id: 'CreateTask' });

export type CreateTaskDTO = Static<typeof CreateTaskSchema>;

export const UpdateTaskSchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1 })),
  description: Type.Optional(Type.String()),
  completed: Type.Optional(Type.Boolean()),
}, { $id: 'UpdateTask' });

export type UpdateTaskDTO = Static<typeof UpdateTaskSchema>;

export const TaskParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export type TaskParamsDTO = Static<typeof TaskParamsSchema>;

export const PaginationQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: CONFIG.MAX_PAGE_SIZE, default: 25 })),
}, { $id: 'PaginationQuery' });

export type PaginationQueryDTO = Static<typeof PaginationQuerySchema>;
