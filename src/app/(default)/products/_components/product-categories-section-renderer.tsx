import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { routePaths } from '@/configs/route.path';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

type ProductCategoriesSectionRendererProps = Readonly<{
  petTypes: readonly LandingPetTypeDTO[];
  isSkeleton?: boolean;
}>;

export function ProductCategoriesSectionRenderer({
  petTypes,
  isSkeleton = false,
}: ProductCategoriesSectionRendererProps) {
  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <Carousel aria-label="دسته‌بندی محصولات بر اساس نوع حیوان" className="tw:md:hidden">
        <CarouselContent className="tw:pb-2">
          {petTypes.map((petType) => (
            <CarouselItem key={petType.id} className="tw:basis-2/3">
              <ProductPetTypeCard petType={petType} isSkeleton={isSkeleton} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="tw:hidden tw:flex-wrap tw:gap-5 tw:md:flex">
        {petTypes.map((petType) => (
          <div key={petType.id} className="tw:min-w-0 tw:max-w-72 tw:flex-1">
            <ProductPetTypeCard petType={petType} isSkeleton={isSkeleton} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPetTypeCard({
  petType,
  isSkeleton,
}: Readonly<{ petType: LandingPetTypeDTO; isSkeleton: boolean }>) {
  const href = routePaths.productsListByPetType(petType.id);

  return (
    <Card size="sm" className="tw:group/card tw:h-full tw:overflow-hidden tw:pt-0">
      <div className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:bg-muted">
        {isSkeleton ? (
          <div className="tw:absolute tw:inset-0" />
        ) : (
          <Image
            src={petType.mainImage}
            alt={`محصولات مناسب ${petType.title}`}
            fill
            placeholder={petType.thumbnail ? 'blur' : 'empty'}
            blurDataURL={petType.thumbnail}
            sizes="(min-width: 768px) 18rem, 66vw"
            className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/card:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none"
          />
        )}
      </div>
      <CardHeader className="tw:gap-2 tw:text-start">
        <CardTitle className="tw:text-label-l">{petType.title}</CardTitle>
      </CardHeader>
      <CardContent className="tw:flex tw:justify-start tw:px-6 tw:pb-6 tw:pt-0 tw:text-start">
        <Link
          href={href}
          prefetch
          aria-label={isSkeleton ? undefined : `مشاهده محصولات ${petType.title}`}
          aria-disabled={isSkeleton || undefined}
          tabIndex={isSkeleton ? -1 : undefined}
          className="tw:inline-flex tw:items-center tw:gap-1 tw:text-label-s tw:font-semibold tw:text-primary tw:outline-none tw:transition-colors tw:hover:text-primary-active tw:focus-visible:rounded-sm tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
        >
          مشاهده محصولات
          <ArrowLeftIcon
            aria-hidden="true"
            className="tw:size-3 tw:transition-transform tw:duration-200 tw:group-hover/card:-translate-x-1 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none"
          />
        </Link>
      </CardContent>
    </Card>
  );
}
