import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { GET } from './route';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

describe('GET /api/landing/search', () => {
  beforeEach(() => vi.clearAllMocks());

  it('forwards validated public search inputs without a backend credential', async () => {
    const page = { result: [], pagination: {} };
    vi.mocked(customFetcher).mockResolvedValue({ isSuccess: true, message: null, data: page });

    const response = await GET(
      new Request('http://localhost/api/landing/search?search=%D8%BA%D8%B0%D8%A7&page=2&limit=12'),
      undefined,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(page);
    expect(customFetcher).toHaveBeenCalledWith({
      url: '/landing/search',
      method: 'GET',
      query: { search: 'غذا', page: 2, limit: 12 },
      auth: false,
      cache: 'no-store',
    });
  });

  it('rejects invalid inputs before requesting the backend', async () => {
    const response = await GET(
      new Request('http://localhost/api/landing/search?search=&page=0'),
      undefined,
    );

    expect(response.status).toBe(400);
    expect(customFetcher).not.toHaveBeenCalled();
  });
});
