import type { ProductDetailViewModel } from './product-detail-data';
import { ProductPurchaseControls } from './product-purchase-controls';

type ProductMobilePurchaseSectionProps = Readonly<{ product: ProductDetailViewModel }>;

/** Owns the mobile-only, fixed product-purchase dock. */
export function ProductMobilePurchaseSection({ product }: ProductMobilePurchaseSectionProps) {
  return (
    <ProductPurchaseControls
      productId={product.id}
      mode="mobile"
      defaultPurchase={product.purchase}
      weights={product.weights}
    />
  );
}
