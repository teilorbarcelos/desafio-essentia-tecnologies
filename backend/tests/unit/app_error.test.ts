import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError, AuthenticationError } from '../../src/shared/errors/AppError.js';

describe('AppError Classes', () => {
  it('should create AppError with default status 400', () => {
    const error = new AppError('Error');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Error');
  });

  it('should create NotFoundError with status 404', () => {
    const error = new NotFoundError('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create UnauthorizedError with status 403', () => {
    const error = new UnauthorizedError('Forbidden');
    expect(error.statusCode).toBe(403);
  });

  it('should create AuthenticationError with status 401', () => {
    const error = new AuthenticationError('Unauthenticated');
    expect(error.statusCode).toBe(401);
  });
});
