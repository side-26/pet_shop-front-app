'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function OffersSectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the home offers section.', error);

  return (
    <FetchErrorSection
      description="هنگام نمایش پیشنهادهای شگفت‌انگیز خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت پیشنهادها انجام نشد"
    />
  );
}

export const OffersSectionErrorBoundary = catchError(OffersSectionErrorFallback);
