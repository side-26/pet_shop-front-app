'use client';

import { useRouter } from 'nextjs-toploader/app';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

export function ProductListFetchError({ description }: Readonly<{ description?: string | null }>) {
  const router = useRouter();
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={() => router.refresh()}
      title="دریافت فهرست محصولات انجام نشد"
    />
  );
}
