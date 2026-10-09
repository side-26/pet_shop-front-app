'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

function ProfileAddressesErrorFallback(_: object, { error, retry }: ErrorInfo) {
  console.error('Unexpected error while rendering the profile addresses section.', error);

  return (
    <FetchErrorSection
      description="هنگام نمایش نشانی‌ها خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
      onRetry={retry}
      title="دریافت نشانی‌ها انجام نشد"
    />
  );
}

export const ProfileAddressesErrorBoundary = catchError(ProfileAddressesErrorFallback);
