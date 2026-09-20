import { Suspense } from 'react';

import { getLandingProductBySlugAction } from '@/entities/landing/landing.actions';

import { ProductDetailContainer } from './product-detail-container';
import { ProductDetailContent } from './product-detail-content';
import { productDetailSkeleton } from './product-detail-data';

type ProductDetailSectionProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function ProductDetailSection({ params }: ProductDetailSectionProps) {
  const slugPromise = params.then(({ slug }) => slug);
  const productPromise = slugPromise.then(getLandingProductBySlugAction);

  return (
    <Suspense fallback={<ProductDetailContent product={productDetailSkeleton} isSkeleton />}>
      <ProductDetailContainer productPromise={productPromise} slugPromise={slugPromise} />
    </Suspense>
  );
}
