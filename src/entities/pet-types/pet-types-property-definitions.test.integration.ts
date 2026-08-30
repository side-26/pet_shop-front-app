import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';
import {
  getPetTypePropertyDefinitions,
  rangePetTypePropertyDefinitions,
} from './pet-types.service';

const { cacheLifeMock, invalidateDetailMock, invalidateListMock, registerDetailMock } = vi.hoisted(
  () => ({
    cacheLifeMock: vi.fn(),
    invalidateDetailMock: vi.fn(),
    invalidateListMock: vi.fn(),
    registerDetailMock: vi.fn(),
  }),
);

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = cacheLifeMock;
    this.registerDetail = registerDetailMock;
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);
const id = '507f1f77bcf86cd799439011';

describe('pet-type property-definition APIs', () => {
  beforeEach(() => vi.clearAllMocks());

  it('gets property definitions through the authenticated detail endpoint', async () => {
    const response = { isSuccess: true as const, message: null, data: { result: [] } };
    customFetcherMock.mockResolvedValue(response);

    await expect(getPetTypePropertyDefinitions(id)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: `/pet-types/property-definitions/${id}`,
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerDetailMock).toHaveBeenCalledWith(id);
  });

  it('ranges the exact JSON body and invalidates the affected caches only after success', async () => {
    const input = {
      id,
      propertyDefinitions: [
        { label: 'رنگ', value: 'قهوه‌ای' },
        { label: 'وزن', value: 12 },
      ],
    };
    customFetcherMock.mockResolvedValue({
      isSuccess: true,
      message: 'updated',
      data: { result: [] },
    });

    await rangePetTypePropertyDefinitions(input);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/pet-types/range',
      method: 'PUT',
      body: input,
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
    expect(invalidateListMock).toHaveBeenCalledOnce();
  });
});
