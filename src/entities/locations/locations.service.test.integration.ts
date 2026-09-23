import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { getCitiesByProvinceId, getProvinces } from './locations.service';

const { registerListMock } = vi.hoisted(() => ({ registerListMock: vi.fn() }));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: { registerList: ReturnType<typeof vi.fn> }) {
    this.registerList = registerListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);

describe('locations API service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('gets public provinces through the locations cache scope', async () => {
    const response = {
      isSuccess: true as const,
      message: null,
      data: [{ provinceId: 8, title: 'تهران', latLng: [35.6892, 51.389] as const }],
    };
    customFetcherMock.mockResolvedValue(response);

    await expect(getProvinces()).resolves.toBe(response);
    expect(registerListMock).toHaveBeenCalledWith('provinces');
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/provinces',
      method: 'GET',
      auth: false,
    });
  });

  it('gets public cities for the requested province through a distinct cache scope', async () => {
    const response = {
      isSuccess: true as const,
      message: null,
      data: [{ provinceId: 8, title: 'تهران' }],
    };
    customFetcherMock.mockResolvedValue(response);

    await expect(getCitiesByProvinceId({ provinceId: 8 })).resolves.toBe(response);
    expect(registerListMock).toHaveBeenCalledWith('cities:8');
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/cities/8',
      method: 'GET',
      auth: false,
    });
  });
});
