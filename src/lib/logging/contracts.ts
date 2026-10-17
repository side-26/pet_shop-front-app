export const LOG_EVENTS = {
  CLIENT_UNEXPECTED_ERROR: 'client.unexpected_error',
  HTTP_UPSTREAM_COMPLETED: 'http.upstream.completed',
  HTTP_REQUEST_FAILED: 'http.request.failed',
  LOGGING_CLIENT_EVENT_REJECTED: 'logging.client_event_rejected',
  SERVER_UNEXPECTED_ERROR: 'server.unexpected_error',
} as const;

export type LogEventName = (typeof LOG_EVENTS)[keyof typeof LOG_EVENTS];
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const CLIENT_COMPONENTS = [
  'global',
  'react-boundary',
  'internal-fetcher',
  'upload-fetcher',
] as const;
export type ClientComponent = (typeof CLIENT_COMPONENTS)[number];

export const CLIENT_ERROR_TYPES = [
  'render_error',
  'unhandled_error',
  'unhandled_rejection',
  'network_error',
  'timeout',
  'server_error',
  'protocol_error',
] as const;
export type ClientErrorType = (typeof CLIENT_ERROR_TYPES)[number];

export const INTERACTION_TYPES = ['none', 'pointer', 'keyboard', 'submit'] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

export type ClientErrorReport = Readonly<{
  event: typeof LOG_EVENTS.CLIENT_UNEXPECTED_ERROR;
  component: ClientComponent;
  error_type: ClientErrorType;
  error_fingerprint: string;
  interaction_type: InteractionType;
  request_id?: string;
}>;

export type HttpOutcome =
  | 'success'
  | 'client_error'
  | 'server_error'
  | 'timeout'
  | 'network_error'
  | 'aborted'
  | 'protocol_error';

export type ServerLogContext = Readonly<{
  event: LogEventName;
  component: 'custom-fetcher' | 'api-handler' | 'client-telemetry' | 'next-runtime';
  request_id?: string;
  returned_request_id?: string;
  method?: string;
  path?: string;
  status_code?: number;
  duration_ms?: number;
  upstream?: 'backend-api' | 'browser';
  outcome?: HttpOutcome;
  error_type?: string;
  error_fingerprint?: string;
  interaction_type?: InteractionType;
  route_type?: 'render' | 'route' | 'action' | 'proxy';
}>;

export type StableLogMessage =
  | 'Backend operation completed'
  | 'Internal API operation failed'
  | 'Next runtime operation failed'
  | 'Browser error reported'
  | 'Browser telemetry rejected';
