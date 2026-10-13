import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  ArticleDTO,
  ArticleDetailsDTO,
  ArticleIdDTO,
  ArticleListDTO,
  ArticleMainTextDTO,
  ArticlePaginatedResponse,
  ArticlePaginationDTO,
  ArticleRelatedResponse,
  ArticleTagDTO,
  ArticleSlugDTO,
  CreateArticleDTO,
  UpdateArticleDTO,
  UpdateArticleMainTextDTO,
  ReplaceArticleTagsDTO,
} from './articles.dto';
import {
  toArticleDetailsResponse,
  toArticleListResponses,
  toArticlePaginatedResponse,
  toArticleRelatedResponse,
  toArticleResponse,
} from './articles.dto';
import { articlePaginationSchema } from './articles.schema';

const articlesCache = new EntityTag('articles');

export async function getArticlePreviewBySlug(slug: ArticleSlugDTO['slug']) {
  'use cache';

  articlesCache.cacheLife({ stale: 300, revalidate: 21_600, expire: 86_400 });
  articlesCache.registerDetail(slug);

  return customFetcher<ArticleDTO>({
    url: `/articles/${slug}`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
    parseSuccess: toArticleResponse,
  });
}

export async function getArticleById(id: ArticleIdDTO['id']) {
  'use cache';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerDetail(id);

  return customFetcher<ArticleDetailsDTO>({
    url: `/articles/id/${id}`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
    parseSuccess: toArticleDetailsResponse,
  });
}

export async function getArticleMainTextById(id: ArticleIdDTO['id']) {
  'use cache';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerDetail(id);

  return customFetcher<ArticleMainTextDTO>({
    url: `/articles/id/${id}/main-text`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
  });
}

export async function getArticleTagsById(id: ArticleIdDTO['id']) {
  'use cache';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerDetail(id);

  return customFetcher<ArticleTagDTO[]>({
    url: `/articles/id/${id}/tags-list`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
  });
}

export async function getArticleRelatedBySlug(slug: ArticleSlugDTO['slug']) {
  'use cache';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerDetail(slug);

  return customFetcher<ArticleRelatedResponse>({
    url: `/articles/${slug}/tags-list/matched-articles`,
    method: 'GET',
    auth: false,
    cache: 'no-store',
    parseSuccess: toArticleRelatedResponse,
  });
}

export async function getPaginatedArticles(input: Partial<ArticlePaginationDTO> = {}) {
  const query = await articlePaginationSchema.validate(input, { stripUnknown: true });
  return fetchPaginatedArticles(query);
}

async function fetchPaginatedArticles(query: ArticlePaginationDTO) {
  'use cache';

  const queryEntries: [string, string][] = [
    ['limit', String(query.limit)],
    ['page', String(query.page)],
    ['sort', query.sort],
  ];
  for (const tag of [...(query.tags ?? [])].sort()) queryEntries.push(['tags', tag]);
  if (query.petType) queryEntries.push(['petType', query.petType]);
  const queryKey = new URLSearchParams(queryEntries).toString();
  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerList(`public:${queryKey}`);

  return customFetcher<ArticlePaginatedResponse>({
    url: '/articles/paginate',
    method: 'GET',
    query,
    auth: false,
    cache: 'no-store',
    parseSuccess: toArticlePaginatedResponse,
  });
}

export async function getCurrentUserArticles() {
  'use cache: private';

  articlesCache.cacheLife({ stale: 600 });
  articlesCache.registerList('current-author');
  return customFetcher<ArticleListDTO[]>({
    url: '/articles/all',
    method: 'GET',
    auth: true,
    cache: 'no-store',
    parseSuccess: toArticleListResponses,
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
