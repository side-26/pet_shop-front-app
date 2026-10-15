'use client';

import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

const fallbackDescription = 'نمایش حیوان انجام نشد. دوباره تلاش کنید.';

function getErrorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

export function PetDetailErrorBoundary({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <FetchErrorSection
          title="نمایش حیوان انجام نشد"
          description={getErrorDescription(error)}
          onRetry={retry}
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
