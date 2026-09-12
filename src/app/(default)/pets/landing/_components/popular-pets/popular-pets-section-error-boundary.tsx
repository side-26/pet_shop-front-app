'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function PopularPetsSectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the pets landing popular-pets section.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش حیوانات پرطرفدار خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت حیوانات پرطرفدار انجام نشد"
    />
  );
}

export const PopularPetsSectionErrorBoundary = catchError(PopularPetsSectionErrorFallback);
