'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function CategoriesSectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the home pet-type section.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش دسته‌بندی‌های حیوانات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت دسته‌بندی حیوانات انجام نشد"
    />
  );
}

export const CategoriesSectionErrorBoundary = catchError(CategoriesSectionErrorFallback);
