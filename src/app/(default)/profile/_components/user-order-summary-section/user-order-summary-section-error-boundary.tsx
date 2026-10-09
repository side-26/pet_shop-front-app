'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function UserOrderSummarySectionErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the user order summary section.', error);

  return (
    <FetchErrorSection
      description="هنگام نمایش خلاصه سفارش‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت خلاصه سفارش‌ها انجام نشد"
    />
  );
}

export const UserOrderSummarySectionErrorBoundary = catchError(
  UserOrderSummarySectionErrorFallback,
);
