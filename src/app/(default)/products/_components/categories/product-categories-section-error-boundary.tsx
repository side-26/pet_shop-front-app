'use client';

import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { retryAllLandingPetTypesAction } from '@/entities/landing/landing.actions';

const fallbackDescription = 'دریافت دسته‌بندی محصولات با مشکل روبه‌رو شد. دوباره تلاش کنید.';

function getErrorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

export function ProductCategoriesSectionErrorBoundary({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <FetchErrorSection
          description={getErrorDescription(error)}
          onRetry={() => {
            void retryAllLandingPetTypesAction().finally(retry);
          }}
          title="دریافت دسته‌بندی محصولات انجام نشد"
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
