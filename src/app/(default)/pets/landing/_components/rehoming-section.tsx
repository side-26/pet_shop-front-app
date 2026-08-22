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
import { cn } from '@/lib/utils';

import { rehomingPets } from './pet-landing-data';

export function RehomingSection() {
  return (
    <section
      aria-labelledby="rehoming-title"
      className="tw:mx-auto tw:w-full tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:md:py-12"
    >
      <h2 id="rehoming-title" className="tw:mb-6 tw:text-title-l tw:md:mb-8 tw:md:text-heading-2">
        حیوانات آماده واگذاری
      </h2>

      <Carousel aria-label="حیوانات آماده واگذاری" opts={{ align: 'start' }} className="tw:w-full">
        <CarouselContent className="tw:pb-2">
          {rehomingPets.map((pet) => (
            <CarouselItem key={pet.name} className="tw:basis-[84%] tw:sm:basis-1/2 tw:lg:basis-1/4">
              <Card variant="outlined" size="sm" className="tw:h-full">
                <div className="tw:relative tw:mx-3 tw:h-40 tw:overflow-hidden tw:rounded-2xl tw:sm:h-48">
                  <Image
                    src={pet.image}
                    alt={pet.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 84vw"
                    className="tw:object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="tw:text-title-l">{pet.name}</CardTitle>
                  <CardDescription>{pet.details}</CardDescription>
                </CardHeader>
                <CardContent className="tw:mt-auto">
                  <Link
                    href={routePaths.petsList}
                    aria-label={`درخواست واگذاری ${pet.name}`}
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
        <CarouselPrevious className="tw:start-2" />
        <CarouselNext className="tw:end-2" />
      </Carousel>
    </section>
  );
}
