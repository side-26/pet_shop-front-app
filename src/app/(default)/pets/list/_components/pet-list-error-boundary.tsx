'use client';

import { useRouter } from 'nextjs-toploader/app';
import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

const fallbackDescription = 'هنگام نمایش فهرست حیوانات خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.';

function getErrorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

type PetListErrorFallbackProps = Readonly<{
  error: unknown;
  onQueryReset?: () => void;
  refreshOnRetry?: boolean;
  retry: () => void;
}>;

export function PetListErrorFallback({
  error,
  onQueryReset,
  refreshOnRetry = true,
  retry,
}: PetListErrorFallbackProps) {
  const router = useRouter();

  console.error('Unexpected error while rendering the pet catalogue.', error);

  return (
    <FetchErrorSection
      description={getErrorDescription(error)}
      onRetry={() => {
        onQueryReset?.();
        retry();
        if (refreshOnRetry) router.refresh();
      }}
      title="دریافت فهرست حیوانات انجام نشد"
    />
  );
}

type PetListErrorBoundaryProps = Readonly<{
  children: ReactNode;
  onQueryReset?: () => void;
}>;

export function PetListErrorBoundary({ children, onQueryReset }: PetListErrorBoundaryProps) {
  return (
    <ErrorStateBoundary
      fallbackRender={({ error, retry }) => (
        <PetListErrorFallback
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
