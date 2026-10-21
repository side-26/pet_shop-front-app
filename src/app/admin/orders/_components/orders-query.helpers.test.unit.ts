import { describe, expect, it } from 'vitest';

import { getOrdersRequestedPage, toOrdersQuery } from './orders-query.helpers';

describe('orders query helpers', () => {
  it('keeps only supported scalar query parameters', () => {
    expect(
      toOrdersQuery({
        page: ['2', '3'],
        limit: '20',
        sort: 'totalPrice',
        deliveryState: '2',
        ignored: 'value',
      }),
    ).toEqual({ page: '2', limit: '20', sort: 'totalPrice', deliveryState: '2' });
  });

  it.each([
    [{ page: '3' }, 3],
    [{ page: 'invalid' }, 1],
    [{ page: '0' }, 1],
    [{}, 1],
  ] as const)('returns a safe requested page for %o', (query, expected) => {
    expect(getOrdersRequestedPage(query)).toBe(expected);
  });
});
