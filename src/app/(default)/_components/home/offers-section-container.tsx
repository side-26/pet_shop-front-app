import { CircleAlertIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { LandingProductDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { mapOffersProducts } from './offers-section.mapper';
import { OffersSectionRenderer } from './offers-section-renderer';

type Props = Readonly<{
  productsPromise: Promise<FetcherResult<LandingProductDTO[]>>;
}>;

export async function OffersSectionContainer({ productsPromise }: Props) {
  const result = await productsPromise;

  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlertIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>دریافت پیشنهادها انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message ?? 'لطفاً دوباره تلاش کنید.'}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (result.data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>پیشنهادی برای نمایش وجود ندارد</EmptyTitle>
          <EmptyDescription>به‌زودی پیشنهادهای شگفت‌انگیز جدیدی اضافه می‌شود.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <OffersSectionRenderer products={mapOffersProducts(result.data)} />;
}
