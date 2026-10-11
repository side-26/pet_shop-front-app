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
});
