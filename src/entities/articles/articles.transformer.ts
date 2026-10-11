import type { FetcherResult } from '@/lib/api/customFetcher';
import { transformResult } from '@/lib/api/transform-result';

import { toArticleDTO, toArticleListDTOs, toArticleTagsDTO } from './articles.dto';
import type { ArticleDTO, ArticleListDTO, ArticleTagDTO } from './articles.dto';

export const transformArticleResult = (result: FetcherResult<ArticleDTO>) =>
  transformResult(result, toArticleDTO);

export const transformArticleListResult = (result: ArticleListDTO[]) =>
  transformResult(result, toArticleListDTOs);

export const transformArticleTagsResult = (result: FetcherResult<ArticleTagDTO[]>) =>
  transformResult(result, toArticleTagsDTO);
