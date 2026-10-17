'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const UserOrderSummarySectionErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش خلاصه سفارش‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت خلاصه سفارش‌ها انجام نشد',
});
