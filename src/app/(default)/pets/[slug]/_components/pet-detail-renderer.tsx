import Link from 'next/link';

import { ImageGallery } from '@/components/common/image-gallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import type { PetDetailViewModel } from './pet-detail-data';
import { PetAddToCartControl } from './pet-add-to-cart-control';
import { PetHeaderActions } from './pet-header-actions';
import { PetDetailRating } from './pet-detail-rating';
import { PetDetailSummary } from './pet-detail-summary';
import { PetDetailTabs } from './pet-detail-tabs';

type Props = Readonly<{ pet: PetDetailViewModel; isSkeleton?: boolean }>;

function PetRequestControls({
  pet,
  isSkeleton,
  mobile = false,
}: Readonly<{ pet: PetDetailViewModel; isSkeleton: boolean; mobile?: boolean }>) {
  return (
    <div
      className={cn(
        'tw:flex tw:flex-col tw:gap-4',
        mobile &&
          'tw:fixed tw:inset-x-4 tw:bottom-20 tw:z-30 tw:flex-row tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-border tw:bg-background/95 tw:p-3 tw:shadow-xl tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:inset-x-6 tw:sm:bottom-28 tw:lg:hidden',
      )}
    >
      <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-1">
        {pet.price > pet.payablePrice ? (
          <Price
            number={pet.price}
            className="tw:text-label-s tw:text-muted-foreground tw:line-through"
          />
        ) : null}
        <Price number={pet.payablePrice} className="tw:text-price-m tw:text-primary" />
      </div>
      <PetAddToCartControl
        petId={pet.id}
        petTitle={pet.title}
        disabled={isSkeleton || pet.quantity < 1}
      />
    </div>
  );
}

export function PetDetailRenderer({ pet, isSkeleton = false }: Props) {
  return (
    <article
      data-pet-detail-content={isSkeleton ? undefined : true}
      aria-busy={isSkeleton || undefined}
      inert={isSkeleton}
      className={cn(
        'tw:default-layout-container tw:pb-28 tw:pt-5 tw:sm:pb-48 tw:lg:pb-12 tw:lg:pt-8',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <ImageGallery
        ariaLabel={`گالری تصاویر ${pet.title}`}
        className="tw:lg:hidden"
        images={pet.images}
      />
      <div className="tw:lg:grid tw:lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] tw:lg:items-start tw:lg:gap-8">
        <div className="tw:min-w-0">
          <Card
            size="sm"
            variant="elevated"
            className="tw:overflow-hidden tw:rounded-3xl tw:p-4 tw:lg:p-6"
          >
            <div className="tw:grid tw:gap-6 tw:lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <ImageGallery
                className="tw:hidden tw:lg:block"
                images={pet.images}
                ariaLabel={`تصاویر حیوان ${pet.title}`}
              />
              <div className="tw:grid tw:content-start tw:grid-cols-3 tw:gap-4">
                <h1 className="tw:col-span-2 tw:text-title-l tw:leading-9 tw:lg:text-heading-2">
                  {pet.title}
                </h1>
                <div className="tw:justify-self-end">
                  <PetHeaderActions title={pet.title} petId={pet.id} disabled={isSkeleton} />
                </div>
                <div className="tw:col-span-3 tw:flex tw:flex-wrap tw:gap-3 tw:text-label-m">
                  <Link
                    href={routePaths.petsListByPetType(pet.petType.id)}
                    className="tw:text-primary tw:underline-offset-4 tw:hover:underline tw:focus-visible:rounded-sm tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
                  >
                    {pet.petType.title}
                  </Link>
                  <Link
                    href={routePaths.petsListByBreedAndPetType(pet.breed.id, pet.petType.id)}
                    className="tw:text-secondary-active tw:underline-offset-4 tw:hover:underline tw:focus-visible:rounded-sm tw:focus-visible:ring-3 tw:focus-visible:ring-secondary/25"
                  >
                    {pet.breed.title}
                  </Link>
                </div>
                <PetDetailRating rating={pet.rating} reviewCount={pet.reviewCount} />
                <p className="tw:col-span-3 tw:text-label-m tw:text-muted-foreground">
                  {pet.quantity > 0 ? 'آماده واگذاری' : 'در حال حاضر واگذار شده است'}
                </p>
                <PetDetailSummary summary={pet.summary} isSkeleton={isSkeleton} />
              </div>
            </div>
          </Card>
          <PetDetailTabs pet={pet} isSkeleton={isSkeleton} />
        </div>
        <aside
          aria-label="پیش‌سفارش"
          className="tw:relative tw:hidden tw:self-start tw:lg:sticky tw:lg:top-28 tw:lg:block"
        >
          <Card size="sm" variant="elevated" className="tw:rounded-3xl">
            <CardHeader>
              <CardTitle>پیش‌سفارش</CardTitle>
            </CardHeader>
            <CardContent>
              <PetRequestControls pet={pet} isSkeleton={isSkeleton} />
            </CardContent>
          </Card>
        </aside>
      </div>
      <PetRequestControls pet={pet} isSkeleton={isSkeleton} mobile />
    </article>
  );
}
