import type { ArticleListDTO } from '@/entities/articles/articles.dto';
import { cn } from '@/lib/utils';

import { ArticleCard } from './article-card';

export const articleGridClassName =
  'tw:grid tw:grid-cols-2 tw:gap-3 tw:sm:gap-4 tw:lg:grid-cols-3 tw:lg:gap-5';

type ArticleGridProps = Readonly<{
  articles: readonly ArticleListDTO[];
  isSkeleton?: boolean;
}>;

export function ArticleGrid({ articles, isSkeleton = false }: ArticleGridProps) {
  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        articleGridClassName,
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} isSkeleton={isSkeleton} />
      ))}
    </div>
  );
}
