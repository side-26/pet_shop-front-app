'use client';

import {
  LOG_EVENTS,
  type ClientComponent,
  type ClientErrorReport,
  type ClientErrorType,
  type InteractionType,
} from './contracts';
import { telemetryFetcher } from '@/lib/api/telemetryFetcher';
import { isValidRequestId } from './request-id';
import { createErrorFingerprint, sanitizeErrorType } from './sanitize';

const TELEMETRY_ENDPOINT = '/api/observability/client-errors';
const MAX_REPORTED_FINGERPRINTS = 200;
const INTERACTION_TTL_MS = 5_000;
const reportedFingerprints = new Set<string>();

let latestRequestId: string | undefined;
let latestInteraction: Readonly<{ type: InteractionType; timestamp: number }> = {
  type: 'none',
  timestamp: 0,
};

function isReportingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CLIENT_ERROR_REPORTING_ENABLED === 'true';
}

function getSampleRate(): number {
  const configuredRate = Number(process.env.NEXT_PUBLIC_CLIENT_ERROR_SAMPLE_RATE ?? '1');
  return Number.isFinite(configuredRate) ? Math.min(1, Math.max(0, configuredRate)) : 1;
}

function shouldSample(fingerprint: string): boolean {
  const sampleRate = getSampleRate();
  if (sampleRate >= 1) return true;
  if (sampleRate <= 0) return false;

  const bucket = Number.parseInt(fingerprint.slice(3, 11), 16) / 0xffffffff;
  return bucket <= sampleRate;
}

function getInteractionType(): InteractionType {
  return performance.now() - latestInteraction.timestamp <= INTERACTION_TTL_MS
    ? latestInteraction.type
    : 'none';
}

function sendReport(report: ClientErrorReport): void {
  telemetryFetcher({ body: report, url: TELEMETRY_ENDPOINT });
}

export function setClientRequestId(value: unknown): void {
  if (isValidRequestId(value)) latestRequestId = value;
}

export function noteClientInteraction(type: Exclude<InteractionType, 'none'>): void {
  latestInteraction = { type, timestamp: performance.now() };
}

export function reportClientError(
  error: unknown,
  options: Readonly<{
    component: ClientComponent;
    errorType: ClientErrorType;
    fingerprintParts?: readonly (string | number)[];
    requestId?: string;
  }>,
): void {
  if (!isReportingEnabled()) return;

  const errorType = sanitizeErrorType(error);
  const fingerprint = createErrorFingerprint(
    options.component,
    options.errorType,
    errorType,
    ...(options.fingerprintParts ?? []),
  );
  if (reportedFingerprints.has(fingerprint) || !shouldSample(fingerprint)) return;

  if (reportedFingerprints.size >= MAX_REPORTED_FINGERPRINTS) reportedFingerprints.clear();
  reportedFingerprints.add(fingerprint);

  const requestId = isValidRequestId(options.requestId) ? options.requestId : latestRequestId;
  sendReport({
    event: LOG_EVENTS.CLIENT_UNEXPECTED_ERROR,
    component: options.component,
    error_type: options.errorType,
    error_fingerprint: fingerprint,
    interaction_type: getInteractionType(),
    ...(requestId ? { request_id: requestId } : {}),
  });
}

export function resetClientReportingForTests(): void {
  reportedFingerprints.clear();
  latestRequestId = undefined;
  latestInteraction = { type: 'none', timestamp: 0 };
}
