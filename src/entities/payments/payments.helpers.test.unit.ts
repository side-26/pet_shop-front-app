import { describe, expect, it } from 'vitest';

import { createPaymentsListCacheKey } from './payments.helpers';

describe('createPaymentsListCacheKey', () => {
  it('is deterministic and omits optional filters that are absent', () => {
    expect(createPaymentsListCacheKey({ sort: 'createdAt', limit: 10, page: 1 })).toBe(
      'limit=10&page=1&sort=createdAt',
    );
    expect(createPaymentsListCacheKey({ page: 2, limit: 20, sort: 'amount', status: 'paid' })).toBe(
      'limit=20&page=2&sort=amount&status=paid',
    );
  });
});
