import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from '../../src/api/hooks/error.handler.js';
import { AppError, NotFoundError } from '../../src/shared/errors/AppError.js';
import { FastifyReply, FastifyRequest } from 'fastify';

describe('Error Handler Hook', () => {
  let mockReply: any;
  let mockRequest: any;

  beforeEach(() => {
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    mockRequest = {} as FastifyRequest;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should handle AppError correctly', () => {
    const error = new NotFoundError('Not found');
    errorHandler(error, mockRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('should handle Fastify validation errors (4xx)', () => {
    const error = { statusCode: 400, message: 'Invalid field' };
    errorHandler(error, mockRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({ message: 'Invalid field' });
  });

  it('should handle unknown errors as 500', () => {
    const error = new Error('Random crash');
    errorHandler(error, mockRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(console.error).toHaveBeenCalledWith('[Internal Error]:', error);
  });
});
