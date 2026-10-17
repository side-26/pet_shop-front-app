'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const PopularPetsSectionErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش حیوانات پرطرفدار خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت حیوانات پرطرفدار انجام نشد',
});
