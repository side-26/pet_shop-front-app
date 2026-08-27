import { describe, expect, it } from 'vitest';

import { createUsersListCacheKey } from './users.helpers';
import { getAllPaginatedUsersSchema } from './users.schema';

describe('getAllPaginatedUsersSchema', () => {
  it('applies the documented pagination and enabled defaults', async () => {
    await expect(getAllPaginatedUsersSchema.validate({})).resolves.toEqual({
      page: 1,
      limit: 20,
      isEnable: true,
    });
  });

  it('accepts documented filters and sort values', async () => {
    const input = {
      fullName: '  Ali Rezaei  ',
      role: 'admin',
      phoneNumber: '09123456789',
      nationalCode: '0012345678',
      page: 2,
      limit: 50,
      isEnable: false,
      sort: 'dsc',
    } as const;

    await expect(getAllPaginatedUsersSchema.validate(input)).resolves.toEqual({
      ...input,
      fullName: 'Ali Rezaei',
    });
  });

  it.each([{ page: 0 }, { limit: 0 }, { sort: 'desc' }, { role: 'owner' }])(
    'rejects invalid query input %#',
    async (input) => {
      await expect(getAllPaginatedUsersSchema.validate(input)).rejects.toThrow();
    },
  );
});

describe('createUsersListCacheKey', () => {
  it('creates the same deterministic key regardless of object property order', () => {
    const first = { page: 2, limit: 20, isEnable: true, role: 'admin' as const };
    const second = { role: 'admin' as const, isEnable: true, limit: 20, page: 2 };

    expect(createUsersListCacheKey(first)).toBe(createUsersListCacheKey(second));
  });
});
