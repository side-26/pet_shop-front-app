'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
function UpdateMainInfoDialogErrorFallback(
  { onQueryReset }: { onQueryReset: () => void },
  { retry }: ErrorInfo,
) {
  return (
    <FetchErrorSection
      title="دریافت اطلاعات مقاله انجام نشد"
      description="هنگام دریافت اطلاعات اصلی مقاله خطایی رخ داد. دوباره تلاش کنید."
      onRetry={() => {
        onQueryReset();
        retry();
      }}
    />
  );
}

export const UpdateMainInfoDialogErrorBoundary = catchError(UpdateMainInfoDialogErrorFallback);
