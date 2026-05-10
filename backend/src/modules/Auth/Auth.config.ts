import { defineRouteConfig } from '../../shared/utils/RouteContract.js';
import { AuthResponseSchema, ChangePasswordSchema, LoginSchema, RefreshSchema, UserMeResponseSchema } from './Auth.schema.js';

const TAG = 'Auth';

export const LoginConfig = defineRouteConfig({
  tag: TAG,
  summary: 'User login',
  body: LoginSchema,
  response: { 200: AuthResponseSchema }
});

export const RefreshConfig = defineRouteConfig({
  tag: TAG,
  summary: 'Refresh token',
  body: RefreshSchema,
  response: { 200: AuthResponseSchema }
});

export const GetMeConfig = defineRouteConfig({
  tag: TAG,
  summary: 'Get current user info',
  response: { 200: UserMeResponseSchema }
});

export const ChangePasswordConfig = defineRouteConfig({
  tag: TAG,
  summary: 'Change user password',
  body: ChangePasswordSchema,
  response: { 200: { type: 'object', properties: { message: { type: 'string' } } } }
});
