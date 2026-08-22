import { ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { cacheLife } from 'next/cache';
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

import { MotionItem, MotionSection } from './product-landing-motion';
import { landingProducts } from './product-landing-data';

export async function FeaturedProductsSection() {
  'use cache';
  cacheLife('max');

  return <FeaturedProductsRenderer />;
}

export function FeaturedProductsRenderer() {
  return (
    <MotionSection
      id="featured-products"
      labelledBy="featured-products-title"
      cacheSection="featured-products"
      className="tw:relative tw:overflow-hidden tw:px-4 tw:py-16 tw:sm:px-6 tw:md:px-8 tw:lg:py-24"
    >
      <div className="tw:absolute tw:end-0 tw:top-0 tw:-z-10 tw:size-80 tw:translate-x-1/3 tw:-translate-y-1/3 tw:rounded-full tw:bg-secondary/15 tw:blur-3xl" />
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-8">
        <MotionItem className="tw:flex tw:flex-col tw:gap-4 tw:sm:flex-row tw:sm:items-end tw:sm:justify-between">
          <div className="tw:flex tw:items-center tw:gap-3">
            <span className="tw:flex tw:size-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-secondary-muted tw:text-secondary-muted-foreground">
              <Sparkles aria-hidden="true" className="tw:size-6" />
            </span>
            <div className="tw:flex tw:flex-col tw:gap-1">
              <span className="tw:text-label-m tw:font-bold tw:text-secondary-active">
                منتخب این هفته
              </span>
              <h2 id="featured-products-title" className="tw:text-heading-2 tw:lg:text-heading-1">
                انتخاب‌های محبوب
              </h2>
            </div>
          </div>
          <Link
            href={routePaths.cart}
            className={buttonVariants({ variant: 'outlined', color: 'primary', size: 'lg' })}
          >
            <ShoppingBag aria-hidden="true" data-icon="inline-start" />
            مشاهده سبد خرید
          </Link>
        </MotionItem>

        <MotionItem>
          <Carousel aria-label="محصولات منتخب" opts={{ align: 'start' }}>
            <CarouselContent className="tw:pb-5">
              {landingProducts.map((product) => (
                <CarouselItem
                  key={product.title}
                  className="tw:basis-[88%] tw:sm:basis-1/2 tw:lg:basis-1/3 tw:xl:basis-1/4"
                >
                  <ProductPreviewCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="tw:start-2" />
            <CarouselNext className="tw:end-2" />
          </Carousel>
        </MotionItem>
      </div>
    </MotionSection>
  );
}

type ProductPreviewCardProps = Readonly<{
  product: (typeof landingProducts)[number];
}>;

function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  return (
    <Card
      size="sm"
      className="tw:h-full tw:transition-[transform,box-shadow] tw:duration-300 tw:hover:-translate-y-1.5 tw:hover:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none"
    >
      <div className="tw:relative tw:mx-4 tw:mt-4 tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:bg-background">
        <Badge
          color={product.badgeColor}
          size="sm"
          className="tw:absolute tw:start-2 tw:top-2 tw:z-10"
        >
          {product.badge}
        </Badge>
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
          className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/card:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none"
        />
      </div>
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="tw:mt-auto">
        <p className="tw:flex tw:items-baseline tw:gap-1 tw:text-price-m tw:text-primary">
          <bdi>{product.price}</bdi>
          <span className="tw:text-label-s tw:font-normal">تومان</span>
        </p>
      </CardContent>
      <CardFooter>
        <a
          href="#care-guide"
          className={cn(
            buttonVariants({ variant: 'tonal', color: 'primary', size: 'sm', block: true }),
            'tw:group',
          )}
        >
          راهنمای انتخاب
          <ArrowLeft
            aria-hidden="true"
            data-icon="inline-end"
            className="tw:transition-transform tw:duration-200 tw:group-hover:-translate-x-1 tw:motion-reduce:transition-none tw:motion-reduce:group-hover:transform-none"
          />
        </a>
      </CardFooter>
    </Card>
  );
}
