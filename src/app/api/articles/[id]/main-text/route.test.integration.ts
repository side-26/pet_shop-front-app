import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { GET } from './route';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

const id = '507f1f77bcf86cd799439011';
const mainText = { type: 'doc' as const, content: [] };

describe('GET /api/articles/[id]/main-text', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the server-fetched public article text without exposing a backend credential', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { mainText },
    });

    const response = await GET(new Request(`http://localhost/api/articles/${id}/main-text`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ mainText });
    expect(customFetcher).toHaveBeenCalledWith({
      url: `/articles/id/${id}/main-text`,
      method: 'GET',
      auth: false,
      cache: 'no-store',
    });
  });

  it('preserves an upstream HTTP failure through the internal API error contract', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: false,
      message: 'متن مقاله پیدا نشد.',
      status: 404,
      data: { messages: {}, details: {} },
    });

    const response = await GET(new Request(`http://localhost/api/articles/${id}/main-text`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      isSuccess: false,
      message: 'متن مقاله پیدا نشد.',
    });
  });

  it('rejects malformed route IDs before requesting the backend', async () => {
    const response = await GET(new Request('http://localhost/api/articles/not-an-id/main-text'), {
      params: Promise.resolve({ id: 'not-an-id' }),
    });

    expect(response.status).toBe(400);
    expect(customFetcher).not.toHaveBeenCalled();
  });
});
