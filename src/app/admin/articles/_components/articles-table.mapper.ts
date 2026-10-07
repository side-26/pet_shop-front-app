import type { ArticleDTO } from '@/entities/articles/articles.dto';

import type { ArticleTableRow } from './articles-table.types';

export function mapArticlesTableRows(articles: ArticleDTO[]): ArticleTableRow[] {
  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    petType: article.petType,
    tags: article.tags.slice(0, 5).map(({ title }) => title),
    summary: article.summary,
    mainImage: article.mainImage,
    mainThumbnailImage: article.mainThumbnailImage,
  }));
}
