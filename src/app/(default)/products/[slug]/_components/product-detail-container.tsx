import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { getLandingProductBySlugAction } from '@/entities/landing/landing.actions';

import { ProductDetailContent } from './product-detail-content';
import { toProductDetailViewModel } from './product-detail-data';
import { ProductDetailEmptyFetch } from './product-detail-empty-fetch';

type ProductDetailContainerProps = Readonly<{
  productPromise: ReturnType<typeof getLandingProductBySlugAction>;
}>;

export function ProductDetailContainer({ productPromise }: ProductDetailContainerProps) {
  const product = use(productPromise);
  const productViewModel = product?.id ? toProductDetailViewModel(product) : null;

  return (
    <EmptyStateBoundary
      data={productViewModel}
      fallback={<ProductDetailEmptyFetch />}
      isEmpty={() => !productViewModel?.id}
    >
      {productViewModel ? <ProductDetailContent product={productViewModel} /> : null}
    </EmptyStateBoundary>
  );
}
