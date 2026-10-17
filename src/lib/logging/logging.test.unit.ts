import { describe, expect, it } from 'vitest';

import { LOG_EVENTS } from './contracts';
import { parseClientErrorReport } from './client-report-schema';
import { isValidRequestId, resolveRequestId } from './request-id';
import { createErrorFingerprint, getPathGroup, sanitizeErrorType } from './sanitize';

describe('logging safety utilities', () => {
  it('preserves valid request IDs and replaces invalid values', () => {
    expect(resolveRequestId('request_12345678')).toBe('request_12345678');
    expect(isValidRequestId(resolveRequestId('invalid value'))).toBe(true);
    expect(isValidRequestId('short')).toBe(false);
  });

  it('reduces URLs to a bounded path group without query or identifiers', () => {
    expect(getPathGroup('https://api.example.test/products/private-slug?token=secret')).toBe(
      '/products',
    );
    expect(getPathGroup('not a url')).toBe('/unknown');
  });

  it('creates stable bounded fingerprints without exposing their input', () => {
    const fingerprint = createErrorFingerprint('TypeError', 'private user text');

    expect(fingerprint).toMatch(/^fp_[a-f0-9]{8}$/);
    expect(fingerprint).toBe(createErrorFingerprint('TypeError', 'private user text'));
    expect(fingerprint).not.toContain('private');
    expect(sanitizeErrorType(new TypeError('private message'))).toBe('TypeError');
  });

  it('accepts only the closed browser telemetry schema', () => {
    const report = {
      event: LOG_EVENTS.CLIENT_UNEXPECTED_ERROR,
      component: 'global',
      error_type: 'unhandled_error',
      error_fingerprint: 'fp_1234abcd',
      interaction_type: 'pointer',
      request_id: 'request_12345678',
    } as const;

    expect(parseClientErrorReport(report)).toEqual(report);
    expect(parseClientErrorReport({ ...report, user_id: 'spoofed' })).toBeNull();
    expect(parseClientErrorReport({ ...report, error_message: 'private' })).toBeNull();
    expect(parseClientErrorReport({ ...report, request_id: 'invalid value' })).toBeNull();
  });
});
