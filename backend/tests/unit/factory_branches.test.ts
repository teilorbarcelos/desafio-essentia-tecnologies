import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  registerPostRoute, 
  registerGetRoute, 
  registerPutRoute, 
  registerDeleteRoute, 
  registerPatchRoute 
} from '../../src/core/RouteFactory.js';

describe('RouteFactory Unit Tests (Branch Coverage)', () => {
  let mockFastify: any;
  const dummyConfig = {
    tag: 'Test',
    summary: 'Test',
    response: { 200: { type: 'object' } }
  };
  const dummyHandler = async () => {};

  beforeEach(() => {
    mockFastify = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
    };
  });

  it('should cover all branches for POST routes', () => {
    // Branch: authenticated = true
    registerPostRoute(mockFastify, '/test', dummyConfig, dummyHandler, true);
    // Branch: authenticated = false
    registerPostRoute(mockFastify, '/test', dummyConfig, dummyHandler, false);
    
    expect(mockFastify.post).toHaveBeenCalledTimes(2);
  });

  it('should cover all branches for GET routes', () => {
    registerGetRoute(mockFastify, '/test', dummyConfig, dummyHandler, true);
    registerGetRoute(mockFastify, '/test', dummyConfig, dummyHandler, false);
    expect(mockFastify.get).toHaveBeenCalledTimes(2);
  });

  it('should cover all branches for PUT routes', () => {
    registerPutRoute(mockFastify, '/test', dummyConfig, dummyHandler, true);
    registerPutRoute(mockFastify, '/test', dummyConfig, dummyHandler, false);
    expect(mockFastify.put).toHaveBeenCalledTimes(2);
  });

  it('should cover all branches for DELETE routes', () => {
    registerDeleteRoute(mockFastify, '/test', dummyConfig, dummyHandler, true);
    registerDeleteRoute(mockFastify, '/test', dummyConfig, dummyHandler, false);
    expect(mockFastify.delete).toHaveBeenCalledTimes(2);
  });

  it('should cover all branches for PATCH routes', () => {
    registerPatchRoute(mockFastify, '/test', dummyConfig, dummyHandler, true);
    registerPatchRoute(mockFastify, '/test', dummyConfig, dummyHandler, false);
    expect(mockFastify.patch).toHaveBeenCalledTimes(2);
  });
});
