import type { GetProfileOrdersQueryDTO } from './profile.dto';

export function createProfileOrdersCacheKey(query: GetProfileOrdersQueryDTO) {
  return Object.entries(query)
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}
