import { CircleCheck, Star } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { routePaths } from '@/configs/route.path';

import type { ProductDetailViewModel } from './product-detail-data';
import { ProductRatingForm } from './product-rating-form';

type ProductInformationSectionProps = Readonly<{
  isSkeleton: boolean;
  product: ProductDetailViewModel;
}>;

export function ProductInformationSection({ isSkeleton, product }: ProductInformationSectionProps) {
  return (
    <>
      <div className="tw:flex tw:flex-wrap tw:gap-3 tw:text-label-m tw:lg:hidden">
        {product.animal && product.animalId ? (
          <Link
            href={routePaths.productsListByPetType(product.animalId)}
            prefetch
            className="tw:text-primary tw:underline-offset-4 tw:hover:underline tw:focus-visible:rounded-sm tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
          >
            {product.animal}
          </Link>
        ) : null}
        {product.category ? (
          <Link
            href={routePaths.productsListByCategory(product.categoryId)}
            prefetch
            className="tw:text-secondary-active tw:underline-offset-4 tw:hover:underline tw:focus-visible:rounded-sm tw:focus-visible:ring-3 tw:focus-visible:ring-secondary/25"
          >
            {product.category}
          </Link>
        ) : null}
        {product.subCategory && product.subCategoryId ? (
          <Link
            href={routePaths.productsListBySubCategory(product.subCategoryId)}
            prefetch
            className="tw:text-muted-foreground tw:underline-offset-4 tw:hover:text-foreground tw:hover:underline tw:focus-visible:rounded-sm tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
          >
            {product.subCategory}
          </Link>
        ) : null}
      </div>

      <div className="tw:hidden tw:flex-wrap tw:gap-2 tw:lg:flex">
        {product.animal ? (
          <Badge
            size="sm"
            variant="tonal"
            render={
              product.animalId ? (
                <Link href={routePaths.productsListByPetType(product.animalId)} prefetch />
              ) : undefined
            }
          >
            {product.animal}
          </Badge>
        ) : null}
        {product.category ? (
          <Badge
            size="sm"
            color="secondary"
            variant="tonal"
            render={<Link href={routePaths.productsListByCategory(product.categoryId)} prefetch />}
          >
            {product.category}
          </Badge>
        ) : null}
        {product.subCategory ? (
          <Badge
            size="sm"
            color="neutral"
            variant="outlined"
            render={
              product.subCategoryId ? (
                <Link href={routePaths.productsListBySubCategory(product.subCategoryId)} prefetch />
              ) : undefined
            }
          >
            {product.subCategory}
          </Badge>
        ) : null}
      </div>

      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-x-4 tw:gap-y-2 tw:border-b tw:border-border/70 tw:pb-4 tw:text-label-m">
        <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-warning-active">
          <Star aria-hidden="true" className="tw:size-4 tw:fill-current" />
          <bdi>{product.rating.toLocaleString('fa-IR')}</bdi>
        </span>
        <span className="tw:text-muted-foreground">
          ({product.reviewCount.toLocaleString('fa-IR')} نظر)
        </span>
        {product.brand ? (
          <span>
            برند: <strong className="tw:text-primary">{product.brand}</strong>
          </span>
        ) : null}
      </div>

      <div className="tw:flex tw:items-center tw:gap-2 tw:text-label-m tw:text-success">
        <CircleCheck aria-hidden="true" className="tw:size-5" />
        {product.quantity > 0 ? 'موجود در انبار' : 'ناموجود'}
      </div>

      <Card size="xs" variant="filled" className="tw:rounded-2xl">
        <CardContent className="tw:flex tw:flex-col tw:gap-3">
          <h2 className="tw:text-title-s">امتیاز شما</h2>
          {isSkeleton ? (
            <p className="tw:text-label-m">وضعیت امتیازدهی کاربر در حال دریافت است.</p>
          ) : (
            <ProductRatingForm
              productId={product.id}
              canVote={product.canVote}
              hasRated={product.hasRated}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
