'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryCurrentUserArticlesAction } from '@/entities/articles/articles.actions';

type ArticlesTableFetchErrorProps = Readonly<{ description?: string | null }>;

export function ArticlesTableFetchError({ description }: ArticlesTableFetchErrorProps) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryCurrentUserArticlesAction}
      title="دریافت مقاله‌ها انجام نشد"
    />
  );
}
