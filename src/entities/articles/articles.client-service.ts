import { internalFetcher } from '@/lib/api/internalFetcher';

import type {
  ArticleDetailsResponse,
  ArticleIdDTO,
  ArticleMainTextResponse,
  ArticleTagResponse,
} from './articles.dto';

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
  getTagsById(id: ArticleIdDTO['id'], signal?: AbortSignal): Promise<ArticleTagResponse[]> {
    return internalFetcher<ArticleTagResponse[]>({
      url: `/api/articles/${encodeURIComponent(id)}/tags`,
      method: 'GET',
      signal,
    });
  },
};
