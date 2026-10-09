'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

export function CheckoutDeliveryServicesFetchError({
  description,
  onRetry,
}: Readonly<{ description?: string | null; onRetry: () => void }>) {
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={onRetry}
      title="دریافت سرویس‌های ارسال انجام نشد"
    />
  );
}
