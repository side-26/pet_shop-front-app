import { Suspense } from 'react';

import type { getArticlePreviewByIdAction } from '@/entities/articles/articles.actions';

import { ArticlePreviewContent } from './article-preview-content';
import { ArticlePreviewErrorBoundary } from './article-preview-error-boundary';
import { ArticlePreviewRenderer } from './article-preview-renderer';

export function ArticlePreviewSection({
  articlePromise,
}: Readonly<{ articlePromise: ReturnType<typeof getArticlePreviewByIdAction> }>) {
  return (
    <Suspense fallback={<ArticlePreviewRenderer isSkeleton />}>
      <ArticlePreviewErrorBoundary>
        <ArticlePreviewContent articlePromise={articlePromise} />
      </ArticlePreviewErrorBoundary>
    </Suspense>
  );
}
