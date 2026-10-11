'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function UpdateMainTextDialogErrorFallback(
  { onQueryReset }: { onQueryReset: () => void },
  { retry }: ErrorInfo,
) {
  return (
    <FetchErrorSection
      title="دریافت متن مقاله انجام نشد"
      description="هنگام دریافت متن مقاله خطایی رخ داد. دوباره تلاش کنید."
      onRetry={() => {
        onQueryReset();
        retry();
      }}
    />
  );
}

export const UpdateMainTextDialogErrorBoundary = catchError(UpdateMainTextDialogErrorFallback);
