import 'server-only';

import pino from 'pino';

import type { LogLevel, ServerLogContext, StableLogMessage } from './contracts';

const configuredLevel = process.env.LOG_LEVEL;
const level =
  configuredLevel === 'debug' ||
  configuredLevel === 'info' ||
  configuredLevel === 'warn' ||
  configuredLevel === 'error' ||
  configuredLevel === 'silent'
    ? configuredLevel
    : process.env.NODE_ENV === 'test'
      ? 'silent'
      : process.env.NODE_ENV === 'production'
        ? 'info'
        : 'debug';

const transport = pino({
  level,
  messageKey: 'message',
  base: {
    service: process.env.LOG_SERVICE_NAME ?? 'petshop-frontend',
    environment: process.env.LOG_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development',
    ...(process.env.RELEASE_VERSION ? { release: process.env.RELEASE_VERSION } : {}),
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  // The deployment log collector provides an ingestion timestamp. Avoid a runtime clock read here:
  // this logger is also called from Next.js's prerender-failure hook, where `new Date()` is blocked.
  timestamp: false,
  redact: {
    paths: [
      '*.authorization',
      '*.cookie',
      '*.token',
      '*.password',
      '*.otp',
      '*.secret',
      '*.session',
      '*.phone',
      '*.email',
      '*.body',
      '*.form',
      '*.file',
      '*.request',
      '*.response',
    ],
    censor: '[REDACTED]',
  },
});

function write(level: LogLevel, context: ServerLogContext, message: StableLogMessage): void {
  try {
    transport[level](context, message);
  } catch {
    // Observability must never change the business outcome.
  }
}

export const serverLogger = {
  debug: (context: ServerLogContext, message: StableLogMessage) => write('debug', context, message),
  info: (context: ServerLogContext, message: StableLogMessage) => write('info', context, message),
  warn: (context: ServerLogContext, message: StableLogMessage) => write('warn', context, message),
  error: (context: ServerLogContext, message: StableLogMessage) => write('error', context, message),
};
