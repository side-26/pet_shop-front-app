'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function PetTypesSectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the pets landing pet-type section.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش دسته‌بندی‌های حیوانات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت دسته‌بندی‌ها انجام نشد"
    />
  );
}

export const PetTypesSectionErrorBoundary = catchError(PetTypesSectionErrorFallback);
