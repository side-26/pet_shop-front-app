import { internalFetcher } from '@/lib/api/internalFetcher';

import type {
  ArticleDetailsResponse,
  ArticleIdDTO,
  ArticleMainTextResponse,
  ArticlePaginatedResponse,
  ArticlePaginationDTO,
  ArticleTagResponse,
} from './articles.dto';

export const articlesClientService = {
  getPaginated(
    query: Partial<ArticlePaginationDTO>,
    signal?: AbortSignal,
  ): Promise<ArticlePaginatedResponse> {
    return internalFetcher<ArticlePaginatedResponse>({
      url: '/api/articles/paginate',
      method: 'GET',
      query,
      signal,
    });
  },
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
  getTagsById(id: ArticleIdDTO['id'], signal?: AbortSignal): Promise<ArticleTagResponse[]> {
    return internalFetcher<ArticleTagResponse[]>({
      url: `/api/articles/${encodeURIComponent(id)}/tags`,
      method: 'GET',
      signal,
    });
  },
};
