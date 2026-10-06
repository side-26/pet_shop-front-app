'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

function ProfileOrdersErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering profile orders.', error);

  return (
    <FetchErrorSectionBoundary
      description="هنگام نمایش سفارش‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت سفارش‌ها انجام نشد"
    />
  );
}

export const ProfileOrdersErrorBoundary = catchError(ProfileOrdersErrorFallback);
