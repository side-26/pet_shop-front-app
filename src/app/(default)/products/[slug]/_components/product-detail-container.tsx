import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { getLandingProductBySlugAction } from '@/entities/landing/landing.actions';

import { ProductDetailContent } from './product-detail-content';
import { createProductDetailViewModel } from './product-detail-data';
import { ProductDetailEmptyFetch } from './product-detail-empty-fetch';

type ProductDetailContainerProps = Readonly<{
  productPromise: ReturnType<typeof getLandingProductBySlugAction>;
}>;

export function ProductDetailContainer({ productPromise }: ProductDetailContainerProps) {
  const product = use(productPromise);

  return (
    <EmptyStateBoundary
      data={product}
      fallback={<ProductDetailEmptyFetch />}
      isEmpty={() => !product?.id}
    >
      <ProductDetailContent product={createProductDetailViewModel(product)} />
    </EmptyStateBoundary>
  );
}
