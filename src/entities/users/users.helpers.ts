import type { GetAllPaginatedUsersQueryDTO } from './users.dto';

export function createUsersListCacheKey(query: GetAllPaginatedUsersQueryDTO): string {
  const entries = Object.entries(query)
    .filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)
    .sort(([left], [right]) => left.localeCompare(right));

  return new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString();
}
