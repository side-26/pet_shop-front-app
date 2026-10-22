'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const WishListErrorBoundary = createFetchErrorSectionBoundary({
  description: (error) =>
    error instanceof Error && error.message.trim()
      ? error.message
      : 'نمایش علاقه‌مندی‌ها انجام نشد. دوباره تلاش کنید.',
  title: 'دریافت علاقه‌مندی‌ها انجام نشد',
});
