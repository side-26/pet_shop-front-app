import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { ProductDetailViewModel } from './product-detail-data';
import { ProductPurchaseControls } from './product-purchase-controls';

type ProductPurchaseSidebarProps = Readonly<{ product: ProductDetailViewModel }>;

export function ProductPurchaseSidebar({ product }: ProductPurchaseSidebarProps) {
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
          <ProductPurchaseControls
            productId={product.id}
            mode="desktop"
            defaultPurchase={product.purchase}
            weights={product.weights}
          />
        </CardContent>
      </Card>
    </aside>
  );
}
