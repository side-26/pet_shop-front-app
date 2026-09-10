import { PawPrintIcon, TagsIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Price } from '@/components/ui/price';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';
import type { LandingPetDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

type Props = Readonly<{ pets: readonly LandingPetDTO[]; isSkeleton?: boolean }>;

export function PopularPetsSectionRenderer({ pets, isSkeleton = false }: Props) {
  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn('tw:w-full', isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <Carousel aria-label="حیوانات پرطرفدار" className="tw:lg:hidden">
        <CarouselContent>
          {pets.map((pet) => (
            <CarouselItem key={pet.id} className="tw:basis-1/2 tw:md:basis-1/3">
              <PopularPetCard pet={pet} isSkeleton={isSkeleton} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="tw:hidden tw:flex-wrap tw:gap-4 tw:lg:flex">
        {pets.map((pet) => (
          <div key={pet.id} className="tw:min-w-0 tw:flex-1">
            <PopularPetCard pet={pet} isSkeleton={isSkeleton} />
          </div>
        ))}
      </div>
    </section>
  );
}

function PopularPetCard({
  pet,
  isSkeleton,
}: Readonly<{ pet: LandingPetDTO; isSkeleton: boolean }>) {
  return (
    <Link
      href={routePaths.petDetail(pet.slug)}
      aria-label={isSkeleton ? undefined : `مشاهده ${pet.title}`}
      aria-disabled={isSkeleton || undefined}
      tabIndex={isSkeleton ? -1 : undefined}
      className="tw:group/pet tw:block tw:h-full tw:rounded-3xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
    >
      <Card size="sm" className="tw:h-full tw:flex-col tw:gap-4 tw:p-3 tw:lg:p-4">
        <div className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:bg-muted">
          {isSkeleton ? (
            <div className="tw:absolute tw:inset-0" />
          ) : (
            <Image
              src={pet.mainImage}
              alt={`${pet.title}، ${pet.petType}`}
              fill
              placeholder={pet.mainImageThumbnail ? 'blur' : 'empty'}
              blurDataURL={pet.mainImageThumbnail}
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 33vw, 50vw"
              className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/pet:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/pet:transform-none"
            />
          )}
        </div>
        <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:justify-between">
          <CardHeader className="tw:px-0">
            <CardTitle className="tw:text-title-l">{pet.title}</CardTitle>
            <CardDescription className="tw:flex tw:flex-wrap tw:items-center tw:gap-x-3 tw:gap-y-1 tw:pb-3 tw:text-caption">
              <span className="tw:inline-flex tw:items-center tw:gap-1">
                <PawPrintIcon aria-hidden="true" className="tw:size-[1em] tw:shrink-0" />
                {pet.petType}
              </span>
              <span className="tw:inline-flex tw:items-center tw:gap-1">
                <TagsIcon aria-hidden="true" className="tw:size-[1em] tw:shrink-0" />
                {pet.breed}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="tw:mt-auto tw:px-0">
            <Separator className="tw:mb-3" />
            <Price
              number={pet.price}
              className="tw:text-price-s tw:text-primary tw:sm:text-price-m"
            />
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
