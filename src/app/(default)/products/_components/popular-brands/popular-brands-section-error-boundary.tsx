'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const PopularBrandsSectionErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش برندهای محبوب خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت برندهای محبوب انجام نشد',
});
