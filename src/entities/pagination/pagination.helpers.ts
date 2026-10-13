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

/** Changes the selected sort and restarts a paginated result set from its first page. */
export function createPaginationSortHref(
  basePath: string,
  query: Readonly<Record<string, string>>,
  sort: string,
) {
  return createPaginationHref(basePath, query, { page: 1, sort });
}

/** Changes or clears one scalar filter and restarts a paginated result set from its first page. */
export function createPaginationSingleFilterHref(
  basePath: string,
  query: Readonly<Record<string, string>>,
  key: string,
  value: string | null | undefined,
) {
  return createPaginationHref(basePath, query, { page: 1, [key]: value });
}

/** Toggles one value in a comma-delimited range filter without modifying unrelated query parameters. */
export function togglePaginationRangeFilterValue(
  query: Readonly<Record<string, string>>,
  key: string,
  value: string,
) {
  const values = new Set(
    (query[key] ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );

  if (values.has(value)) values.delete(value);
  else values.add(value);

  return [...values];
}

/** Toggles one value in a comma-delimited range filter and restarts pagination from page one. */
export function createPaginationRangeFilterHref(
  basePath: string,
  query: Readonly<Record<string, string>>,
  key: string,
  value: string,
) {
  const values = togglePaginationRangeFilterValue(query, key, value);
  return createPaginationHref(basePath, query, { page: 1, [key]: values.join(',') || null });
}
