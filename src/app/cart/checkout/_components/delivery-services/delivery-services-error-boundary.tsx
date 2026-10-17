'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const CheckoutDeliveryServicesErrorBoundary = createFetchErrorSectionBoundary({
  description: 'هنگام نمایش سرویس‌های ارسال خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'نمایش سرویس‌های ارسال انجام نشد',
});
