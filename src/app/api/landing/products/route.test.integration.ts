import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { GET } from './route';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

describe('GET /api/landing/products', () => {
  beforeEach(() => vi.clearAllMocks());

  it('forwards validated public catalogue inputs without backend credentials', async () => {
    const page = { result: [], pagination: {} };
    vi.mocked(customFetcher).mockResolvedValue({ isSuccess: true, message: null, data: page });

    const response = await GET(
      new Request(
        'http://localhost/api/landing/products?brand=507f1f77bcf86cd799439011&page=2&limit=12&sort=less-valued&isEnable=false',
      ),
      undefined,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(page);
    expect(customFetcher).toHaveBeenCalledWith({
      url: '/landing/products',
      method: 'GET',
      query: {
        brand: '507f1f77bcf86cd799439011',
        isEnable: false,
        sort: 'less-valued',
        page: 2,
        limit: 12,
      },
      auth: false,
      cache: 'no-store',
    });
  });

  it('rejects invalid catalogue inputs before requesting the backend', async () => {
    const response = await GET(
      new Request('http://localhost/api/landing/products?page=0'),
      undefined,
    );

    expect(response.status).toBe(400);
    expect(customFetcher).not.toHaveBeenCalled();
  });
});
