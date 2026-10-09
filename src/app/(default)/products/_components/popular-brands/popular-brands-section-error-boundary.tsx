'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function PopularBrandsSectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error(
    'Unexpected error while rendering the products landing popular brands section.',
    error,
  );
  return (
    <FetchErrorSection
      description="هنگام نمایش برندهای محبوب خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت برندهای محبوب انجام نشد"
    />
  );
}

export const PopularBrandsSectionErrorBoundary = catchError(PopularBrandsSectionErrorFallback);
