'use client';

import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

const fallbackDescription = 'نمایش محصول انجام نشد. دوباره تلاش کنید.';

function getErrorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

export function ProductDetailErrorBoundary({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <FetchErrorSection
          title="نمایش محصول انجام نشد"
          description={getErrorDescription(error)}
          onRetry={retry}
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
