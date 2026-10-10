import type { ArticleTableRow } from './articles-table.types';

const SKELETON_THUMBNAIL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';

export const articlesTableSkeletonData: ArticleTableRow[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `skeleton-article-${index + 1}`,
    title: 'عنوان مقاله',
    petTypeTitle: 'نوع حیوان',
    tags: [{ title: 'برچسب' }],
    summary: 'خلاصه مقاله',
    mainImage: SKELETON_THUMBNAIL,
    mainThumbnailImage: SKELETON_THUMBNAIL,
  }),
);
