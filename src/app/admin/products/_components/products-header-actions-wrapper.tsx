import { Suspense } from 'react';

import { getProductFormOptionsAction } from '@/entities/products/products.actions';

import { parseProductsFilterSearchParams, type SearchParams } from './products-filter.helpers';
import { ProductsHeaderActions } from './products-header-actions';

type Props = { searchParams: Promise<SearchParams> };

async function Content({ searchParams }: Props) {
  const [params, options] = await Promise.all([searchParams, getProductFormOptionsAction()]);
  return (
    <ProductsHeaderActions
      initialValues={parseProductsFilterSearchParams(params)}
      options={options.isSuccess ? options.data : undefined}
    />
  );
}

export function ProductsHeaderActionsWrapper({ searchParams }: Props) {
  return (
    <Suspense fallback={<ProductsHeaderActions />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
