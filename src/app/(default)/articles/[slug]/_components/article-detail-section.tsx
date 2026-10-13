import { Suspense } from 'react';

import { ArticlePreviewErrorBoundary } from '@/components/articles/article-preview/article-preview-error-boundary';
import { ArticlePreviewRenderer } from '@/components/articles/article-preview/article-preview-renderer';
import { getArticlePreviewBySlugAction } from '@/entities/articles/articles.actions';

import { ArticleDetailContent } from './article-detail-content';

type ArticleDetailSectionProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function ArticleDetailSection({ params }: ArticleDetailSectionProps) {
  const articlePromise = params.then(({ slug }) => getArticlePreviewBySlugAction({ slug }));

  return (
    <main>
      <ArticlePreviewErrorBoundary>
        <Suspense fallback={<ArticlePreviewRenderer isSkeleton />}>
          <ArticleDetailContent articlePromise={articlePromise} />
        </Suspense>
      </ArticlePreviewErrorBoundary>
    </main>
  );
}
