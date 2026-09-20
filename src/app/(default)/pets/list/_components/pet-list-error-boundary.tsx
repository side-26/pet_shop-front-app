'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function PetListErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the pet catalogue.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش فهرست حیوانات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت فهرست حیوانات انجام نشد"
    />
  );
}

export const PetListErrorBoundary = catchError(PetListErrorFallback);
