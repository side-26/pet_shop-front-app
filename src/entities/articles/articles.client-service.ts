import { internalFetcher } from '@/lib/api/internalFetcher';

import type { ArticleDetailsResponse, ArticleIdDTO, ArticleMainTextResponse } from './articles.dto';

export const articlesClientService = {
  getById(id: ArticleIdDTO['id'], signal?: AbortSignal): Promise<ArticleDetailsResponse> {
    return internalFetcher<ArticleDetailsResponse>({
      url: `/api/articles/${encodeURIComponent(id)}`,
      method: 'GET',
      signal,
    });
  },
  getMainTextById(id: ArticleIdDTO['id'], signal?: AbortSignal): Promise<ArticleMainTextResponse> {
    return internalFetcher<ArticleMainTextResponse>({
      url: `/api/articles/${encodeURIComponent(id)}/main-text`,
      method: 'GET',
      signal,
    });
  },
};
