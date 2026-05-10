import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../src/modules/Auth/Auth.service.js';
import { AuthenticationError } from '../../src/shared/errors/AppError.js';

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let mockFastify: any;

  beforeEach(() => {
    mockFastify = {
      jwt: {
        sign: vi.fn(),
        verify: vi.fn()
      }
    };
    authService = new AuthService(mockFastify);
    vi.clearAllMocks();
  });

  it('should throw AuthenticationError in refreshToken if unexpected error occurs', async () => {
    // Mock verifyToken to throw a non-AppError
    (authService as any).jwtProvider.verifyToken = vi.fn().mockRejectedValue(new Error('JWT expired'));

    await expect(authService.refreshToken('bad-token')).rejects.toThrow(AuthenticationError);
  });
});
