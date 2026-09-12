import type { CustomerProductsPageDTO } from '@/entities/products/products.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { ProductListFetchError } from './product-list-fetch-error';
import { ProductListRenderer } from './product-list-renderer';

type ProductListContainerProps = Readonly<{
  productsPromise: Promise<FetcherResult<CustomerProductsPageDTO>>;
  query: Readonly<Record<string, string>>;
}>;

export async function ProductListContainer({ productsPromise, query }: ProductListContainerProps) {
  const result = await productsPromise;
  if (!result.isSuccess) return <ProductListFetchError description={result.message} />;
  return <ProductListRenderer data={result.data} query={query} />;
}
