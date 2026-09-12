import { describe, expect, it } from 'vitest';

import { createPaginationHref, normalizePaginationSearchParams } from './pagination.helpers';

describe('pagination helpers', () => {
  it('normalizes repeated search params without retaining undefined values', () => {
    expect(
      normalizePaginationSearchParams({ page: '2', brand: ['one', 'two'], missing: undefined }),
    ).toEqual({ page: '2', brand: 'one,two' });
  });

  it('preserves unrelated query state and removes cleared values', () => {
    expect(
      createPaginationHref(
        '/products/list',
        { page: '3', brand: 'acme', sort: 'price' },
        { page: 1, brand: null },
      ),
    ).toBe('/products/list?page=1&sort=price');
  });
});
