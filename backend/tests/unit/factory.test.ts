import { describe, it, expect, vi } from 'vitest';
import { FastifyInstance } from 'fastify';
import { 
  registerPostRoute, 
  registerGetRoute, 
  registerPutRoute, 
  registerDeleteRoute, 
  registerPatchRoute 
} from '../../src/core/RouteFactory.js';

describe('RouteFactory', () => {
  const mockFastify = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn()
  } as unknown as FastifyInstance;

  const fullConfig = {
    tag: 'test',
    summary: 'test',
    response: { 200: { type: 'object' } },
    body: { type: 'object' },
    params: { type: 'object' },
    querystring: { type: 'object' }
  };

  const minimalConfig = {
    tag: 'test',
    summary: 'test',
    response: { 200: { type: 'object' } }
  };

  const mockHandler = vi.fn();

  it('should cover all registration methods with full config', () => {
    registerPostRoute(mockFastify, '/post', fullConfig, mockHandler);
    registerGetRoute(mockFastify, '/get', fullConfig, mockHandler);
    registerPutRoute(mockFastify, '/put', fullConfig, mockHandler);
    registerDeleteRoute(mockFastify, '/delete', fullConfig, mockHandler);
    registerPatchRoute(mockFastify, '/patch', fullConfig, mockHandler);

    expect(mockFastify.post).toHaveBeenCalled();
    expect(mockFastify.get).toHaveBeenCalled();
    expect(mockFastify.put).toHaveBeenCalled();
    expect(mockFastify.delete).toHaveBeenCalled();
    expect(mockFastify.patch).toHaveBeenCalled();
  });

  it('should cover all registration methods with minimal config', () => {
    registerPostRoute(mockFastify, '/post-min', minimalConfig, mockHandler);
    registerGetRoute(mockFastify, '/get-min', minimalConfig, mockHandler);
    registerPutRoute(mockFastify, '/put-min', minimalConfig, mockHandler);
    registerDeleteRoute(mockFastify, '/delete-min', minimalConfig, mockHandler);
    registerPatchRoute(mockFastify, '/patch-min', minimalConfig, mockHandler);

    expect(mockFastify.post).toHaveBeenCalled();
  });

  it('should support unauthenticated routes for all methods', () => {
    registerPostRoute(mockFastify, '/public-post', minimalConfig, mockHandler, false);
    registerGetRoute(mockFastify, '/public-get', minimalConfig, mockHandler, false);
    registerPutRoute(mockFastify, '/public-put', minimalConfig, mockHandler, false);
    registerDeleteRoute(mockFastify, '/public-delete', minimalConfig, mockHandler, false);
    registerPatchRoute(mockFastify, '/public-patch', minimalConfig, mockHandler, false);

    expect(mockFastify.post).toHaveBeenCalled();
    expect(mockFastify.get).toHaveBeenCalled();
    expect(mockFastify.put).toHaveBeenCalled();
    expect(mockFastify.delete).toHaveBeenCalled();
    expect(mockFastify.patch).toHaveBeenCalled();
  });
});

