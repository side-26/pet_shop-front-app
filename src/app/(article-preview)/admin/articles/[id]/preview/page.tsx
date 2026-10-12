import { Suspense } from 'react';

import { getArticlePreviewByIdAction } from '@/entities/articles/articles.actions';

import { ArticlePreviewRenderer } from './_components/article-preview-renderer';
import { ArticlePreviewSection } from './_components/article-preview-section';

type ArticlePreviewPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

async function ArticlePreviewRouteContent({ params }: ArticlePreviewPageProps) {
  const { id } = await params;
  const articlePromise = getArticlePreviewByIdAction({ id });

  return <ArticlePreviewSection articlePromise={articlePromise} />;
}

export default function ArticlePreviewPage({ params }: ArticlePreviewPageProps) {
  return (
    <Suspense fallback={<ArticlePreviewRenderer isSkeleton />}>
      <ArticlePreviewRouteContent params={params} />
    </Suspense>
  );
}
