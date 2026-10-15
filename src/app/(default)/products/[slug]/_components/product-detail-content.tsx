import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ProductDetailBreadcrumb } from './product-detail-breadcrumb';
import type { ProductDetailViewModel } from './product-detail-data';
import { ProductDetailTabs } from './product-detail-tabs';
import { ProductGallery } from './product-gallery';
import { ProductHeaderActions } from './product-header-actions';
import { ProductInformationSection } from './product-information-section';
import { ProductPurchaseControls } from './product-purchase-controls';
import { ProductPurchaseSidebar } from './product-purchase-sidebar';
import { ProductSummary } from './product-summary';

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
                <ProductHeaderActions
                  title={product.title}
                  itemId={product.id}
                  itemType="product"
                  disabled={isSkeleton}
                />
              </div>

              <ProductInformationSection product={product} isSkeleton={isSkeleton} />
            </CardContent>
          </Card>

          <ProductSummary summary={product.summary} />
          <ProductDetailTabs product={product} isSkeleton={isSkeleton} />
        </div>

        <ProductPurchaseSidebar product={product} isSkeleton={isSkeleton} />
      </div>

      <ProductPurchaseControls
        productId={product.id}
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
