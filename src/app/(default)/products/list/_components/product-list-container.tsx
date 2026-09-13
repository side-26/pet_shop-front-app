import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { ProductListFetchError } from './product-list-fetch-error';
import { ProductListRenderer } from './product-list-renderer';

type ProductListContainerProps = Readonly<{
  productsPromise: Promise<FetcherResult<LandingProductListPageDTO>>;
  query: Readonly<Record<string, string>>;
}>;

export async function ProductListContainer({ productsPromise, query }: ProductListContainerProps) {
  const result = await productsPromise;
  if (!result.isSuccess) return <ProductListFetchError description={result.message} />;
  return <ProductListRenderer data={result.data} query={query} />;
}
