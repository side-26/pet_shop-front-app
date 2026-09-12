'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function FeaturedProductsSectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the popular products section.', error);
  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش محصولات محبوب خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت محصولات محبوب انجام نشد"
    />
  );
}

export const FeaturedProductsSectionErrorBoundary = catchError(
  FeaturedProductsSectionErrorFallback,
);
