import { ArrowLeft, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';

import { popularPets } from './pet-landing-data';

export function PopularPetsSection() {
  return (
    <section
      aria-labelledby="popular-pets-title"
      className="tw:mx-auto tw:w-full tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:md:py-12"
    >
      <div className="tw:mb-6 tw:flex tw:items-center tw:justify-between tw:gap-4 tw:md:mb-8">
        <h2 id="popular-pets-title" className="tw:text-title-l tw:md:text-heading-2">
          پرطرفدارترین حیوانات
        </h2>
        <Link href={routePaths.petsList} className={buttonVariants({ variant: 'text' })}>
          مشاهده بیشتر
          <ArrowLeft data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>

      <div className="tw:grid tw:gap-4 tw:md:grid-cols-2 tw:lg:grid-cols-4">
        {popularPets.map((pet) => (
          <Link
            key={pet.name}
            href={routePaths.petsList}
            aria-label={`مشاهده ${pet.name}`}
            className="tw:group/pet tw:rounded-3xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
          >
            <Card
              size="sm"
              className="tw:h-full tw:flex-row tw:gap-4 tw:p-3 tw:lg:flex-col tw:lg:p-4"
            >
              <div className="tw:relative tw:size-32 tw:shrink-0 tw:overflow-hidden tw:rounded-2xl tw:sm:size-36 tw:lg:h-48 tw:lg:w-full">
                <Image
                  src={pet.image}
                  alt={pet.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 144px"
                  className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/pet:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/pet:transform-none"
                />
              </div>
              <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:justify-between tw:py-1">
                <CardHeader className="tw:px-0">
                  <div className="tw:flex tw:items-start tw:justify-between tw:gap-2">
                    <CardTitle className="tw:text-title-l">{pet.name}</CardTitle>
                    <Heart aria-hidden="true" className="tw:size-5 tw:text-muted-foreground" />
                  </div>
                  <CardDescription>{pet.details}</CardDescription>
                </CardHeader>
                <CardContent className="tw:px-0">
                  <Separator className="tw:mb-3 tw:hidden tw:lg:block" />
                  <p className="tw:text-price-s tw:text-primary tw:sm:text-price-m" dir="ltr">
                    <bdi>{pet.price}</bdi> <span className="tw:text-caption">تومان</span>
                  </p>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
