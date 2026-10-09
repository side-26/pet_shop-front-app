'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { retryProfileAddressesAction } from '@/entities/profile/profile.actions';

export function ProfileAddressesFetchError({
  description,
}: Readonly<{ description?: string | null }>) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={retryProfileAddressesAction}
      title="دریافت نشانی‌ها انجام نشد"
    />
  );
}
