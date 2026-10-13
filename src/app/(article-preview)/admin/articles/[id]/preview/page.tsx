import { Suspense } from 'react';

import { ArticlePreviewContent } from '@/components/articles/article-preview/article-preview-content';
import { ArticlePreviewErrorBoundary } from '@/components/articles/article-preview/article-preview-error-boundary';
import { ArticlePreviewRenderer } from '@/components/articles/article-preview/article-preview-renderer';
import { getArticlePreviewBySlugAction } from '@/entities/articles/articles.actions';

import { ArticlePreviewBackButton } from './_components/article-preview-back-button';

type ArticlePreviewPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

async function ArticlePreviewRouteContent({ params }: ArticlePreviewPageProps) {
  const { id: slug } = await params;
  const articlePromise = getArticlePreviewBySlugAction({ slug });

  return <ArticlePreviewContent articlePromise={articlePromise} />;
}

export default function ArticlePreviewPage({ params }: ArticlePreviewPageProps) {
  return (
    <>
      <ArticlePreviewBackButton />
      <ArticlePreviewErrorBoundary>
        <Suspense fallback={<ArticlePreviewRenderer isSkeleton />}>
          <ArticlePreviewRouteContent params={params} />
        </Suspense>
      </ArticlePreviewErrorBoundary>
    </>
  );
}
