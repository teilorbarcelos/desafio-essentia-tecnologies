import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthPayload } from '../../infra/auth/JWTProvider.js';
import { AuditRepository } from '../../modules/Audit/Audit.repository.js';

export async function auditHook(request: FastifyRequest, reply: FastifyReply) {
  const isHealth = request.url === '/health';
  const isAuth = request.url.startsWith('/auth');
  
  if (isHealth || isAuth) {
    return;
  }

  const user = request.user as AuthPayload | undefined;
  
  const body = request.body as Record<string, unknown> | undefined;
  const payload = body ? { ...body } : {};
  
  const sensitiveFields = ['password', 'currentPassword', 'newPassword'];
  sensitiveFields.forEach(field => {
    if (payload[field]) payload[field] = '********';
  });

  try {
    await AuditRepository.create({
      userId: user?.id,
      userEmail: user?.email,
      method: request.method,
      path: request.url,
      action: `${request.method} ${request.url}`,
      payload,
      statusCode: reply.statusCode,
      timestamp: new Date(),
      ip: request.ip
    });
  } catch (err) {
    console.error('[audit]: Failed to create audit log', err);
  }
}
