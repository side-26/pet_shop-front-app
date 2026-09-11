import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { LandingPetDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { RehomingSectionFetchError } from './rehoming-section-fetch-error';
import { RehomingSectionRenderer } from './rehoming-section-renderer';

type Props = Readonly<{ petsPromise: Promise<FetcherResult<LandingPetDTO[]>> }>;

export async function RehomingSectionContainer({ petsPromise }: Props) {
  const result = await petsPromise;

  if (!result.isSuccess) return <RehomingSectionFetchError description={result.message} />;

  if (result.data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>حیوانی برای واگذاری وجود ندارد</EmptyTitle>
          <EmptyDescription>به‌زودی حیوانات جدیدی برای واگذاری اضافه می‌شوند.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <RehomingSectionRenderer pets={result.data} />;
}
