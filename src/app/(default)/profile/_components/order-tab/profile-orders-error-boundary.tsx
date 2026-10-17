'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const ProfileOrdersErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش سفارش‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت سفارش‌ها انجام نشد',
});
