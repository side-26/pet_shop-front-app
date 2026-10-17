'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const ProductCategoriesSectionErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش دسته‌بندی محصولات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت دسته‌بندی محصولات انجام نشد',
});
