import { Bell, Heart, Star } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils';

import type { ProductListItem } from './product-list-data';

type ProductCardProps = Readonly<{ product: ProductListItem }>;

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      size="xs"
      className={cn(
        'tw:h-full tw:transition-[transform,box-shadow] tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none',
        !product.available && 'tw:bg-muted/45',
      )}
    >
      <div className="tw:relative tw:mx-2 tw:mt-2 tw:aspect-square tw:overflow-hidden tw:rounded-2xl tw:bg-muted tw:sm:mx-3 tw:sm:mt-3">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 640px) 30vw, 46vw"
          className={cn(
            'tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/card:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none',
            !product.available && 'tw:grayscale tw:opacity-55',
          )}
        />
        <Button
          iconOnly
          size="sm"
          variant="transparent"
          color="error"
          aria-label={`افزودن ${product.title} به علاقه‌مندی‌ها`}
          className="tw:absolute tw:end-2 tw:top-2"
        >
          <Heart aria-hidden="true" />
        </Button>
        {!product.available ? (
          <Badge color="warning" variant="tonal" className="tw:absolute tw:start-2 tw:bottom-2">
            ناموجود
          </Badge>
        ) : null}
      </div>

      <CardHeader className="tw:gap-2">
        <div className="tw:flex tw:items-center tw:justify-between tw:gap-1">
          <div className="tw:flex tw:min-w-0 tw:gap-1">
            <Badge size="xs" variant="tonal" color="secondary">
              {product.animal}
            </Badge>
            <Badge size="xs" variant="flat" color="primary" className="tw:hidden tw:sm:inline-flex">
              {product.category}
            </Badge>
          </div>
          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-label-s tw:text-warning-active">
            <Star aria-hidden="true" className="tw:fill-current" />
            <bdi>{product.rating.toLocaleString('fa-IR')}</bdi>
          </span>
        </div>
        <CardTitle className="tw:line-clamp-2 tw:min-h-10 tw:text-label-s tw:leading-5 tw:sm:min-h-12 tw:sm:text-title-s">
          {product.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="tw:mt-auto tw:flex tw:min-h-12 tw:flex-col tw:items-end tw:justify-end tw:gap-1 tw:sm:min-h-14">
        {product.previousPrice ? (
          <div className="tw:flex tw:items-center tw:gap-2">
            <Price
              number={product.previousPrice}
              prefix="تومان"
              className="tw:text-label-s tw:text-muted-foreground tw:line-through"
            />
            <Badge size="xs" color="error" variant="tonal">
              {product.discount}
            </Badge>
          </div>
        ) : null}
        <Price
          number={product.price}
          prefix="تومان"
          className={cn(
            'tw:text-price-s tw:text-primary tw:sm:text-price-m',
            !product.available && 'tw:text-muted-foreground',
          )}
        />
      </CardContent>

      <CardFooter className="tw:mt-auto">
        <Button
          block
          size="sm"
          variant={product.available ? 'tonal' : 'outlined'}
          color={product.available ? 'primary' : 'secondary'}
        >
          {!product.available ? <Bell data-icon="inline-start" aria-hidden="true" /> : null}
          {product.available ? 'مشاهده محصول' : 'موجود شد خبرم کن'}
        </Button>
      </CardFooter>
    </Card>
  );
}
