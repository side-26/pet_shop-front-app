'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryProfileOrderSummaryAction } from '@/entities/profile/profile.actions';

export function UserOrderSummarySectionFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryProfileOrderSummaryAction}
      title="دریافت خلاصه سفارش‌ها انجام نشد"
    />
  );
}
