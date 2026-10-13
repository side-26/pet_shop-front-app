import type { ArticleListDTO, ArticlePaginatedResponse } from '@/entities/articles/articles.dto';

export const articlesCatalogSkeletonItems: readonly ArticleListDTO[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `article-skeleton-${index}`,
    title: 'راهنمای نمونه برای مراقبت از حیوانات خانگی',
    subtitle: '',
    mainImage: '',
    mainThumbnailImage: '',
    summary: 'خلاصه‌ای از مقاله که فضای متن کارت را در حالت بارگذاری حفظ می‌کند.',
    tags: [],
    petType: null,
    author: { image: '', thumbnailImage: '', fullName: '' },
    slug: `article-skeleton-${index}`,
    createdAt: '',
    updatedAt: '',
  }),
);

export const articlesCatalogSkeletonData: ArticlePaginatedResponse = {
  result: [...articlesCatalogSkeletonItems],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 6,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  },
  metadata: {
    tags: [],
    petTypes: [],
    sort: { current: 'newest', options: [] },
  },
};
