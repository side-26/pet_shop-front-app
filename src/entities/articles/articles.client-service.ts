import { internalFetcher } from '@/lib/api/internalFetcher';

import type { ArticleDetailsResponse, ArticleIdDTO } from './articles.dto';

export const articlesClientService = {
  getById(id: ArticleIdDTO['id'], signal?: AbortSignal): Promise<ArticleDetailsResponse> {
    return internalFetcher<ArticleDetailsResponse>({
      url: `/api/articles/${encodeURIComponent(id)}`,
      method: 'GET',
      signal,
    });
  },
};
