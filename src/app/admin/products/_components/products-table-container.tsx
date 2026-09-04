import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { getManagementProductsAction } from '@/entities/products/products.actions';

import { ProductsPaginateTable } from './products-paginate-table';
import { mapProductsPageViewModel } from './products-table.mapper';

type Props = {
  productsPromise: ReturnType<typeof getManagementProductsAction>;
  query: Record<string, string>;
};

export async function ProductsTableContainer({ productsPromise, query }: Props) {
  const result = await productsPromise;
  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت محصولات انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message ?? 'خطایی در دریافت محصولات رخ داد.'}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  if (!result.data.result.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>محصولی یافت نشد</EmptyTitle>
          <EmptyDescription>فیلترها را تغییر دهید یا محصول جدیدی اضافه کنید.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return <ProductsPaginateTable {...mapProductsPageViewModel(result.data)} query={query} />;
}
