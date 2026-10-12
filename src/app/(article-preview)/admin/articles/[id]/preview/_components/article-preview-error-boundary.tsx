'use client';

import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

export function ArticlePreviewErrorBoundary({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ retry }) => (
        <FetchErrorSection
          title="نمایش پیش‌نمایش مقاله انجام نشد"
          description="هنگام نمایش پیش‌نمایش مقاله خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید."
          onRetry={retry}
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
