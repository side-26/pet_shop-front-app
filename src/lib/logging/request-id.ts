const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;

export function isValidRequestId(value: unknown): value is string {
  return typeof value === 'string' && REQUEST_ID_PATTERN.test(value);
}

export function resolveRequestId(value: unknown): string {
  return isValidRequestId(value) ? value : crypto.randomUUID();
}
