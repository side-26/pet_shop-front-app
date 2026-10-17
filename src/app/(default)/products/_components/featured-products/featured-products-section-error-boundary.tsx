'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const FeaturedProductsSectionErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش محصولات محبوب خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت محصولات محبوب انجام نشد',
});
