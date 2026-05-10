import { FastifyInstance } from 'fastify';
import { AuthController } from './Auth.controller.js';
import { AuthService } from './Auth.service.js';
import { registerPostRoute, registerGetRoute } from '../../core/RouteFactory.js';
import { LoginConfig, RefreshConfig, GetMeConfig, ChangePasswordConfig } from './Auth.config.js';
import { LoginDTO, RefreshDTO, ChangePasswordDTO } from './Auth.schema.js';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);
  const controller = new AuthController(authService);

  registerPostRoute<LoginDTO>(fastify, '/login', LoginConfig, controller.login.bind(controller), false);
  
  registerPostRoute<RefreshDTO>(fastify, '/refresh', RefreshConfig, controller.refresh.bind(controller), false);
  
  registerGetRoute(fastify, '/me', GetMeConfig, controller.getMe.bind(controller));
  
  registerPostRoute<ChangePasswordDTO>(fastify, '/change-password', ChangePasswordConfig, controller.changePassword.bind(controller));
}
