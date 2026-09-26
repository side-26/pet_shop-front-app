'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryProfileOrderSummaryAction } from '@/entities/profile/profile.actions';

export function UserOrderSummarySectionFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryProfileOrderSummaryAction}
      title="دریافت خلاصه سفارش‌ها انجام نشد"
    />
  );
}
