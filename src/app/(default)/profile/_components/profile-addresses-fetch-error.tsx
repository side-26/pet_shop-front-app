'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryProfileAddressesAction } from '@/entities/profile/profile.actions';

export function ProfileAddressesFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={retryProfileAddressesAction}
      title="دریافت نشانی‌ها انجام نشد"
    />
  );
}
