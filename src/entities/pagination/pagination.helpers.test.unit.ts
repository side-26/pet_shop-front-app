import { describe, expect, it } from 'vitest';

import {
  createPaginationHref,
  createPaginationRangeFilterHref,
  createPaginationSingleFilterHref,
  createPaginationSortHref,
  normalizePaginationSearchParams,
  togglePaginationRangeFilterValue,
} from './pagination.helpers';

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

  it('creates first-page URLs for sort and scalar-filter changes', () => {
    expect(createPaginationSortHref('/articles', { tag: 'سگ', page: '3' }, 'oldest')).toBe(
      '/articles?tag=%D8%B3%DA%AF&page=1&sort=oldest',
    );
    expect(createPaginationSingleFilterHref('/articles', { sort: 'newest' }, 'tag', 'گربه')).toBe(
      '/articles?sort=newest&page=1&tag=%DA%AF%D8%B1%D8%A8%D9%87',
    );
    expect(createPaginationSingleFilterHref('/articles', { tag: 'سگ' }, 'tag', null)).toBe(
      '/articles?page=1',
    );
  });

  it('toggles values in a range filter and clears its query key once the final value is removed', () => {
    expect(togglePaginationRangeFilterValue({ tags: 'سگ,گربه' }, 'tags', 'گربه')).toEqual(['سگ']);
    expect(togglePaginationRangeFilterValue({ tags: 'سگ' }, 'tags', 'پرنده')).toEqual([
      'سگ',
      'پرنده',
    ]);
    expect(createPaginationRangeFilterHref('/articles', { tags: 'سگ' }, 'tags', 'سگ')).toBe(
      '/articles?page=1',
    );
  });
});
