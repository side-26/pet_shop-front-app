import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  createArticle,
  deleteArticle,
  getArticlePreviewBySlug,
  updateArticle,
  updateArticleMainText,
} from './articles.service';

const { cacheLifeMock, invalidateAllMock, registerDetailMock } = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  invalidateAllMock: vi.fn(),
  registerDetailMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = cacheLifeMock;
    this.invalidateAll = invalidateAllMock;
    this.registerDetail = registerDetailMock;
  }),
}));

const id = '507f1f77bcf86cd799439011';
const input = {
  title: 'راهنمای مراقبت از سگ',
  subtitle: 'آنچه برای شروع باید بدانید',
  mainImage: 'https://cdn.example.test/articles/dog.webp',
  mainThumbnailImage: 'data:image/webp;base64,AAAA',
  mainText: { type: 'doc' as const, content: [] },
  tags: [{ title: 'سگ' }],
};
const article = {
  ...input,
  id,
  summary: '',
  petType: null,
  author: { avatar: '', placeholderImage: '', firstName: 'سارا', lastName: 'احمدی' },
  slug: 'راهنمای-مراقبت-از-سگ-سگ',
  createdAt: '2026-10-07T00:00:00.000Z',
  updatedAt: '2026-10-07T00:00:00.000Z',
};

describe('article service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('gets a public slug preview through the tagged shared cache', async () => {
    const response = { isSuccess: true as const, message: null, data: article };
    vi.mocked(customFetcher).mockResolvedValue(response);

    await expect(getArticlePreviewBySlug('dog care/one')).resolves.toBe(response);
    expect(customFetcher).toHaveBeenCalledWith({
      url: '/articles/dog%20care%2Fone',
      method: 'GET',
      auth: false,
      cache: 'no-store',
      parseSuccess: expect.any(Function),
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerDetailMock).toHaveBeenCalledWith('dog care/one');
  });

  it('uses the exact authenticated bodies and endpoints for every mutation', async () => {
    vi.mocked(customFetcher).mockResolvedValue({ isSuccess: true, message: 'ok', data: article });

    await createArticle(input);
    await updateArticle(id, { title: 'عنوان تازه' });
    await updateArticleMainText(id, { mainText: input.mainText });
    await deleteArticle(id);

    expect(customFetcher).toHaveBeenNthCalledWith(1, {
      url: '/articles',
      method: 'POST',
      body: input,
      auth: true,
      cache: 'no-store',
      parseSuccess: expect.any(Function),
    });
    expect(customFetcher).toHaveBeenNthCalledWith(2, {
      url: `/articles/id/${id}`,
      method: 'PUT',
      body: { title: 'عنوان تازه' },
      auth: true,
      cache: 'no-store',
      parseSuccess: expect.any(Function),
    });
    expect(customFetcher).toHaveBeenNthCalledWith(3, {
      url: `/articles/id/${id}/main-text`,
      method: 'PUT',
      body: { mainText: input.mainText },
      auth: true,
      cache: 'no-store',
      parseSuccess: expect.any(Function),
    });
    expect(customFetcher).toHaveBeenNthCalledWith(4, {
      url: `/articles/id/${id}`,
      method: 'DELETE',
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateAllMock).toHaveBeenCalledTimes(4);
  });

  it('does not invalidate previews after a failed mutation', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });

    await createArticle(input);
    await updateArticle(id, { summary: 'خلاصه تازه' });
    await updateArticleMainText(id, { mainText: input.mainText });
    await deleteArticle(id);

    expect(invalidateAllMock).not.toHaveBeenCalled();
  });
});
