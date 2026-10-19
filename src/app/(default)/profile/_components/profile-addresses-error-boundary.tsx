'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

type Props = Readonly<{ onQueryReset?: () => void }>;

export const ProfileAddressesErrorBoundary = createFetchErrorSectionBoundary<Props>({
  description: (error) =>
    error instanceof Error && error.message
      ? error.message
      : 'هنگام نمایش نشانی‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.',
  title: 'دریافت نشانی‌ها انجام نشد',
  onRetry: ({ onQueryReset }, retry) => {
    onQueryReset?.();
    retry();
  },
});
