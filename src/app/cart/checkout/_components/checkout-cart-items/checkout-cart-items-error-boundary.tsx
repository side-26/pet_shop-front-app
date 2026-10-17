'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const CheckoutCartItemsErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش کالاهای سفارش خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'نمایش سبد خرید انجام نشد',
});
