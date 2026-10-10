import type { ArticleTagDTO } from '@/entities/articles/articles.dto';

export type ArticleTableRow = {
  id: string;
  title: string;
  petTypeTitle: string | null;
  tags: ArticleTagDTO[];
  summary: string;
  mainImage: string;
  mainThumbnailImage: string;
};
