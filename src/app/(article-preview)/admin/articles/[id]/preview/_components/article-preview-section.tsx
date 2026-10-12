import { Suspense } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import type { getArticlePreviewByIdAction } from '@/entities/articles/articles.actions';

import { ArticlePreviewContent } from './article-preview-content';
import { ArticlePreviewRenderer } from './article-preview-renderer';

export function ArticlePreviewSection({
  articlePromise,
}: Readonly<{ articlePromise: ReturnType<typeof getArticlePreviewByIdAction> }>) {
  return (
    <Suspense fallback={<ArticlePreviewRenderer isSkeleton />}>
      <ErrorStateBoundary
        fallbackRender={({ retry }) => (
          <FetchErrorSection
            title="نمایش پیش‌نمایش مقاله انجام نشد"
            description="هنگام نمایش پیش‌نمایش خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
            onRetry={retry}
          />
        )}
      >
        <ArticlePreviewContent articlePromise={articlePromise} />
      </ErrorStateBoundary>
    </Suspense>
  );
}
