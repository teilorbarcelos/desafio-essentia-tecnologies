import { FastifyInstance, RouteHandlerMethod, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from 'fastify';
import { authenticate } from '../api/hooks/auth.hook.js';
import { createRouteSchema, StrictRouteSchema } from '../shared/utils/schema.util.js';
import { RouteConfig } from '../shared/utils/RouteContract.js';

/**
 * Generic type for Fastify route handlers with specific generics.
 */
type TypedHandler<TBody = unknown, TParams = unknown, TQuery = unknown> = RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  { Body: TBody; Params: TParams; Querystring: TQuery }
>;

/**
 * Registers a POST route using a standard configuration object.
 */
export const registerPostRoute = <TBody = unknown, TParams = unknown, TQuery = unknown>(
  fastify: FastifyInstance,
  path: string,
  config: RouteConfig,
  handler: TypedHandler<TBody, TParams, TQuery>,
  authenticated = true
) => {
  const schema: StrictRouteSchema = {
    tags: [config.tag],
    summary: config.summary,
    response: config.response,
    security: authenticated ? [{ bearerAuth: [] }] : []
  };

  if (config.body) schema.body = config.body;
  if (config.params) schema.params = config.params;
  if (config.querystring) schema.querystring = config.querystring;

  fastify.post<{ Body: TBody; Params: TParams; Querystring: TQuery }>(path, {
    schema: createRouteSchema(schema),
    preHandler: authenticated ? [authenticate] : []
  }, handler);
};

/**
 * Registers a GET route using a standard configuration object.
 */
export const registerGetRoute = <TParams = unknown, TQuery = unknown>(
  fastify: FastifyInstance,
  path: string,
  config: RouteConfig,
  handler: TypedHandler<unknown, TParams, TQuery>,
  authenticated = true
) => {
  const schema: StrictRouteSchema = {
    tags: [config.tag],
    summary: config.summary,
    response: config.response,
    security: authenticated ? [{ bearerAuth: [] }] : []
  };

  if (config.params) schema.params = config.params;
  if (config.querystring) schema.querystring = config.querystring;

  fastify.get<{ Body: unknown; Params: TParams; Querystring: TQuery }>(path, {
    schema: createRouteSchema(schema),
    preHandler: authenticated ? [authenticate] : []
  }, handler);
};

/**
 * Registers a PUT route using a standard configuration object.
 */
export const registerPutRoute = <TBody = unknown, TParams = unknown>(
  fastify: FastifyInstance,
  path: string,
  config: RouteConfig,
  handler: TypedHandler<TBody, TParams>,
  authenticated = true
) => {
  const schema: StrictRouteSchema = {
    tags: [config.tag],
    summary: config.summary,
    response: config.response,
    security: authenticated ? [{ bearerAuth: [] }] : []
  };

  if (config.params) schema.params = config.params;
  if (config.body) schema.body = config.body;

  fastify.put<{ Body: TBody; Params: TParams; Querystring: unknown }>(path, {
    schema: createRouteSchema(schema),
    preHandler: authenticated ? [authenticate] : []
  }, handler);
};

/**
 * Registers a DELETE route using a standard configuration object.
 */
export const registerDeleteRoute = <TParams = unknown>(
  fastify: FastifyInstance,
  path: string,
  config: RouteConfig,
  handler: TypedHandler<unknown, TParams>,
  authenticated = true
) => {
  const schema: StrictRouteSchema = {
    tags: [config.tag],
    summary: config.summary,
    response: config.response,
    security: authenticated ? [{ bearerAuth: [] }] : []
  };

  if (config.params) schema.params = config.params;

  fastify.delete<{ Body: unknown; Params: TParams; Querystring: unknown }>(path, {
    schema: createRouteSchema(schema),
    preHandler: authenticated ? [authenticate] : []
  }, handler);
};

/**
 * Registers a PATCH route using a standard configuration object.
 */
export const registerPatchRoute = <TBody = unknown, TParams = unknown>(
  fastify: FastifyInstance,
  path: string,
  config: RouteConfig,
  handler: TypedHandler<TBody, TParams>,
  authenticated = true
) => {
  const schema: StrictRouteSchema = {
    tags: [config.tag],
    summary: config.summary,
    response: config.response,
    security: authenticated ? [{ bearerAuth: [] }] : []
  };

  if (config.params) schema.params = config.params;
  if (config.body) schema.body = config.body;

  fastify.patch<{ Body: TBody; Params: TParams; Querystring: unknown }>(path, {
    schema: createRouteSchema(schema),
    preHandler: authenticated ? [authenticate] : []
  }, handler);
};
