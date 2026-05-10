export interface RouteConfig {
  tag: string;
  summary: string;
  body?: unknown;
  params?: unknown;
  querystring?: unknown;
  response: Record<number, unknown>;
}

/**
 * Helper to define a route configuration with type inference.
 */
export const defineRouteConfig = (config: RouteConfig): RouteConfig => config;
