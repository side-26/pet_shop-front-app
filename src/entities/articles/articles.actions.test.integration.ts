import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSession } from '@/utils/session';

import {
  createArticleAction,
  getArticlePreviewBySlugAction,
  updateArticleAction,
  updateArticleMainTextAction,
} from './articles.actions';
import * as service from './articles.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./articles.service', () => ({
  createArticle: vi.fn(),
  getArticlePreviewBySlug: vi.fn(),
  updateArticle: vi.fn(),
  updateArticleMainText: vi.fn(),
  deleteArticle: vi.fn(),
}));

const id = '507f1f77bcf86cd799439011';
const session = { accessToken: 'access-token', userId: 'user-1', role: 'seller' };
const input = {
  title: 'راهنمای مراقبت از سگ',
  subtitle: 'آنچه برای شروع باید بدانید',
  mainImage: 'https://cdn.example.test/articles/dog.webp',
  mainThumbnailImage: 'data:image/webp;base64,AAAA',
  mainText: { type: 'doc' as const, content: [] },
  tags: [],
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

    await expect(getArticlePreviewBySlugAction({ slug: '  dog-care  ' })).resolves.toBe(response);
    expect(service.getArticlePreviewBySlug).toHaveBeenCalledWith('dog-care');
  });

  it('validates create and update input before calling their services', async () => {
    const response = { isSuccess: true as const, message: 'ok', data: {} as never };
    vi.mocked(service.createArticle).mockResolvedValue(response);
    vi.mocked(service.updateArticle).mockResolvedValue(response);
    vi.mocked(service.updateArticleMainText).mockResolvedValue(response);

    await expect(createArticleAction(input)).resolves.toBe(response);
    await expect(updateArticleAction({ id, summary: 'خلاصه تازه' })).resolves.toBe(response);
    await expect(updateArticleMainTextAction({ id, mainText: input.mainText })).resolves.toBe(
      response,
    );

    expect(service.createArticle).toHaveBeenCalledWith(input);
    expect(service.updateArticle).toHaveBeenCalledWith(id, { summary: 'خلاصه تازه' });
    expect(service.updateArticleMainText).toHaveBeenCalledWith(id, { mainText: input.mainText });
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
});
