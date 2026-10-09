'use client';

import { useRouter } from 'nextjs-toploader/app';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

export function PetListFetchError({ description }: Readonly<{ description?: string | null }>) {
  const router = useRouter();
  return (
    <FetchErrorSection
      description={description ?? undefined}
      onRetry={() => router.refresh()}
      title="دریافت فهرست حیوانات انجام نشد"
    />
  );
}
