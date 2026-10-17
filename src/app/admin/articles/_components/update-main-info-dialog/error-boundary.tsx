'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const UpdateMainInfoDialogErrorBoundary = createFetchErrorSectionBoundary<{
  onQueryReset: () => void;
}>({
  description: 'هنگام دریافت اطلاعات اصلی مقاله خطایی رخ داد. دوباره تلاش کنید.',
  onRetry: ({ onQueryReset }, retry) => {
    onQueryReset();
    retry();
  },
  title: 'دریافت اطلاعات مقاله انجام نشد',
});
