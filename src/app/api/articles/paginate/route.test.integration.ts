import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { GET } from './route';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

describe('GET /api/articles/paginate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('forwards a validated public catalog request without exposing a backend credential', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { result: [], pagination: {}, metadata: {} },
    });

    const response = await GET(
      new Request(
        'http://localhost/api/articles/paginate?tags=%D8%B3%DA%AF&tags=%D8%AA%D8%BA%D8%B0%DB%8C%D9%87&sort=oldest&page=2&limit=12',
      ),
      undefined,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ result: [], pagination: {}, metadata: {} });
    expect(customFetcher).toHaveBeenCalledWith({
      url: '/articles/paginate',
      method: 'GET',
      query: { tags: ['سگ', 'تغذیه'], sort: 'oldest', page: 2, limit: 12 },
      auth: false,
      cache: 'no-store',
      parseSuccess: expect.any(Function),
    });
  });

  it('rejects invalid query parameters before requesting the backend', async () => {
    const response = await GET(
      new Request('http://localhost/api/articles/paginate?page=0'),
      undefined,
    );

    expect(response.status).toBe(400);
    expect(customFetcher).not.toHaveBeenCalled();
  });
});
