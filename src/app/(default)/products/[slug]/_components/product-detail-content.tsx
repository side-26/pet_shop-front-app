import { CircleCheck, Star } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { ProductDetailBreadcrumb } from './product-detail-breadcrumb';
import type { ProductDetailViewModel } from './product-detail-data';
import { ProductDetailTabs } from './product-detail-tabs';
import { ProductGallery } from './product-gallery';
import { ProductHeaderActions } from './product-header-actions';
import { ProductPurchaseControls } from './product-purchase-controls';
import { ProductPurchaseSidebar } from './product-purchase-sidebar';
import { ProductRatingForm } from './product-rating-form';
import { ProductSummary } from './product-summary';
import { ProductWeightSelector } from './product-weight-selector';

type ProductDetailContentProps = Readonly<{
  isSkeleton?: boolean;
  product: ProductDetailViewModel;
}>;

export function ProductDetailContent({ isSkeleton = false, product }: ProductDetailContentProps) {
  return (
    <article
      data-product-detail-shell
      data-product-detail-content={isSkeleton ? undefined : true}
      aria-busy={isSkeleton}
      className={cn('tw:default-layout-container tw:pb-8 tw:lg:pb-12', isSkeleton && 'skeleton')}
    >
      <ProductDetailBreadcrumb title={product.title} />

      <ProductGallery
        className="tw:lg:hidden"
        images={product.images}
        discountPercentage={product.discountPercentage}
        isSkeleton={isSkeleton}
      />

      <div className="tw:lg:grid tw:lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] tw:lg:items-start tw:lg:gap-8">
        <div>
          <Card
            size="sm"
            variant="elevated"
            className="tw:rounded-none tw:border-x-0 tw:py-0 tw:lg:grid tw:lg:grid-cols-5 tw:lg:gap-8 tw:lg:rounded-3xl tw:lg:border tw:lg:p-6"
          >
            <ProductGallery
              className="tw:hidden tw:lg:col-span-2 tw:lg:block"
              images={product.images}
              discountPercentage={product.discountPercentage}
              isSkeleton={isSkeleton}
            />

            <CardContent className="tw:flex tw:flex-col tw:gap-5 tw:px-4 tw:py-5 tw:sm:px-6 tw:lg:col-span-3 tw:lg:px-0 tw:lg:py-1">
              <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
                <h1 className="tw:min-w-0 tw:text-title-m tw:leading-8 tw:text-foreground tw:lg:text-title-l">
                  {product.title}
                </h1>
                <ProductHeaderActions title={product.title} disabled={isSkeleton} />
              </div>

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
                    render={
                      <Link href={routePaths.productsListByCategory(product.categoryId)} prefetch />
                    }
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
                        <Link
                          href={routePaths.productsListBySubCategory(product.subCategoryId)}
                          prefetch
                        />
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
                      slug={product.slug}
                      canVote={product.canVote}
                      hasRated={product.hasRated}
                    />
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <ProductSummary summary={product.summary} />
          <ProductDetailTabs product={product} isSkeleton={isSkeleton} />
        </div>

        <ProductPurchaseSidebar product={product} isSkeleton={isSkeleton} />
      </div>

      <ProductPurchaseControls
        mode="mobile"
        price={product.payablePrice}
        previousPrice={product.price}
        quantity={product.quantity}
        weights={product.weights}
        isSkeleton={isSkeleton}
      />
    </article>
  );
}
