import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  ArticleDTO,
  ArticleDetailsDTO,
  ArticleIdDTO,
  ArticleMainTextDTO,
  ArticleTagDTO,
  ArticleSlugDTO,
  CreateArticleDTO,
  UpdateArticleDTO,
  UpdateArticleMainTextDTO,
  ReplaceArticleTagsDTO,
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
  });
}

export async function getCurrentUserArticles() {
  'use cache: private';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerList('current-author');
  return customFetcher<ArticleDTO[]>({
    url: '/article/all',
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function getArticleById(id: ArticleIdDTO['id']) {
  'use cache';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerDetail(`id:${id}`);

  return customFetcher<ArticleDetailsDTO>({
    url: `/articles/id/${encodeURIComponent(id)}`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
  });
}

export async function getArticleMainTextById(id: ArticleIdDTO['id']) {
  'use cache';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerDetail(`main-text:${id}`);

  return customFetcher<ArticleMainTextDTO>({
    url: `/articles/id/${encodeURIComponent(id)}/main-text`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
  });
}

export async function getArticleTags(id: ArticleIdDTO['id']) {
  'use cache';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerDetail(`tags:${id}`);

  return customFetcher<ArticleTagDTO[]>({
    url: `/articles/id/${encodeURIComponent(id)}/tags-list`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
  });
}

export function invalidateCurrentUserArticles() {
  articlesCache.invalidateQuery('current-author');
}

function toArticleFormData(input: CreateArticleDTO | UpdateArticleDTO) {
  const body = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value == null) continue;
    if (key === 'mainImage' && value instanceof File) body.set(key, value);
    else body.set(key, key === 'mainText' ? JSON.stringify(value) : String(value));
  }
  return body;
}

export async function createArticle(input: CreateArticleDTO) {
  const result = await customFetcher<ArticleDTO, unknown, FormData>({
    url: '/articles',
    method: 'POST',
    body: toArticleFormData(input),
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) articlesCache.invalidateAll();
  return result;
}

export async function updateArticle(id: ArticleIdDTO['id'], input: UpdateArticleDTO) {
  const result = await customFetcher<ArticleDTO, unknown, FormData>({
    url: `/articles/id/${id}`,
    method: 'PUT',
    body: toArticleFormData(input),
    auth: true,
    cache: 'no-store',
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
  });

  if (result.isSuccess) articlesCache.invalidateAll();
  return result;
}

export async function replaceArticleTags(id: ArticleIdDTO['id'], input: ReplaceArticleTagsDTO) {
  const result = await customFetcher<ArticleTagDTO[], unknown, ReplaceArticleTagsDTO>({
    url: `/articles/id/${encodeURIComponent(id)}/range-tags-list`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
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
