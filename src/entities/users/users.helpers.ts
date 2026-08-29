import type { GetAllPaginatedUsersQueryDTO } from './users.dto';

type UsersPaginatedApiQuery = Omit<GetAllPaginatedUsersQueryDTO, 'isEnable'> & {
  isEnable?: boolean;
};

export function createUsersListCacheKey(query: GetAllPaginatedUsersQueryDTO): string {
  const entries = Object.entries(query)
    .filter((entry): entry is [string, string | number | boolean] => entry[1] != null)
    .sort(([left], [right]) => left.localeCompare(right));

  return new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString();
}

export function omitNullQueryValues(query: GetAllPaginatedUsersQueryDTO): UsersPaginatedApiQuery {
  const { isEnable, ...rest } = query;
  return isEnable == null ? rest : { ...rest, isEnable };
}
