import { Flame, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { featuredProducts } from './home-data';
import { RevealItem, RevealSection } from './motion-primitives';

export function OffersSection() {
  return (
    <RevealSection
      labelledBy="offers-title"
      className="tw:relative tw:overflow-hidden tw:bg-surface tw:py-16 tw:lg:py-24"
    >
      <div className="tw:absolute tw:start-0 tw:top-0 tw:size-64 tw:-translate-y-1/2 tw:rounded-full tw:bg-primary/10 tw:blur-3xl" />
      <div className="tw:relative tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-8 tw:px-4 tw:sm:px-6 tw:md:px-8">
        <RevealItem className="tw:flex tw:items-center tw:gap-3">
          <span className="tw:flex tw:size-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-error-muted tw:text-error-muted-foreground">
            <Flame aria-hidden="true" className="tw:size-6" />
          </span>
          <div className="tw:flex tw:flex-col tw:gap-1">
            <span className="tw:text-label-m tw:font-bold tw:text-error">فرصت محدود</span>
            <h2 id="offers-title" className="tw:text-heading-2 tw:lg:text-heading-1">
              پیشنهادهای شگفت‌انگیز
            </h2>
          </div>
        </RevealItem>

        <RevealItem>
          <Carousel aria-label="پیشنهادهای شگفت‌انگیز" opts={{ align: 'start' }}>
            <CarouselContent className="tw:pb-4">
              {featuredProducts.map((product) => (
                <CarouselItem
                  key={product.title}
                  className="tw:basis-[88%] tw:sm:basis-1/2 tw:lg:basis-1/3 tw:xl:basis-1/4"
                >
                  <Card
                    size="sm"
                    className="tw:h-full tw:transition-[transform,box-shadow] tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none"
                  >
                    <div className="tw:relative tw:mx-4 tw:mt-4 tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:bg-background">
                      <Badge
                        color="error"
                        size="sm"
                        className="tw:absolute tw:start-2 tw:top-2 tw:z-10"
                      >
                        {product.discount}
                      </Badge>
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
                        className="tw:object-cover tw:transition-transform tw:duration-300 tw:group-hover/card:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{product.title}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="tw:mt-auto">
                      <del className="tw:text-caption tw:text-muted-foreground">
                        <bdi>{product.previousPrice}</bdi> تومان
                      </del>
                    </CardContent>
                    <CardFooter className="tw:justify-between">
                      <p className="tw:flex tw:items-baseline tw:gap-1 tw:text-price-m tw:text-primary">
                        <bdi>{product.currentPrice}</bdi>
                        <span className="tw:text-label-s tw:font-normal">تومان</span>
                      </p>
                      <Link
                        href={routePaths.products}
                        aria-label={`مشاهده ${product.title}`}
                        data-icon-only="true"
                        className={cn(
                          buttonVariants({ variant: 'tonal', size: 'sm' }),
                          'tw:rounded-full',
                        )}
                      >
                        <Plus aria-hidden="true" />
                      </Link>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="tw:start-2" />
            <CarouselNext className="tw:end-2" />
          </Carousel>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
