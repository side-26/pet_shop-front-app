import type { ArticlePetTypeDTO, ArticleTagDTO } from '@/entities/articles/articles.dto';

export type ArticleTableRow = {
  id: string;
  slug: string;
  title: string;
  petType: ArticlePetTypeDTO | null;
  tags: ArticleTagDTO[];
  summary: string;
  mainImage: string;
  mainThumbnailImage: string;
};
