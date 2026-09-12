'use client';

import { useRouter } from 'nextjs-toploader/app';

import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';

export function PetListFetchError({ description }: Readonly<{ description?: string | null }>) {
  const router = useRouter();
  return (
    <FetchErrorSectionBoundary
      description={description ?? undefined}
      onRetry={() => router.refresh()}
      title="دریافت فهرست حیوانات انجام نشد"
    />
  );
}
