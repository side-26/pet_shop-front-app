import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { getCountries } from './countries.service';

const { registerListMock } = vi.hoisted(() => ({ registerListMock: vi.fn() }));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: {
    list: string;
    registerList: ReturnType<typeof vi.fn>;
  }) {
    this.list = 'countries:list';
    this.registerList = registerListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);

describe('getCountries service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets public countries through the full cache', async () => {
    const response = {
      isSuccess: true as const,
      message: null,
      data: [
        {
          title: 'Afghanistan',
          titleFa: 'افغانستان',
          logo: 'https://flagpedia.net/data/flags/h80/af.png',
        },
      ],
    };
    customFetcherMock.mockResolvedValue(response);

    await expect(getCountries()).resolves.toBe(response);
    expect(registerListMock).toHaveBeenCalledWith('all');
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/countries',
      method: 'GET',
      auth: false,
      cache: 'force-cache',
      next: { tags: ['countries:list'] },
    });
  });
});
