import { beforeEach, describe, expect, it, vi } from 'vitest';

import { uploadFetcher } from '@/lib/api/uploadFetcher';

import { uploadImage } from './images.client';

vi.mock('@/lib/api/uploadFetcher', () => ({ uploadFetcher: vi.fn() }));

describe('image client upload', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends the image as mainImage through the same-origin progress endpoint', () => {
    const request = Object.assign(
      Promise.resolve({ isSuccess: true as const, message: null, data: { imageUrl: 'url' } }),
      {
        abort: vi.fn(),
      },
    );
    vi.mocked(uploadFetcher).mockReturnValue(request);
    const image = new File(['image'], 'main.webp', { type: 'image/webp' });
    const onProgress = vi.fn();

    expect(uploadImage({ mainImage: image }, onProgress)).toBe(request);
    const options = vi.mocked(uploadFetcher).mock.calls[0]?.[0];
    expect(options).toMatchObject({ url: '/api/images', onProgress, withCredentials: true });
    expect(options?.body).toBeInstanceOf(FormData);
    expect((options?.body as FormData).get('mainImage')).toBe(image);
  });
});
