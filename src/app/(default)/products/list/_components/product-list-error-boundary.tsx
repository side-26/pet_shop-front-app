'use client';

import { useRouter } from '@/hooks/use-router';
import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

const fallbackDescription = 'هنگام نمایش فهرست محصولات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.';

function getErrorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

type ProductListErrorFallbackProps = Readonly<{
  error: unknown;
  onQueryReset?: () => void;
  refreshOnRetry?: boolean;
  retry: () => void;
}>;

export function ProductListErrorFallback({
  error,
  onQueryReset,
  refreshOnRetry = true,
  retry,
}: ProductListErrorFallbackProps) {
  const router = useRouter();

  return (
    <FetchErrorSection
      description={getErrorDescription(error)}
      onRetry={() => {
        onQueryReset?.();
        retry();
        if (refreshOnRetry) router.refresh();
      }}
      title="دریافت فهرست محصولات انجام نشد"
    />
  );
}

type ProductListErrorBoundaryProps = Readonly<{
  children: ReactNode;
  onQueryReset?: () => void;
}>;

export function ProductListErrorBoundary({
  children,
  onQueryReset,
}: ProductListErrorBoundaryProps) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <ProductListErrorFallback
          error={error}
          onQueryReset={onQueryReset}
          refreshOnRetry={!onQueryReset}
          retry={retry}
        />
      )}
    >
      {children}
    </ErrorStateBoundary>
  );
}
