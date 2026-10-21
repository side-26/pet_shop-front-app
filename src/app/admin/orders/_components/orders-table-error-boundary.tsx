'use client';

import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { useRouter } from '@/hooks/use-router';

function errorDescription(error: unknown) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : 'دریافت سفارش‌ها انجام نشد. دوباره تلاش کنید.';
}

export function OrdersTableErrorBoundary({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();

  return (
    <ErrorStateBoundary
      fallbackRender={({ error }) => (
        <FetchErrorSection
          title="دریافت سفارش‌ها انجام نشد"
          description={errorDescription(error)}
          onRetry={router.refresh}
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
