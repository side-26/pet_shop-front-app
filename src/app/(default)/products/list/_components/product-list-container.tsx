import { use } from 'react';

import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';

import { ProductListRenderer } from './product-list-renderer';

type ProductListContainerProps = Readonly<{
  productsPromise: Promise<LandingProductListPageDTO>;
  query: Readonly<Record<string, string>>;
}>;

export function ProductListContainer({ productsPromise, query }: ProductListContainerProps) {
  const data = use(productsPromise);
  return <ProductListRenderer data={data} query={query} />;
}
