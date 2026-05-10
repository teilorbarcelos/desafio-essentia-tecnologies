import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../shared/errors/AppError.js';

export const errorHandler = (error: unknown, _request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ 
      message: error.message 
    });
  }

  // Trata erros do Fastify (validação, JWT, etc) que já possuem statusCode
  const fastifyError = error as { statusCode?: number; message?: string };
  if (fastifyError.statusCode && fastifyError.statusCode < 500) {
    return reply.status(fastifyError.statusCode).send({
      message: fastifyError.message
    });
  }

  console.error('[Internal Error]:', error);

  return reply.status(500).send({
    message: 'Internal server error'
  });
};
