'use client';

import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { retryLandingPopularBrandsAction } from '@/entities/landing/landing.actions';

const fallbackDescription = 'دریافت برندهای محبوب با مشکل روبه‌رو شد. دوباره تلاش کنید.';

function getErrorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

export function PopularBrandsSectionErrorBoundary({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <FetchErrorSection
          description={getErrorDescription(error)}
          onRetry={() => {
            void retryLandingPopularBrandsAction().finally(retry);
          }}
          title="دریافت برندهای محبوب انجام نشد"
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
