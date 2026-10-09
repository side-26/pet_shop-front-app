'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function CheckoutDeliveryServicesErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering checkout delivery services.', error);

  return (
    <FetchErrorSection
      description="هنگام نمایش سرویس‌های ارسال خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="نمایش سرویس‌های ارسال انجام نشد"
    />
  );
}

export const CheckoutDeliveryServicesErrorBoundary = catchError(
  CheckoutDeliveryServicesErrorFallback,
);
