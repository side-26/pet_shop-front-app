'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const UpdateTagsDialogErrorBoundary = createFetchErrorSectionBoundary<{
  onQueryReset: () => void;
}>({
  description: 'هنگام دریافت برچسب‌های مقاله خطایی رخ داد. دوباره تلاش کنید.',
  onRetry: ({ onQueryReset }, retry) => {
    onQueryReset();
    retry();
  },
  title: 'دریافت برچسب‌های مقاله انجام نشد',
});
