import { CircleAlertIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { LandingPetDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { PopularPetsSectionRenderer } from './popular-pets-section-renderer';

type Props = Readonly<{ petsPromise: Promise<FetcherResult<LandingPetDTO[]>> }>;

export async function PopularPetsSectionContainer({ petsPromise }: Props) {
  const result = await petsPromise;

  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlertIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>دریافت حیوانات پرطرفدار انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message ?? 'لطفاً دوباره تلاش کنید.'}</EmptyDescription>
        </EmptyHeader>
      </Empty>
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
