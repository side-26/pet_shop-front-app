import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { ProductDetailViewModel } from './product-detail-data';
import { ProductPurchaseControls } from './product-purchase-controls';
import { ProductWeightSelector } from './product-weight-selector';

type ProductPurchaseSidebarProps = Readonly<{
  isSkeleton?: boolean;
  product: ProductDetailViewModel;
}>;

export function ProductPurchaseSidebar({ isSkeleton, product }: ProductPurchaseSidebarProps) {
  return (
    <aside
      aria-label="خرید محصول"
      className="tw:relative tw:hidden tw:self-start tw:lg:sticky tw:lg:top-28 tw:lg:block"
    >
      <Card size="sm" variant="elevated" className="tw:rounded-3xl">
        <CardHeader>
          <CardTitle>خرید محصول</CardTitle>
        </CardHeader>
        <CardContent className="tw:flex tw:flex-col tw:gap-5">
          <ProductWeightSelector
            idPrefix="product-weight-sidebar"
            weights={product.weights}
            disabled={isSkeleton}
          />
          <ProductPurchaseControls
            mode="desktop"
            price={product.payablePrice}
            previousPrice={product.price}
            quantity={product.quantity}
            isSkeleton={isSkeleton}
          />
        </CardContent>
      </Card>
    </aside>
  );
}
