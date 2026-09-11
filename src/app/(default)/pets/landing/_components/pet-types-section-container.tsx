import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { FetchErrorSectionBoundary } from '@/components/common/fetch-error-section-boundary';
import { retryAllLandingPetTypesAction } from '@/entities/landing/landing.actions';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { PetTypesSectionRenderer } from './pet-types-section-renderer';

type Props = Readonly<{
  petTypesPromise: Promise<FetcherResult<LandingPetTypeDTO[]>>;
}>;

export async function PetTypesSectionContainer({ petTypesPromise }: Props) {
  const result = await petTypesPromise;

  if (!result.isSuccess) {
    return (
      <FetchErrorSectionBoundary
        description={result.message ?? undefined}
        onRetry={retryAllLandingPetTypesAction}
        title="دریافت دسته‌بندی‌ها انجام نشد"
      />
    );
  }

  if (result.data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دسته‌بندی فعالی برای نمایش وجود ندارد</EmptyTitle>
          <EmptyDescription>به‌زودی دسته‌بندی‌های جدیدی اضافه می‌شود.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <PetTypesSectionRenderer petTypes={result.data} />;
}
