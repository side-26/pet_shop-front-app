'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function UpdateTagsDialogErrorFallback(
  { onQueryReset }: { onQueryReset: () => void },
  { retry }: ErrorInfo,
) {
  return (
    <FetchErrorSection
      title="دریافت برچسب‌های مقاله انجام نشد"
      description="هنگام دریافت برچسب‌های مقاله خطایی رخ داد. دوباره تلاش کنید."
      onRetry={() => {
        onQueryReset();
        retry();
      }}
    />
  );
}

export const UpdateTagsDialogErrorBoundary = catchError(UpdateTagsDialogErrorFallback);
