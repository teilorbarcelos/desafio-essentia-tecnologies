import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticate } from '../../src/api/hooks/auth.hook.js';
import { SessionManager } from '../../src/infra/auth/SessionManager.js';

describe('Auth Hook Unit Tests', () => {
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    mockRequest = {
      jwtVerify: vi.fn(),
      headers: {},
      user: { id: '1' }
    };
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    };
    vi.clearAllMocks();
  });

  it('should return 401 if jwtVerify fails', async () => {
    mockRequest.jwtVerify.mockRejectedValue(new Error('Invalid token'));
    await authenticate(mockRequest, mockReply);
    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should handle missing authorization header gracefully', async () => {
    mockRequest.jwtVerify.mockResolvedValue(undefined);
    mockRequest.headers = {}; // No auth header
    vi.spyOn(SessionManager, 'validateSession').mockResolvedValue(false);

    await authenticate(mockRequest, mockReply);
    expect(mockReply.status).toHaveBeenCalledWith(401);
  });
});
