const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;
const MAX_ERROR_TYPE_LENGTH = 64;

export function sanitizeErrorType(value: unknown): string {
  const errorType = value instanceof Error ? value.name : typeof value;
  const normalized = errorType.replace(CONTROL_CHARACTERS, '').trim();

  return (normalized || 'UnknownError').slice(0, MAX_ERROR_TYPE_LENGTH);
}

export function getPathGroup(input: string): string {
  try {
    const pathname = new URL(input, 'http://logging.invalid').pathname;
    const firstSegment = pathname.split('/').filter(Boolean)[0];

    return firstSegment && /^[a-z][a-z0-9-]{0,31}$/i.test(firstSegment)
      ? `/${firstSegment.toLowerCase()}`
      : '/unknown';
  } catch {
    return '/unknown';
  }
}

export function createErrorFingerprint(...parts: readonly unknown[]): string {
  const input = parts
    .map((part) =>
      typeof part === 'string' || typeof part === 'number' ? String(part) : 'unknown',
    )
    .join('|')
    .slice(0, 2_048);
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `fp_${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function normalizeDuration(durationMs: number): number {
  return Math.max(0, Math.round(durationMs));
}
