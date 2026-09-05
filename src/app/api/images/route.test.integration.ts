import { describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { POST } from './route';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

describe('POST /api/images', () => {
  it('forwards multipart uploads through the server-authenticated backend transport', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: true,
      message: 'uploaded',
      data: { imageUrl: 'https://cdn.example.test/management/images/main.webp' },
    });
    const body = new FormData();
    const image = new File(['image'], 'main.webp', { type: 'image/webp' });
    body.set('mainImage', image);

    const response = await POST(
      new Request('http://localhost/api/images', { method: 'POST', body }),
    );

    expect(response.status).toBe(201);
    expect(customFetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/images',
        method: 'POST',
        body: expect.anything(),
        auth: true,
        cache: 'no-store',
      }),
    );
    expect(
      (vi.mocked(customFetcher).mock.calls[0]?.[0].body as FormData).get('mainImage'),
    ).toBeTruthy();
  });
});
