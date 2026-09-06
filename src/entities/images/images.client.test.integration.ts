import { beforeEach, describe, expect, it, vi } from 'vitest';

import { uploadFetcher } from '@/lib/api/uploadFetcher';

import { deleteImageAction } from './images.actions';
import {
  readRichTextImageAsDataUrl,
  removeRichTextDraftImage,
  removePersistedRichTextImage,
  richTextDraftImageUrls,
  uploadImage,
  uploadRichTextDraftImage,
  uploadRichTextImages,
} from './images.client';

vi.mock('@/lib/api/uploadFetcher', () => ({ uploadFetcher: vi.fn() }));
vi.mock('./images.actions', () => ({ deleteImageAction: vi.fn() }));

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

  it('keeps selected rich-text images local until submit', async () => {
    const file = new File(['image'], 'article.webp', { type: 'image/webp' });

    await expect(
      readRichTextImageAsDataUrl(file, { signal: new AbortController().signal }),
    ).resolves.toMatch(/^data:image\/webp;base64,/);
    expect(uploadFetcher).not.toHaveBeenCalled();
  });

  it('uploads only local images that remain in the submitted document', async () => {
    const request = Object.assign(
      Promise.resolve({
        isSuccess: true as const,
        message: null,
        data: { imageUrl: 'https://cdn.example.test/rich-text.webp' },
      }),
      { abort: vi.fn() },
    );
    vi.mocked(uploadFetcher).mockReturnValue(request);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(new Blob(['image'], { type: 'image/webp' })),
      }),
    );
    const content = {
      type: 'doc' as const,
      content: [
        { type: 'image', attrs: { src: 'https://cdn.example.test/kept.webp' } },
        { type: 'image', attrs: { src: 'data:image/webp;base64,aW1hZ2U=' } },
      ],
    };

    await expect(uploadRichTextImages(content)).resolves.toEqual({
      type: 'doc',
      content: [
        { type: 'image', attrs: { src: 'https://cdn.example.test/kept.webp' } },
        { type: 'image', attrs: { src: 'https://cdn.example.test/rich-text.webp' } },
      ],
    });

    expect(uploadFetcher).toHaveBeenCalledTimes(1);
    expect(content.content[1]?.attrs?.src).toBe('data:image/webp;base64,aW1hZ2U=');
    expect(richTextDraftImageUrls.get('data:image/webp;base64,aW1hZ2U=')).toBe(
      'https://cdn.example.test/rich-text.webp',
    );
  });

  it('removes a completed background upload when its local draft image is removed', async () => {
    const request = Object.assign(
      Promise.resolve({
        isSuccess: true as const,
        message: null,
        data: { imageUrl: 'https://cdn.example.test/removed.webp' },
      }),
      { abort: vi.fn() },
    );
    vi.mocked(uploadFetcher).mockReturnValue(request);
    vi.mocked(deleteImageAction).mockResolvedValue({
      isSuccess: true,
      message: 'deleted',
      data: undefined,
    });
    const source = 'data:image/webp;base64,cmVtb3ZlZA==';

    await uploadRichTextDraftImage(
      source,
      new File(['image'], 'removed.webp', { type: 'image/webp' }),
      vi.fn(),
    );
    await Promise.resolve();
    await removeRichTextDraftImage(source);

    expect(request.abort).toHaveBeenCalled();
    expect(deleteImageAction).toHaveBeenCalledWith({
      imageUrl: 'https://cdn.example.test/removed.webp',
    });
    expect(richTextDraftImageUrls.has(source)).toBe(false);
  });

  it('removes a persisted rich-text image on edit when its node is deleted', async () => {
    vi.mocked(deleteImageAction).mockResolvedValue({
      isSuccess: true,
      message: 'deleted',
      data: undefined,
    });
    const imageUrl = 'https://cdn.example.test/existing.webp';

    await expect(removePersistedRichTextImage(imageUrl)).resolves.toBe(true);
    expect(deleteImageAction).toHaveBeenCalledWith({ imageUrl });
  });
});
