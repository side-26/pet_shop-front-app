import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryLandingPopularPetsAction } from '@/entities/landing/landing.actions';
import type { LandingPetDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { PopularPetsSectionRenderer } from './popular-pets-section-renderer';

type Props = Readonly<{ petsPromise: Promise<FetcherResult<LandingPetDTO[]>> }>;

export async function PopularPetsSectionContainer({ petsPromise }: Props) {
  const result = await petsPromise;

  if (!result.isSuccess) {
    return (
      <FetchErrorSectionBoundary
        description={result.message ?? undefined}
        onRetry={retryLandingPopularPetsAction}
        title="دریافت حیوانات پرطرفدار انجام نشد"
      />
    );
  }

  if (result.data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>حیوان پرطرفداری برای نمایش وجود ندارد</EmptyTitle>
          <EmptyDescription>به‌زودی حیوانات جدیدی اضافه می‌شود.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <PopularPetsSectionRenderer pets={result.data} />;
}
