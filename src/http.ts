import type { Env } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function jsonResponse(env: Env, request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders(env, request),
    },
  });
}

export function errorResponse(env: Env, request: Request, error: ApiError): Response {
  return jsonResponse(
    env,
    request,
    {
      success: false,
      error_code: error.code,
      message: error.message,
    },
    error.status,
  );
}

export function okResponse(env: Env, request: Request, body: Record<string, unknown> = {}): Response {
  return jsonResponse(env, request, { success: true, ...body });
}

export function noContentResponse(env: Env, request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(env, request),
  });
}

export function notFound(): never {
  throw new ApiError(404, 'not_found', 'Endpoint not found.');
}

export async function readJsonBody<T extends Record<string, unknown>>(request: Request): Promise<T> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new ApiError(400, 'invalid_request', 'Request body must be JSON.');
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ApiError(400, 'invalid_request', 'Request body must be an object.');
    }
    return body as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'invalid_request', 'Invalid JSON body.');
  }
}

export function assertString(value: unknown, field: string, options: { min?: number; max?: number } = {}): string {
  if (typeof value !== 'string') {
    throw new ApiError(400, 'invalid_request', `${field} must be a string.`);
  }

  const trimmed = value.trim();
  if (options.min !== undefined && trimmed.length < options.min) {
    throw new ApiError(400, 'invalid_request', `${field} is too short.`);
  }
  if (options.max !== undefined && trimmed.length > options.max) {
    throw new ApiError(400, 'invalid_request', `${field} is too long.`);
  }

  return trimmed;
}

export function optionalString(value: unknown, field: string, max = 255): string | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return assertString(value, field, { max });
}

export function assertStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new ApiError(400, 'invalid_request', `${field} must be an array.`);
  }

  return value.map((item) => assertString(item, field, { min: 1, max: 255 }).toLowerCase());
}

export function corsHeaders(env: Env, request: Request): HeadersInit {
  const origin = request.headers.get('origin');
  const configured = env.CORS_ORIGIN || '*';
  const allowOrigin = configured === '*' ? origin || '*' : configured;

  const headers: Record<string, string> = {
    'access-control-allow-origin': allowOrigin,
    'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };

  if (origin) {
    headers['access-control-allow-credentials'] = 'true';
  }

  return headers;
}
