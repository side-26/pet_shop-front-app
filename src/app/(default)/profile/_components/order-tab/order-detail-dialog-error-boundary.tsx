'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const OrderDetailDialogErrorBoundary = createFetchErrorSectionBoundary({
  description: 'دریافت جزئیات این سفارش ناموفق بود.',
  title: 'جزئیات سفارش در دسترس نیست',
});
