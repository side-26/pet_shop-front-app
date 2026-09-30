'use client';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

export function CheckoutDeliveryServicesFetchError({
  description,
  onRetry,
}: Readonly<{ description?: string | null; onRetry: () => void }>) {
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={onRetry}
      title="دریافت سرویس‌های ارسال انجام نشد"
    />
  );
}
