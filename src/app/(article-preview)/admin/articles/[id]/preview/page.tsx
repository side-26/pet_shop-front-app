import { Suspense } from 'react';

import { getArticlePreviewBySlugAction } from '@/entities/articles/articles.actions';

import { ArticlePreviewContent } from './_components/article-preview-content';
import { ArticlePreviewBackButton } from './_components/article-preview-back-button';
import { ArticlePreviewErrorBoundary } from './_components/article-preview-error-boundary';
import { ArticlePreviewRenderer } from './_components/article-preview-renderer';

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
