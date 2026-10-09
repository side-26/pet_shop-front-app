'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function OrderDetailDialogErrorFallback(_: object, { retry }: ErrorInfo) {
  return (
    <FetchErrorSection
      description="دریافت جزئیات این سفارش ناموفق بود."
      onRetry={retry}
      title="جزئیات سفارش در دسترس نیست"
    />
  );
}

export const OrderDetailDialogErrorBoundary = catchError(OrderDetailDialogErrorFallback);
