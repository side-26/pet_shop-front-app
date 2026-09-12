export type PaginationSearchParams = Record<string, string | string[] | undefined>;

export function normalizePaginationSearchParams(
  searchParams: PaginationSearchParams,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(searchParams).flatMap(([key, value]) => {
      if (value === undefined) return [];
      return [[key, Array.isArray(value) ? value.join(',') : value]];
    }),
  );
}

export function createPaginationHref(
  basePath: string,
  query: Readonly<Record<string, string>>,
  changes: Readonly<Record<string, string | number | null | undefined>>,
) {
  const searchParams = new URLSearchParams(query);

  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === undefined || value === '') searchParams.delete(key);
    else searchParams.set(key, String(value));
  }

  const serializedQuery = searchParams.toString();
  return serializedQuery ? `${basePath}?${serializedQuery}` : basePath;
}
