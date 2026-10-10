import type { ArticlePetTypeDTO, ArticleTagDTO } from '@/entities/articles/articles.dto';

export type ArticleTableRow = {
  id: string;
  title: string;
  petType: ArticlePetTypeDTO | null;
  tags: ArticleTagDTO[];
  summary: string;
  mainImage: string;
  mainThumbnailImage: string;
};
