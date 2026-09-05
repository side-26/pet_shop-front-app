import { describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { deleteImage } from './images.service';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

describe('image service', () => {
  it('deletes an image through the protected images endpoint', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: true,
      message: 'deleted',
      data: undefined,
    });
    const input = { imageUrl: 'https://cdn.example.test/management/images/main.webp' };

    await expect(deleteImage(input)).resolves.toMatchObject({ isSuccess: true });
    expect(customFetcher).toHaveBeenCalledWith({
      url: '/images',
      method: 'DELETE',
      body: input,
      auth: true,
      cache: 'no-store',
    });
  });
});
