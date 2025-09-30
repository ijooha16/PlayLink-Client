import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

interface ApiError {
  response?: { data?: { message?: string; code?: number }; status?: number };
  message?: string;
}

const handleError = (
  err: unknown,
  method: string,
  url: string,
  duration: number
) => {
  const error = err as ApiError;
  logger.apiError(method, url, err);

  const status = error.response?.status || 500;
  const message =
    error.response?.data?.message || error.message || 'Unknown error';

  logger.response(method, url, status, duration);

  return NextResponse.json(
    { status: 'error', message, code: error.response?.data?.code },
    { status }
  );
};

const checkAuth = (
  request: Request | NextRequest,
  method: string,
  url: string
) => {
  const token = request.headers.get('Authorization');
  if (!token) {
    logger.warn('Unauthorized request', { method, url, status: 401 });
    return NextResponse.json(
      { status: 'error', message: 'Authorization token is required' },
      { status: 401 }
    );
  }
  return null;
};

export const withApiHandler = <T>(
  handler: (request: Request) => Promise<T>,
  options: { requireAuth?: boolean } = {}
) => {
  return async (request: Request): Promise<NextResponse> => {
    const startTime = Date.now();
    const method = request.method;
    const url = new URL(request.url).pathname;

    logger.request(method, url);

    try {
      if (options.requireAuth) {
        const authError = checkAuth(request, method, url);
        if (authError) return authError;
      }

      const result = await handler(request);
      logger.response(method, url, 200, Date.now() - startTime);
      return NextResponse.json(result);
    } catch (err) {
      return handleError(err, method, url, Date.now() - startTime);
    }
  };
};

export const withApiHandlerRaw = (
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: { requireAuth?: boolean } = {}
) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const method = request.method;
    const url = new URL(request.url).pathname;

    logger.request(method, url);

    try {
      if (options.requireAuth) {
        const authError = checkAuth(request, method, url);
        if (authError) return authError;
      }

      const result = await handler(request);
      logger.response(method, url, result.status, Date.now() - startTime);
      return result;
    } catch (err) {
      return handleError(err, method, url, Date.now() - startTime);
    }
  };
};
