import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Price } from '@/components/ui/price';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { createProductImageAlt } from './offers-section.helpers';
import type { OffersProductViewModel } from './offers-section.types';

type Props = Readonly<{
  products: readonly OffersProductViewModel[];
  isSkeleton?: boolean;
}>;

export function OffersSectionRenderer({ products, isSkeleton = false }: Props) {
  return (
    <Carousel
      aria-label="پیشنهادهای شگفت‌انگیز"
      aria-busy={isSkeleton || undefined}
      opts={{ align: 'start' }}
      className={cn('tw:w-full', isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <CarouselContent className="tw:pb-4">
        {products.map((product) => {
          const discountedPrice = product.price - product.discountPrice;

          return (
            <CarouselItem
              key={product.id}
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
                    {product.discountPercentage.toLocaleString('fa-IR')}٪ تخفیف
                  </Badge>
                  {isSkeleton ? (
                    <div className="tw:absolute tw:inset-0" />
                  ) : (
                    <Image
                      src={product.mainImage}
                      alt={createProductImageAlt(product)}
                      fill
                      placeholder={product.mainImageThumbnail ? 'blur' : 'empty'}
                      blurDataURL={product.mainImageThumbnail}
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
                      className="tw:object-cover tw:transition-transform tw:duration-300 tw:group-hover/card:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none"
                    />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="tw:mt-auto">
                  <Price
                    number={product.price}
                    className="tw:text-caption tw:text-muted-foreground tw:line-through"
                  />
                </CardContent>
                <CardFooter className="tw:justify-between">
                  <Price number={discountedPrice} className="tw:text-price-m tw:text-primary" />
                  <Link
                    href={routePaths.products}
                    aria-label={isSkeleton ? undefined : `مشاهده ${product.title}`}
                    aria-disabled={isSkeleton || undefined}
                    tabIndex={isSkeleton ? -1 : undefined}
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
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="tw:start-2" disabled={isSkeleton} />
      <CarouselNext className="tw:end-2" disabled={isSkeleton} />
    </Carousel>
  );
}
