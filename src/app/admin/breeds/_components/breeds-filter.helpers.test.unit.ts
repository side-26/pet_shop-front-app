import { describe, expect, it } from 'vitest';

import { parseBreedsFilterSearchParams, toBreedsSearchParams } from './breeds-filter.helpers';

describe('breed filter URL state', () => {
  it('normalizes invalid pagination and preserves supported filters', () => {
    expect(
      parseBreedsFilterSearchParams({
        page: '-1',
        limit: '40',
        includeDisabled: 'false',
        sort: 'updatedAt',
        search: 'گلدن',
        title: 'رتریور',
        country: 'اسکاتلند',
        size: '0',
        activityLevel: '4',
      }),
    ).toMatchObject({
      page: 1,
      limit: 40,
      includeDisabled: false,
      sort: 'updatedAt',
      search: 'گلدن',
      title: 'رتریور',
      country: 'اسکاتلند',
      size: '0',
      activityLevel: '4',
    });
  });

  it('resets pagination and omits default filters from the URL', () => {
    const params = toBreedsSearchParams({
      page: 4,
      limit: 10,
      title: '',
      petType: '',
      country: '',
      size: '',
      activityLevel: '',
      search: '',
      includeDisabled: true,
      sort: 'title',
    });
    expect(params.toString()).toBe('page=1');
  });

  it('serializes every backend paginate filter and preserves level zero', () => {
    const params = toBreedsSearchParams({
      page: 3,
      limit: 40,
      title: 'پرشین',
      petType: '507f1f77bcf86cd799439011',
      country: 'ایران',
      size: '0',
      activityLevel: '3',
      search: 'مو بلند',
      includeDisabled: false,
      sort: 'updatedAt',
    });

    expect(Object.fromEntries(params)).toEqual({
      title: 'پرشین',
      petType: '507f1f77bcf86cd799439011',
      country: 'ایران',
      size: '0',
      activityLevel: '3',
      search: 'مو بلند',
      includeDisabled: 'false',
      sort: 'updatedAt',
      limit: '40',
      page: '1',
    });
  });
});
