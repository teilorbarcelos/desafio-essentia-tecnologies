import { FastifySchema } from 'fastify';

export interface StrictRouteSchema extends FastifySchema {
  tags: [string, ...string[]];
  summary: string;
  response: Record<number, unknown>;
  security?: Record<string, string[]>[];
}

export function createPaginatedResponseSchema(itemSchema: unknown, id?: string) {
  return {
    $id: id,
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: itemSchema
      },
      total: { type: 'number' },
      page: { type: 'number' },
      size: { type: 'number' }
    }
  };
}

export function createRouteSchema<T extends StrictRouteSchema>(schema: T): T {
  return schema;
}
