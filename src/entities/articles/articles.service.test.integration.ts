import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  createArticle,
  deleteArticle,
  getArticlePreviewBySlug,
  getArticleById,
  getArticleMainTextById,
  getArticleTags,
  getCurrentUserArticles,
  invalidateCurrentUserArticles,
  updateArticle,
  updateArticleMainText,
  replaceArticleTags,
} from './articles.service';

const {
  cacheLifeMock,
  invalidateAllMock,
  invalidateQueryMock,
  registerDetailMock,
  registerListMock,
} = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  invalidateAllMock: vi.fn(),
  invalidateQueryMock: vi.fn(),
  registerDetailMock: vi.fn(),
  registerListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = cacheLifeMock;
    this.invalidateAll = invalidateAllMock;
    this.invalidateQuery = invalidateQueryMock;
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
  }),
}));

const id = '507f1f77bcf86cd799439011';
const input = {
  title: 'راهنمای مراقبت از سگ',
  subtitle: 'آنچه برای شروع باید بدانید',
  mainImage: new File(['image'], 'dog.webp', { type: 'image/webp' }),
  mainText: { type: 'doc' as const, content: [] },
};
const tags = [{ title: 'سگ' }];
const article = {
  ...input,
  mainImage: 'https://cdn.example.test/articles/dog.webp',
  mainThumbnailImage: 'data:image/webp;base64,AAAA',
  id,
  summary: '',
  tags,
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
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerDetailMock).toHaveBeenCalledWith('dog care/one');
  });

  it('gets only the authenticated user articles through a private tagged cache', async () => {
    const response = { isSuccess: true as const, message: null, data: [article] };
    vi.mocked(customFetcher).mockResolvedValue(response);

    await expect(getCurrentUserArticles()).resolves.toBe(response);
    expect(customFetcher).toHaveBeenCalledWith({
      url: '/article/all',
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledWith('current-author');
  });

  it('reads public article details, main text, and tags through their dedicated endpoints', async () => {
    const details = { isSuccess: true as const, message: null, data: article };
    const mainText = {
      isSuccess: true as const,
      message: null,
      data: { mainText: input.mainText },
    };
    const tagResult = { isSuccess: true as const, message: null, data: tags };
    vi.mocked(customFetcher)
      .mockResolvedValueOnce(details)
      .mockResolvedValueOnce(mainText)
      .mockResolvedValueOnce(tagResult);

    await expect(getArticleById(id)).resolves.toBe(details);
    await expect(getArticleMainTextById(id)).resolves.toBe(mainText);
    await expect(getArticleTags(id)).resolves.toBe(tagResult);

    expect(customFetcher).toHaveBeenNthCalledWith(1, {
      url: `/articles/id/${id}`,
      method: 'GET',
      auth: false,
      cache: 'no-store',
    });
    expect(customFetcher).toHaveBeenNthCalledWith(2, {
      url: `/articles/id/${id}/main-text`,
      method: 'GET',
      auth: false,
      cache: 'no-store',
    });
    expect(customFetcher).toHaveBeenNthCalledWith(3, {
      url: `/articles/id/${id}/tags-list`,
      method: 'GET',
      auth: false,
      cache: 'no-store',
    });
  });

  it('invalidates only the current-author collection before retrying it', () => {
    invalidateCurrentUserArticles();

    expect(invalidateQueryMock).toHaveBeenCalledWith('current-author');
  });

  it('uses the exact authenticated bodies and endpoints for every mutation', async () => {
    vi.mocked(customFetcher).mockResolvedValue({ isSuccess: true, message: 'ok', data: article });

    await createArticle(input);
    await updateArticle(id, { title: 'عنوان تازه' });
    await updateArticleMainText(id, { mainText: input.mainText });
    await deleteArticle(id);
    await replaceArticleTags(id, { tags: [{ title: 'سگ' }] });

    expect(customFetcher).toHaveBeenNthCalledWith(1, {
      url: '/articles',
      method: 'POST',
      body: expect.any(FormData),
      auth: true,
      cache: 'no-store',
    });
    expect(customFetcher).toHaveBeenNthCalledWith(2, {
      url: `/articles/id/${id}`,
      method: 'PUT',
      body: expect.any(FormData),
      auth: true,
      cache: 'no-store',
    });
    expect(customFetcher).toHaveBeenNthCalledWith(3, {
      url: `/articles/id/${id}/main-text`,
      method: 'PUT',
      body: { mainText: input.mainText },
      auth: true,
      cache: 'no-store',
    });
    expect(customFetcher).toHaveBeenNthCalledWith(4, {
      url: `/articles/id/${id}`,
      method: 'DELETE',
      auth: true,
      cache: 'no-store',
    });
    expect(customFetcher).toHaveBeenNthCalledWith(5, {
      url: `/articles/id/${id}/range-tags-list`,
      method: 'PUT',
      body: { tags: [{ title: 'سگ' }] },
      auth: true,
      cache: 'no-store',
    });
    const createBody = vi.mocked(customFetcher).mock.calls[0]?.[0].body as FormData;
    const updateBody = vi.mocked(customFetcher).mock.calls[1]?.[0].body as FormData;
    expect(createBody.get('mainImage')).toBe(input.mainImage);
    expect(createBody.get('mainText')).toBe(JSON.stringify(input.mainText));
    expect(updateBody.get('title')).toBe('عنوان تازه');
    expect(invalidateAllMock).toHaveBeenCalledTimes(5);
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
    await replaceArticleTags(id, { tags: [{ title: 'سگ' }] });

    expect(invalidateAllMock).not.toHaveBeenCalled();
  });
});
