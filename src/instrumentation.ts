import type { Instrumentation } from 'next';

import { isValidRequestId } from '@/lib/logging/request-id';
import { sanitizeErrorType } from '@/lib/logging/sanitize';

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { observeNextRequestFailure } = await import('@/lib/logging/server-http-observer');
  const incomingRequestId = request.headers['x-request-id'];
  const requestId = Array.isArray(incomingRequestId) ? incomingRequestId[0] : incomingRequestId;

  observeNextRequestFailure({
    requestId: isValidRequestId(requestId) ? requestId : undefined,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    errorType: sanitizeErrorType(error),
  });
};
