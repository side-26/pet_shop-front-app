import { Suspense } from 'react';

import { getLandingProductBySlugAction } from '@/entities/landing/landing.actions';

import { ProductDetailContainer } from './product-detail-container';
import { ProductDetailContent } from './product-detail-content';
import { productDetailSkeleton } from './product-detail-data';
import { ProductDetailErrorBoundary } from './product-detail-error-boundary';

type ProductDetailSectionProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function ProductDetailSection({ params }: ProductDetailSectionProps) {
  const productPromise = params.then(({ slug }) => getLandingProductBySlugAction(slug));

  return (
    <ProductDetailErrorBoundary>
      <Suspense fallback={<ProductDetailContent product={productDetailSkeleton} isSkeleton />}>
        <ProductDetailContainer productPromise={productPromise} />
      </Suspense>
    </ProductDetailErrorBoundary>
  );
}
