'use client';

import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

const fallbackDescription = 'نمایش آمار داشبورد انجام نشد. دوباره تلاش کنید.';

function errorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

export function DashboardErrorBoundary({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <FetchErrorSection
          title="دریافت آمار داشبورد انجام نشد"
          description={errorDescription(error)}
          onRetry={retry}
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
