'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function ProfileOrdersErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering profile orders.', error);

  return (
    <FetchErrorSection
      description="هنگام نمایش سفارش‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت سفارش‌ها انجام نشد"
    />
  );
}

export const ProfileOrdersErrorBoundary = catchError(ProfileOrdersErrorFallback);
