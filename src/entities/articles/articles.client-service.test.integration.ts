import { describe, expect, it, vi } from 'vitest';

import { internalFetcher } from '@/lib/api/internalFetcher';

import { articlesClientService } from './articles.client-service';

vi.mock('@/lib/api/internalFetcher', () => ({ internalFetcher: vi.fn() }));

describe('article client service', () => {
  it('reads an article through the same-origin internal API and forwards cancellation', async () => {
    const signal = new AbortController().signal;
    const id = '507f1f77bcf86cd799439011';
    const article = { id, title: 'راهنمای مراقبت از سگ' };
    vi.mocked(internalFetcher).mockResolvedValue(article);

    await expect(articlesClientService.getById(id, signal)).resolves.toBe(article);
    expect(internalFetcher).toHaveBeenCalledWith({
      url: `/api/articles/${id}`,
      method: 'GET',
      signal,
    });
  });

  it('reads article main text through the same-origin internal API and forwards cancellation', async () => {
    const signal = new AbortController().signal;
    const id = '507f1f77bcf86cd799439011';
    const articleMainText = { mainText: { type: 'doc' as const, content: [] } };
    vi.mocked(internalFetcher).mockResolvedValue(articleMainText);

    await expect(articlesClientService.getMainTextById(id, signal)).resolves.toBe(articleMainText);
    expect(internalFetcher).toHaveBeenCalledWith({
      url: `/api/articles/${id}/main-text`,
      method: 'GET',
      signal,
    });
  });

  it('reads article tags through the same-origin internal API and forwards cancellation', async () => {
    const signal = new AbortController().signal;
    const id = '507f1f77bcf86cd799439011';
    const tags = [{ title: 'سگ' }];
    vi.mocked(internalFetcher).mockResolvedValue(tags);

    await expect(articlesClientService.getTagsById(id, signal)).resolves.toBe(tags);
    expect(internalFetcher).toHaveBeenCalledWith({
      url: `/api/articles/${id}/tags`,
      method: 'GET',
      signal,
    });
  });
});
