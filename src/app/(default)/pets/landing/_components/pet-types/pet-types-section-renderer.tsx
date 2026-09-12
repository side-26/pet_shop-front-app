import Image from 'next/image';
import Link from 'next/link';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { routePaths } from '@/configs/route.path';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  petTypes: readonly LandingPetTypeDTO[];
  isSkeleton?: boolean;
}>;

export function PetTypesSectionRenderer({ petTypes, isSkeleton = false }: Props) {
  return (
    <Carousel
      aria-label="دسته‌بندی حیوانات"
      aria-busy={isSkeleton || undefined}
      className={cn('tw:w-full', isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <CarouselContent className="tw:pb-2 tw:md:pb-0">
        {petTypes.map((petType) => (
          <CarouselItem key={petType.id} className="tw:basis-1/2 tw:md:basis-0 tw:md:grow">
            <Link
              href={routePaths.petsListByPetType(petType.id)}
              prefetch={false}
              aria-label={isSkeleton ? undefined : `مشاهده ${petType.title}`}
              aria-disabled={isSkeleton || undefined}
              tabIndex={isSkeleton ? -1 : undefined}
              className="tw:block tw:h-full tw:rounded-3xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
            >
              <Card variant="outlined" size="sm" className="tw:h-full tw:min-h-36 tw:pt-0">
                <div className="tw:relative tw:aspect-square tw:overflow-hidden tw:rounded-t-2xl tw:rounded-b-none tw:bg-muted">
                  {isSkeleton ? (
                    <div className="tw:absolute tw:inset-0" />
                  ) : (
                    <Image
                      src={petType.mainImage}
                      alt={`تصویر دسته‌بندی ${petType.title}`}
                      fill
                      placeholder={petType.thumbnail ? 'blur' : 'empty'}
                      blurDataURL={petType.thumbnail}
                      sizes="(min-width: 768px) 16.67vw, 50vw"
                      className="tw:object-cover"
                    />
                  )}
                </div>
                <CardHeader className="tw:items-center tw:text-center">
                  <CardTitle className="tw:text-label-m tw:md:text-title-l">
                    {petType.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
