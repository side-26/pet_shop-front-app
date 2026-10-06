'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryProfileOrdersAction } from '@/entities/profile/profile.actions';

export function ProfileOrdersFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryProfileOrdersAction}
      title="دریافت سفارش‌ها انجام نشد"
    />
  );
}
