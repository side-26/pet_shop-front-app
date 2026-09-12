import { ArrowLeftIcon } from 'lucide-react';
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
import type { LandingPopularProductDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

type FeaturedProductsRendererProps = Readonly<{
  products: readonly LandingPopularProductDTO[];
  isSkeleton?: boolean;
}>;

export function FeaturedProductsRenderer({
  products,
  isSkeleton = false,
}: FeaturedProductsRendererProps) {
  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <Carousel aria-label="محصولات محبوب" opts={{ align: 'start' }}>
        <CarouselContent className="tw:pb-5">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="tw:basis-[88%] tw:sm:basis-1/2 tw:lg:basis-1/3 tw:xl:basis-1/4"
            >
              <PopularProductCard product={product} isSkeleton={isSkeleton} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="tw:start-2" />
        <CarouselNext className="tw:end-2" />
      </Carousel>
    </div>
  );
}

function PopularProductCard({
  product,
  isSkeleton,
}: Readonly<{ product: LandingPopularProductDTO; isSkeleton: boolean }>) {
  const href = routePaths.productDetail(product.slug);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <Card
      size="sm"
      className="tw:h-full tw:transition-[transform,box-shadow] tw:duration-300 tw:hover:-translate-y-1.5 tw:hover:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none"
    >
      <div className="tw:relative tw:mx-4 tw:mt-4 tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:bg-muted">
        <Badge
          color="primary"
          variant="tonal"
          size="xs"
          className="tw:absolute tw:start-2 tw:top-2 tw:z-10"
        >
          پرفروش
        </Badge>
        {isSkeleton ? (
          <div className="tw:absolute tw:inset-0" />
        ) : (
          <Image
            src={product.mainImage}
            alt={product.title}
            fill
            placeholder={product.mainImageThumbnail ? 'blur' : 'empty'}
            blurDataURL={product.mainImageThumbnail}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
            className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/card:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none"
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="tw:text-label-l">{product.title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          'tw:mt-auto tw:flex tw:flex-col tw:items-start tw:gap-1',
          !hasDiscount && 'tw:text-price-m',
        )}
      >
        <Price
          number={product.price}
          className={cn(
            hasDiscount
              ? 'tw:text-label-s tw:text-muted-foreground tw:line-through'
              : 'tw:text-primary',
          )}
          aria-label={hasDiscount ? `قیمت پیش از تخفیف ${product.title}` : undefined}
        />
        {hasDiscount ? (
          <Price
            number={product.discountPrice}
            className="tw:text-price-m tw:text-primary"
            aria-label={`قیمت با تخفیف ${product.title}`}
          />
        ) : null}
      </CardContent>
      <CardFooter>
        <Link
          href={href}
          prefetch
          aria-disabled={isSkeleton || undefined}
          tabIndex={isSkeleton ? -1 : undefined}
          className={cn(
            buttonVariants({ variant: 'tonal', color: 'primary', size: 'xs', block: true }),
            'tw:group',
          )}
        >
          مشاهده جزییات محصول
          <ArrowLeftIcon
            aria-hidden="true"
            data-icon="inline-end"
            className="tw:transition-transform tw:duration-200 tw:group-hover:-translate-x-1 tw:motion-reduce:transition-none tw:motion-reduce:group-hover:transform-none"
          />
        </Link>
      </CardFooter>
    </Card>
  );
}
