export type OrdersSearchParams = Record<string, string | string[] | undefined>;

const QUERY_KEYS = ['page', 'limit', 'sort', 'deliveryState'] as const;

export function toOrdersQuery(searchParams: OrdersSearchParams): Record<string, string> {
  return Object.fromEntries(
    QUERY_KEYS.flatMap((key) => {
      const value = searchParams[key];
      const firstValue = Array.isArray(value) ? value[0] : value;
      return firstValue === undefined ? [] : [[key, firstValue]];
    }),
  );
}

export function getOrdersRequestedPage(query: Readonly<Record<string, string>>) {
  const page = Number(query.page);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
