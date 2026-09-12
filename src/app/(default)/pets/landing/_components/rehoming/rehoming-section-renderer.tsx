import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { routePaths } from '@/configs/route.path';
import type { LandingPetDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

type Props = Readonly<{ pets: readonly LandingPetDTO[]; isSkeleton?: boolean }>;

export function RehomingSectionRenderer({ pets, isSkeleton = false }: Props) {
  return (
    <Carousel
      aria-label="حیوانات آماده واگذاری"
      aria-busy={isSkeleton || undefined}
      opts={{ align: 'start' }}
      className={cn('tw:w-full', isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <CarouselContent className="tw:pb-2">
        {pets.map((pet) => (
          <CarouselItem key={pet.id} className="tw:basis-[84%] tw:sm:basis-1/2 tw:lg:basis-1/4">
            <Card variant="outlined" size="sm" className="tw:h-full">
              <div className="tw:relative tw:mx-3 tw:h-40 tw:overflow-hidden tw:rounded-2xl tw:sm:h-48">
                {isSkeleton ? (
                  <div className="tw:absolute tw:inset-0" />
                ) : (
                  <Image
                    src={pet.mainImage}
                    alt={`تصویر ${pet.title}`}
                    fill
                    placeholder={pet.mainImageThumbnail ? 'blur' : 'empty'}
                    blurDataURL={pet.mainImageThumbnail}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 84vw"
                    className="tw:object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle className="tw:text-title-l">{pet.title}</CardTitle>
                <CardDescription>
                  {pet.petType} • {pet.breed}
                </CardDescription>
              </CardHeader>
              <CardContent className="tw:mt-auto">
                <Link
                  href={routePaths.petDetail(pet.slug)}
                  prefetch={false}
                  aria-label={isSkeleton ? undefined : `درخواست واگذاری ${pet.title}`}
                  aria-disabled={isSkeleton || undefined}
                  tabIndex={isSkeleton ? -1 : undefined}
                  className={cn(
                    buttonVariants({ variant: 'tonal', color: 'secondary' }),
                    'tw:w-full',
                  )}
                >
                  درخواست واگذاری
                </Link>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious disabled={isSkeleton} className="tw:start-2" />
      <CarouselNext disabled={isSkeleton} className="tw:end-2" />
    </Carousel>
  );
}
