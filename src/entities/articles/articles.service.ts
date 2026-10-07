import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';
import { toArticleDTO } from './articles.dto';

import type {
  ArticleDTO,
  ArticleIdDTO,
  ArticleSlugDTO,
  CreateArticleDTO,
  UpdateArticleDTO,
  UpdateArticleMainTextDTO,
} from './articles.dto';

const articlesCache = new EntityTag('articles');

export async function getArticlePreviewBySlug(slug: ArticleSlugDTO['slug']) {
  'use cache';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerDetail(slug);

  return customFetcher<ArticleDTO>({
    url: `/articles/${encodeURIComponent(slug)}`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
    parseSuccess: toArticleDTO,
  });
}

export async function createArticle(input: CreateArticleDTO) {
  const result = await customFetcher<ArticleDTO, unknown, CreateArticleDTO>({
    url: '/articles',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
    parseSuccess: toArticleDTO,
  });

  if (result.isSuccess) articlesCache.invalidateAll();
  return result;
}

export async function updateArticle(id: ArticleIdDTO['id'], input: UpdateArticleDTO) {
  const result = await customFetcher<ArticleDTO, unknown, UpdateArticleDTO>({
    url: `/articles/id/${id}`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
    parseSuccess: toArticleDTO,
  });

  if (result.isSuccess) articlesCache.invalidateAll();
  return result;
}

export async function updateArticleMainText(
  id: ArticleIdDTO['id'],
  input: UpdateArticleMainTextDTO,
) {
  const result = await customFetcher<ArticleDTO, unknown, UpdateArticleMainTextDTO>({
    url: `/articles/id/${id}/main-text`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
    parseSuccess: toArticleDTO,
  });

  if (result.isSuccess) articlesCache.invalidateAll();
  return result;
}

export async function deleteArticle(id: ArticleIdDTO['id']) {
  const result = await customFetcher<void>({
    url: `/articles/id/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) articlesCache.invalidateAll();
  return result;
}
