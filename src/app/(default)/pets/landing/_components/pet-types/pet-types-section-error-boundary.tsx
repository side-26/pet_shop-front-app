'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const PetTypesSectionErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش دسته‌بندی‌های حیوانات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت دسته‌بندی‌ها انجام نشد',
});
