import { describe, it, expect } from 'vitest';
import { createPaginatedResponseSchema, createRouteSchema } from '../../src/shared/utils/schema.util.js';

describe('Schema Utilities', () => {
  it('should create a paginated response schema', () => {
    const itemSchema = { type: 'string' };
    const schema = createPaginatedResponseSchema(itemSchema);
    
    expect(schema.type).toBe('object');
    expect(schema.properties.items.items).toEqual(itemSchema);
  });

  it('should return the schema passed to createRouteSchema', () => {
    const schema = {
      tags: ['test'] as [string, ...string[]],
      summary: 'test',
      response: { 200: { type: 'object' } }
    };
    expect(createRouteSchema(schema)).toBe(schema);
  });
});
