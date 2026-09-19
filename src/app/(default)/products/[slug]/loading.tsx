import { ProductDetailContent } from './_components/product-detail-content';
import { productDetailSkeleton } from './_components/product-detail-data';

export default function ProductDetailLoading() {
  return <ProductDetailContent product={productDetailSkeleton} isSkeleton />;
}
