'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryProfileOrdersAction } from '@/entities/profile/profile.actions';

export function ProfileOrdersFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryProfileOrdersAction}
      title="دریافت سفارش‌ها انجام نشد"
    />
  );
}
