import { use } from 'react';

import { ArticlePreviewEmptyFetchSection } from '@/components/articles/article-preview/article-preview-empty-fetch-section';
import { ArticlePreviewRenderer } from '@/components/articles/article-preview/article-preview-renderer';
import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { getArticlePreviewBySlugAction } from '@/entities/articles/articles.actions';

import { ArticleDetailTagFilterSection } from './article-detail-tag-filter-section';

type ArticleDetailContentProps = Readonly<{
  articlePromise: ReturnType<typeof getArticlePreviewBySlugAction>;
}>;

export function ArticleDetailContent({ articlePromise }: ArticleDetailContentProps) {
  const article = use(articlePromise);

  return (
    <EmptyStateBoundary
      data={article}
      fallback={<ArticlePreviewEmptyFetchSection />}
      isEmpty={() => !article?.id}
    >
      <ArticlePreviewRenderer
        article={article}
        tagsSection={<ArticleDetailTagFilterSection tags={article.tags} />}
      />
    </EmptyStateBoundary>
  );
}
