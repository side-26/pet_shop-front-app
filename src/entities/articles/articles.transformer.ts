import type { FetcherResult } from '@/lib/api/customFetcher';
import { transformResult } from '@/lib/api/transform-result';

import { toArticleDTO, toArticleListDTOs } from './articles.dto';
import type { ArticleDTO, ArticleListDTO } from './articles.dto';

export const transformArticleResult = (result: FetcherResult<ArticleDTO>) =>
  transformResult(result, toArticleDTO);

export const transformArticleListResult = (result: ArticleListDTO[]) =>
  transformResult(result, toArticleListDTOs);
