'use client';

import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

const defaultDescription =
  'هنگام نمایش پیش‌نمایش مقاله خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.';

function errorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : defaultDescription;
}

export function ArticlePreviewErrorBoundary({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <FetchErrorSection
          title="نمایش پیش‌نمایش مقاله انجام نشد"
          description={errorDescription(error)}
          onRetry={retry}
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
