import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSession } from '@/utils/session';

import {
  createArticleAction,
  getCurrentUserArticlesAction,
  getArticlePreviewBySlugAction,
  getArticleByIdAction,
  getArticleMainTextByIdAction,
  replaceArticleTagsAction,
  updateArticleAction,
  updateArticleMainTextAction,
} from './articles.actions';
import * as service from './articles.service';

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }));

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('next/cache', () => ({ refresh: refreshMock }));
vi.mock('./articles.service', () => ({
  createArticle: vi.fn(),
  getCurrentUserArticles: vi.fn(),
  invalidateCurrentUserArticles: vi.fn(),
  getArticlePreviewBySlug: vi.fn(),
  getArticleById: vi.fn(),
  getArticleMainTextById: vi.fn(),
  getArticleTags: vi.fn(),
  replaceArticleTags: vi.fn(),
  updateArticle: vi.fn(),
  updateArticleMainText: vi.fn(),
  deleteArticle: vi.fn(),
}));

const id = '507f1f77bcf86cd799439011';
const session = { accessToken: 'access-token', userId: 'user-1', role: 'seller' };
const input = {
  title: 'راهنمای مراقبت از سگ',
  subtitle: 'آنچه برای شروع باید بدانید',
  mainImage: new File(['image'], 'dog.webp', { type: 'image/webp' }),
  mainText: { type: 'doc' as const, content: [] },
};

describe('article actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(session as never);
  });

  it('allows public preview without a session and validates its slug', async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    const response = { isSuccess: true as const, message: null, data: {} as never };
    vi.mocked(service.getArticlePreviewBySlug).mockResolvedValue(response);

    await getArticlePreviewBySlugAction({ slug: '  dog-care  ' });
    expect(service.getArticlePreviewBySlug).toHaveBeenCalledWith('dog-care');
  });

  it('returns the authenticated user article collection from the service', async () => {
    const response = {
      isSuccess: true as const,
      message: null,
      data: [{ id, petType: { title: 'سگ' } }] as never[],
    };
    vi.mocked(service.getCurrentUserArticles).mockResolvedValue(response);

    await expect(getCurrentUserArticlesAction()).resolves.toEqual([
      { id, petType: { title: 'سگ' } },
    ]);
    expect(service.getCurrentUserArticles).toHaveBeenCalledOnce();
  });

  it('validates public ID reads before delegating to their services', async () => {
    const response = { isSuccess: true as const, message: null, data: {} as never };
    vi.mocked(service.getArticleById).mockResolvedValue(response);
    vi.mocked(service.getArticleMainTextById).mockResolvedValue(response);

    await getArticleByIdAction({ id });
    await getArticleMainTextByIdAction({ id });
    expect(service.getArticleById).toHaveBeenCalledWith(id);
    expect(service.getArticleMainTextById).toHaveBeenCalledWith(id);
  });

  it('invalidates the current-author collection and refreshes the route on retry', async () => {
    const { retryCurrentUserArticlesAction } = await import('./articles.actions');

    await expect(retryCurrentUserArticlesAction()).resolves.toBeUndefined();
    expect(service.invalidateCurrentUserArticles).toHaveBeenCalledOnce();
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('validates create and update input before calling their services', async () => {
    const response = { isSuccess: true as const, message: 'ok', data: {} as never };
    vi.mocked(service.createArticle).mockResolvedValue(response);
    vi.mocked(service.updateArticle).mockResolvedValue(response);
    vi.mocked(service.updateArticleMainText).mockResolvedValue(response);

    await expect(createArticleAction(input)).resolves.toMatchObject({ isSuccess: true });
    await expect(updateArticleAction({ id, summary: 'خلاصه تازه' })).resolves.toMatchObject({
      isSuccess: true,
    });
    await expect(
      updateArticleMainTextAction({ id, mainText: input.mainText }),
    ).resolves.toMatchObject({
      isSuccess: true,
    });

    expect(service.createArticle).toHaveBeenCalledWith(input);
    expect(service.updateArticle).toHaveBeenCalledWith(id, { summary: 'خلاصه تازه' });
    expect(service.updateArticleMainText).toHaveBeenCalledWith(id, { mainText: input.mainText });
  });

  it('validates and delegates tag replacements separately', async () => {
    const response = { isSuccess: true as const, message: 'ok', data: [] as never[] };
    vi.mocked(service.replaceArticleTags).mockResolvedValue(response);

    await expect(replaceArticleTagsAction({ id, tags: [{ title: 'سگ' }] })).resolves.toMatchObject({
      isSuccess: true,
    });
    expect(service.replaceArticleTags).toHaveBeenCalledWith(id, { tags: [{ title: 'سگ' }] });
  });

  it('returns validation errors without reaching the service', async () => {
    const result = await updateArticleAction({ id });

    expect(result.isSuccess).toBe(false);
    expect(service.updateArticle).not.toHaveBeenCalled();
  });

  it('rejects mutations for anonymous callers', async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const result = await createArticleAction(input);

    expect(result.isSuccess).toBe(false);
    expect(service.createArticle).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated user-article reads before reaching the service', async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await expect(getCurrentUserArticlesAction()).rejects.toThrow(
      'برای مدیریت مقاله وارد حساب شوید.',
    );
    expect(service.getCurrentUserArticles).not.toHaveBeenCalled();
  });
});
