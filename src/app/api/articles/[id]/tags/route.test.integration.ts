import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { GET } from './route';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

const id = '507f1f77bcf86cd799439011';
const tags = [{ title: 'سگ' }];

describe('GET /api/articles/[id]/tags', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns server-fetched public article tags without exposing a backend credential', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: tags,
    });

    const response = await GET(new Request(`http://localhost/api/articles/${id}/tags`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(tags);
    expect(customFetcher).toHaveBeenCalledWith({
      url: `/articles/id/${id}/tags-list`,
      method: 'GET',
      auth: false,
      cache: 'no-store',
    });
  });

  it('preserves an upstream HTTP failure through the internal API error contract', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: false,
      message: 'برچسب‌های مقاله پیدا نشد.',
      status: 404,
      data: { messages: {}, details: {} },
    });

    const response = await GET(new Request(`http://localhost/api/articles/${id}/tags`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      isSuccess: false,
      message: 'برچسب‌های مقاله پیدا نشد.',
    });
  });

  it('rejects malformed route IDs before requesting the backend', async () => {
    const response = await GET(new Request('http://localhost/api/articles/not-an-id/tags'), {
      params: Promise.resolve({ id: 'not-an-id' }),
    });

    expect(response.status).toBe(400);
    expect(customFetcher).not.toHaveBeenCalled();
  });
});
