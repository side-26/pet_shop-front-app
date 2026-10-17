'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const OffersSectionErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش پیشنهادهای شگفت‌انگیز خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت پیشنهادها انجام نشد',
});
