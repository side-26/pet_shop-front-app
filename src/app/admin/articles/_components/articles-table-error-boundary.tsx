'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const ArticlesTableErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش مقاله‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت مقاله‌ها انجام نشد',
});
