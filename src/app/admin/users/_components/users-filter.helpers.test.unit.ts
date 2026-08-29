import { describe, expect, it } from 'vitest';

import { parseUsersFilterSearchParams } from './users-filter.helpers';

describe('parseUsersFilterSearchParams', () => {
  it('normalizes URL strings into typed React Hook Form values', () => {
    expect(
      parseUsersFilterSearchParams({
        fullName: 'مریم',
        role: 'seller',
        phoneNumber: ['09123456789', 'ignored'],
        nationalCode: '0012345678',
        page: '3',
        limit: '50',
        isEnable: 'false',
        sort: 'dsc',
      }),
    ).toEqual({
      fullName: 'مریم',
      role: 'seller',
      phoneNumber: '09123456789',
      nationalCode: '0012345678',
      page: 3,
      limit: 50,
      isEnable: false,
      sort: 'dsc',
    });
  });

  it('falls back safely for missing or invalid URL values', () => {
    expect(
      parseUsersFilterSearchParams({
        role: 'unknown',
        page: '0',
        limit: 'NaN',
        isEnable: 'unknown',
        sort: 'descending',
      }),
    ).toEqual({
      fullName: '',
      role: '',
      phoneNumber: '',
      nationalCode: '',
      page: 1,
      limit: 20,
      isEnable: null,
      sort: '',
    });
  });
});
