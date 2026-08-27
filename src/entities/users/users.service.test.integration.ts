import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';
import { getAllPaginatedUsers } from './users.service';

const { registerListMock } = vi.hoisted(() => ({ registerListMock: vi.fn() }));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: {
    list: string;
    registerList: ReturnType<typeof vi.fn>;
  }) {
    this.list = 'users:list';
    this.registerList = registerListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);
describe('getAllPaginatedUsers service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets the paginated users with the exact cached query contract', async () => {
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
      url: '/users/all-paginate',
      method: 'GET',
      query,
      auth: false,
      cache: 'force-cache',
      next: { tags: ['users:list'] },
    });
    expect(registerListMock).toHaveBeenCalledWith(
      'fullName=Ali&isEnable=true&limit=20&nationalCode=0012345678&page=2&phoneNumber=09123456789&role=admin&sort=asc',
    );
  });

  it('applies endpoint defaults before fetching and caching', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [] });

    await getAllPaginatedUsers();

    const query = { page: 1, limit: 20, isEnable: true };
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/all-paginate',
      method: 'GET',
      query,
      auth: false,
      cache: 'force-cache',
      next: { tags: ['users:list'] },
    });
    expect(registerListMock).toHaveBeenCalledWith('isEnable=true&limit=20&page=1');
  });
});
