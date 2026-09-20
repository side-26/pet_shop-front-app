import { Star } from 'lucide-react';
import Link from 'next/link';

import { ProductGallery } from '@/app/(default)/products/[slug]/_components/product-gallery';
import { ProductHeaderActions } from '@/app/(default)/products/[slug]/_components/product-header-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import type { PetDetailViewModel } from './pet-detail-data';
import { PetDetailExpandableCard } from './pet-detail-expandable-card';
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
        mobile &&
          'tw:fixed tw:inset-x-4 tw:bottom-20 tw:z-30 tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-border tw:bg-background/95 tw:p-3 tw:shadow-xl tw:supports-backdrop-filter:backdrop-blur-xl tw:lg:hidden',
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
      <Button
        size="lg"
        disabled={isSkeleton || pet.quantity < 1}
        className="tw:shrink-0"
        aria-label={`درخواست واگذاری ${pet.title}`}
      >
        درخواست واگذاری
      </Button>
    </div>
  );
}

export function PetDetailContent({ pet, isSkeleton = false }: Props) {
  return (
    <article
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:default-layout-container tw:pb-28 tw:pt-5 tw:lg:pb-12 tw:lg:pt-8',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:lg:grid tw:lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] tw:lg:items-start tw:lg:gap-8">
        <div className="tw:min-w-0">
          <Card
            size="sm"
            variant="elevated"
            className="tw:overflow-hidden tw:rounded-3xl tw:p-4 tw:lg:p-6"
          >
            <div className="tw:grid tw:gap-6 tw:lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <ProductGallery
                images={pet.images}
                discountPercentage={pet.discountPercentage}
                itemLabel="حیوان"
                isSkeleton={isSkeleton}
              />
              <div className="tw:grid tw:content-start tw:grid-cols-3 tw:gap-4">
                <h1 className="tw:col-span-2 tw:text-title-l tw:leading-9 tw:lg:text-heading-2">
                  {pet.title}
                </h1>
                <div className="tw:justify-self-end">
                  <ProductHeaderActions title={pet.title} itemLabel="حیوان" disabled={isSkeleton} />
                </div>
                <div className="tw:col-span-3 tw:flex tw:flex-wrap tw:gap-2">
                  <Badge
                    variant="tonal"
                    render={<Link href={routePaths.petsListByPetType(pet.petType.id)} />}
                  >
                    {pet.petType.title}
                  </Badge>
                  <Badge color="secondary" variant="tonal">
                    {pet.breed.title}
                  </Badge>
                </div>
                {pet.reviewCount > 0 ? (
                  <div className="tw:col-span-3 tw:flex tw:items-center tw:gap-2 tw:text-label-m">
                    <Star
                      aria-hidden="true"
                      className="tw:size-5 tw:fill-warning-active tw:text-warning-active"
                    />
                    <bdi>{pet.rating.toLocaleString('fa-IR')}</bdi>
                    <span className="tw:text-muted-foreground">
                      ({pet.reviewCount.toLocaleString('fa-IR')} امتیاز)
                    </span>
                  </div>
                ) : null}
                <p className="tw:col-span-3 tw:text-label-m tw:text-muted-foreground">
                  {pet.quantity > 0 ? 'آماده واگذاری' : 'در حال حاضر واگذار شده است'}
                </p>
                {pet.summary ? (
                  <section aria-label="خلاصه حیوان" className="tw:col-span-3">
                    <PetDetailExpandableCard
                      title="خلاصه حیوان"
                      collapsedHeight={112}
                      isSkeleton={isSkeleton}
                    >
                      <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">
                        {pet.summary}
                      </p>
                    </PetDetailExpandableCard>
                  </section>
                ) : null}
              </div>
            </div>
          </Card>
          <PetDetailTabs pet={pet} isSkeleton={isSkeleton} />
        </div>
        <aside
          aria-label="درخواست واگذاری"
          className="tw:relative tw:hidden tw:self-start tw:lg:sticky tw:lg:top-28 tw:lg:block"
        >
          <Card size="sm" variant="elevated" className="tw:rounded-3xl">
            <CardHeader>
              <CardTitle>درخواست واگذاری</CardTitle>
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
