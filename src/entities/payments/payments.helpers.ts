import type { GetPaymentsQueryDTO } from './payments.dto';

export function createPaymentsListCacheKey(query: GetPaymentsQueryDTO): string {
  return new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value != null)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, String(value)]),
  ).toString();
}
