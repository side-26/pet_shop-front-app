import 'server-only';

import { LOG_EVENTS, type HttpOutcome } from './contracts';
import { normalizeDuration } from './sanitize';
import { serverLogger } from './server-logger';

type ServerHttpObservation = Readonly<{
  requestId: string;
  returnedRequestId?: string;
  method: string;
  path: string;
  statusCode?: number;
  durationMs: number;
  outcome: HttpOutcome;
  errorType?: string;
}>;

type InternalApiFailure = Readonly<{
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  errorType: string;
}>;

type NextRequestFailure = Readonly<{
  requestId?: string;
  method: string;
  routePath: string;
  routeType: 'render' | 'route' | 'action' | 'proxy';
  errorType: string;
}>;

export function observeNextRequestFailure(failure: NextRequestFailure): void {
  serverLogger.error(
    {
      event: LOG_EVENTS.SERVER_UNEXPECTED_ERROR,
      component: 'next-runtime',
      request_id: failure.requestId,
      method: failure.method,
      path: failure.routePath,
      route_type: failure.routeType,
      error_type: failure.errorType,
    },
    'Next runtime operation failed',
  );
}

export function observeInternalApiFailure(failure: InternalApiFailure): void {
  serverLogger.error(
    {
      event: LOG_EVENTS.HTTP_REQUEST_FAILED,
      component: 'api-handler',
      request_id: failure.requestId,
      method: failure.method,
      path: failure.path,
      status_code: failure.statusCode,
      error_type: failure.errorType,
    },
    'Internal API operation failed',
  );
}

export function observeServerHttpCompletion(observation: ServerHttpObservation): void {
  const context = {
    event: LOG_EVENTS.HTTP_UPSTREAM_COMPLETED,
    component: 'custom-fetcher' as const,
    request_id: observation.requestId,
    returned_request_id: observation.returnedRequestId,
    method: observation.method,
    path: observation.path,
    status_code: observation.statusCode,
    duration_ms: normalizeDuration(observation.durationMs),
    upstream: 'backend-api' as const,
    outcome: observation.outcome,
    error_type: observation.errorType,
  };

  if (
    observation.outcome === 'server_error' ||
    observation.outcome === 'timeout' ||
    observation.outcome === 'network_error' ||
    observation.outcome === 'protocol_error'
  ) {
    serverLogger.error(context, 'Backend operation completed');
    return;
  }

  if (observation.statusCode === 429) {
    serverLogger.warn(context, 'Backend operation completed');
    return;
  }

  serverLogger.debug(context, 'Backend operation completed');
}
