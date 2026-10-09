'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function RehomingSectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the pets landing rehoming section.', error);

  return (
    <FetchErrorSection
      description="هنگام نمایش حیوانات آماده واگذاری خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت حیوانات آماده واگذاری انجام نشد"
    />
  );
}

export const RehomingSectionErrorBoundary = catchError(RehomingSectionErrorFallback);
