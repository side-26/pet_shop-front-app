import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';
import { getAllPaginatedUsers } from './users.service';

const { cacheLifeMock, registerListMock } = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  registerListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: {
    cacheLife: ReturnType<typeof vi.fn>;
    registerList: ReturnType<typeof vi.fn>;
  }) {
    this.cacheLife = cacheLifeMock;
    this.registerList = registerListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);
describe('getAllPaginatedUsers service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets paginated users through an authenticated private cache', async () => {
    const query = {
      fullName: 'Ali',
      role: 'admin' as const,
      phoneNumber: '09123456789',
      nationalCode: '0012345678',
      page: 2,
      limit: 20,
      isEnable: true,
      sort: 'asc' as const,
    };
    const response = { isSuccess: true as const, message: null, data: { items: [] } };
    customFetcherMock.mockResolvedValue(response);

    await expect(getAllPaginatedUsers(query)).resolves.toEqual(response);

    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/paginate',
      method: 'GET',
      query,
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledWith(
      'fullName=Ali&isEnable=true&limit=20&nationalCode=0012345678&page=2&phoneNumber=09123456789&role=admin&sort=asc',
    );
  });

  it('applies endpoint defaults before the authenticated request', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [] });

    await getAllPaginatedUsers();

    const query = { page: 1, limit: 20, isEnable: true };
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/paginate',
      method: 'GET',
      query,
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledWith('isEnable=true&limit=20&page=1');
  });
});
