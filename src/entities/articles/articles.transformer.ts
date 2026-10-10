import type { FetcherResult } from '@/lib/api/customFetcher';
import { transformResult } from '@/lib/api/transform-result';

import {
  toArticleDetailsDTO,
  toArticleDTO,
  toArticleListDTOs,
  toArticleMainTextDTO,
  toArticleTagsDTO,
} from './articles.dto';
import type {
  ArticleDTO,
  ArticleDetailsDTO,
  ArticleListDTO,
  ArticleMainTextDTO,
  ArticleTagDTO,
} from './articles.dto';

export const transformArticleResult = (result: FetcherResult<ArticleDTO>) =>
  transformResult(result, toArticleDTO);

export const transformArticleListResult = (result: ArticleListDTO[]) =>
  transformResult(result, toArticleListDTOs);

export const transformArticleDetailsResult = (result: FetcherResult<ArticleDetailsDTO>) =>
  transformResult(result, toArticleDetailsDTO);

export const transformArticleMainTextResult = (result: FetcherResult<ArticleMainTextDTO>) =>
  transformResult(result, toArticleMainTextDTO);

export const transformArticleTagsResult = (result: FetcherResult<ArticleTagDTO[]>) =>
  transformResult(result, toArticleTagsDTO);
