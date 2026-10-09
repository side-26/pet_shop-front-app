'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryCurrentUserArticlesAction } from '@/entities/articles/articles.actions';

type ArticlesTableFetchErrorProps = Readonly<{ description?: string | null }>;

export function ArticlesTableFetchError({ description }: ArticlesTableFetchErrorProps) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryCurrentUserArticlesAction}
      title="دریافت مقاله‌ها انجام نشد"
    />
  );
}
