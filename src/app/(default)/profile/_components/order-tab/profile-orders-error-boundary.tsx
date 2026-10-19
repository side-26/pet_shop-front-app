'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

type Props = Readonly<{ onQueryReset?: () => void }>;

export const ProfileOrdersErrorBoundary = createFetchErrorSectionBoundary<Props>({
  description: (error) =>
    error instanceof Error && error.message
      ? error.message
      : 'هنگام نمایش سفارش‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت سفارش‌ها انجام نشد',
  onRetry: ({ onQueryReset }, retry) => {
    onQueryReset?.();
    retry();
  },
});
