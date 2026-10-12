import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { getArticlePreviewByIdAction } from '@/entities/articles/articles.actions';

import { ArticlePreviewEmptyFetchSection } from './article-preview-empty-fetch-section';
import { ArticlePreviewRenderer } from './article-preview-renderer';

type Props = Readonly<{
  articlePromise: ReturnType<typeof getArticlePreviewByIdAction>;
}>;

export function ArticlePreviewContent({ articlePromise }: Props) {
  const article = use(articlePromise);

  return (
    <EmptyStateBoundary
      data={article}
      fallback={<ArticlePreviewEmptyFetchSection />}
      isEmpty={() => !article?.id}
    >
      <ArticlePreviewRenderer article={article} />
    </EmptyStateBoundary>
  );
}
