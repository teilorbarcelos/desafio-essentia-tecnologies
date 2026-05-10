import { Static, Type } from '@sinclair/typebox';

export const TaskResponseSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  completed: Type.Boolean(),
  userId: Type.String({ format: 'uuid' }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export type TaskResponse = Static<typeof TaskResponseSchema>;

export const CreateTaskSchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
});

export type CreateTaskDTO = Static<typeof CreateTaskSchema>;

export const UpdateTaskSchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1 })),
  description: Type.Optional(Type.String()),
  completed: Type.Optional(Type.Boolean()),
});

export type UpdateTaskDTO = Static<typeof UpdateTaskSchema>;

export const TaskParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export type TaskParamsDTO = Static<typeof TaskParamsSchema>;
