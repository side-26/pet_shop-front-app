'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function ArticlesTableErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the articles table.', error);

  return (
    <FetchErrorSection
      description="هنگام نمایش مقاله‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت مقاله‌ها انجام نشد"
    />
  );
}

export const ArticlesTableErrorBoundary = catchError(ArticlesTableErrorFallback);
