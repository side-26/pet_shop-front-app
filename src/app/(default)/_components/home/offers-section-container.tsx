import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { LandingProductDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { mapOffersProducts } from './offers-section.mapper';
import { OffersSectionFetchError } from './offers-section-fetch-error';
import { OffersSectionRenderer } from './offers-section-renderer';

type Props = Readonly<{
  productsPromise: Promise<FetcherResult<LandingProductDTO[]>>;
}>;

export async function OffersSectionContainer({ productsPromise }: Props) {
  const result = await productsPromise;

  if (!result.isSuccess) {
    return <OffersSectionFetchError description={result.message} />;
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
