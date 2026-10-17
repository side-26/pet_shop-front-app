'use client';

import { createFetchErrorSectionBoundary } from '@/components/common/fetch-error-section';

export const UpdateMainTextDialogErrorBoundary = createFetchErrorSectionBoundary<{
  onQueryReset: () => void;
}>({
  description: 'هنگام دریافت متن مقاله خطایی رخ داد. دوباره تلاش کنید.',
  onRetry: ({ onQueryReset }, retry) => {
    onQueryReset();
    retry();
  },
  title: 'دریافت متن مقاله انجام نشد',
});
