'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const ProfileAddressesErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش نشانی‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت نشانی‌ها انجام نشد',
});
