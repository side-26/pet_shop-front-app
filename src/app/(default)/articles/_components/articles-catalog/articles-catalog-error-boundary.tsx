'use client';

import type { ReactNode } from 'react';
import { useRouter } from '@/hooks/use-router';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

const fallbackDescription = 'فهرست مقاله‌ها در حال حاضر در دسترس نیست. دوباره تلاش کنید.';

function getErrorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

type ArticlesCatalogErrorFallbackProps = Readonly<{
  error: unknown;
  onQueryReset?: () => void;
  refreshOnRetry?: boolean;
  retry: () => void;
}>;

export function ArticlesCatalogErrorFallback({
  error,
  onQueryReset,
  refreshOnRetry = true,
  retry,
}: ArticlesCatalogErrorFallbackProps) {
  const router = useRouter();

  return (
    <FetchErrorSection
      title="دریافت مقاله‌ها انجام نشد"
      description={getErrorDescription(error)}
      onRetry={() => {
        onQueryReset?.();
        retry();
        if (refreshOnRetry) router.refresh();
      }}
    />
  );
}

type ArticlesCatalogErrorBoundaryProps = Readonly<{
  children: ReactNode;
  onQueryReset?: () => void;
}>;

export function ArticlesCatalogErrorBoundary({
  children,
  onQueryReset,
}: ArticlesCatalogErrorBoundaryProps) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <ArticlesCatalogErrorFallback
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
