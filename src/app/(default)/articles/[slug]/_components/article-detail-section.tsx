import { Suspense } from 'react';

import { ArticlePreviewContent } from '@/components/articles/article-preview/article-preview-content';
import { ArticlePreviewErrorBoundary } from '@/components/articles/article-preview/article-preview-error-boundary';
import { ArticlePreviewRenderer } from '@/components/articles/article-preview/article-preview-renderer';
import { getArticlePreviewBySlugAction } from '@/entities/articles/articles.actions';

type ArticleDetailSectionProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function ArticleDetailSection({ params }: ArticleDetailSectionProps) {
  const articlePromise = params.then(({ slug }) => getArticlePreviewBySlugAction({ slug }));

  return (
    <main>
      <ArticlePreviewErrorBoundary>
        <Suspense fallback={<ArticlePreviewRenderer isSkeleton />}>
          <ArticlePreviewContent articlePromise={articlePromise} />
        </Suspense>
      </ArticlePreviewErrorBoundary>
    </main>
  );
}
