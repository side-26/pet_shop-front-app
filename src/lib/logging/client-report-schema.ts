import {
  CLIENT_COMPONENTS,
  CLIENT_ERROR_TYPES,
  INTERACTION_TYPES,
  LOG_EVENTS,
  type ClientErrorReport,
} from './contracts';
import { isValidRequestId } from './request-id';

const FINGERPRINT_PATTERN = /^fp_[a-f0-9]{8,64}$/;
const REPORT_KEYS = new Set([
  'event',
  'component',
  'error_type',
  'error_fingerprint',
  'interaction_type',
  'request_id',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseClientErrorReport(value: unknown): ClientErrorReport | null {
  if (!isRecord(value) || Object.keys(value).some((key) => !REPORT_KEYS.has(key))) return null;
  if (value.event !== LOG_EVENTS.CLIENT_UNEXPECTED_ERROR) return null;
  if (!CLIENT_COMPONENTS.includes(value.component as never)) return null;
  if (!CLIENT_ERROR_TYPES.includes(value.error_type as never)) return null;
  if (!INTERACTION_TYPES.includes(value.interaction_type as never)) return null;
  if (
    typeof value.error_fingerprint !== 'string' ||
    !FINGERPRINT_PATTERN.test(value.error_fingerprint)
  )
    return null;
  if (value.request_id !== undefined && !isValidRequestId(value.request_id)) return null;

  return value as ClientErrorReport;
}
