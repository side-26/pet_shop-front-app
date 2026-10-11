'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function ArticlePreviewErrorFallback(_: object, { retry }: ErrorInfo) {
  return (
    <FetchErrorSection
      title="دریافت پیش‌نمایش مقاله انجام نشد"
      description="هنگام دریافت پیش‌نمایش خطایی رخ داد. دوباره تلاش کنید."
      onRetry={retry}
    />
  );
}

export const ArticlePreviewErrorBoundary = catchError(ArticlePreviewErrorFallback);
