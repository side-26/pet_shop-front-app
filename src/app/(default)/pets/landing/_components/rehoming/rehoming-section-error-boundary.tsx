'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const RehomingSectionErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش حیوانات آماده واگذاری خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت حیوانات آماده واگذاری انجام نشد',
});
