import { TablePagination } from '@/components/common/table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { ProductEnabledSwitch } from './product-enabled-switch';
import { ProductRowActions } from './product-row-actions';
import type { ProductsPageViewModel } from './products-table.types';

type Props = ProductsPageViewModel & { query: Record<string, string>; isLoading?: boolean };

export function ProductsPaginateTable({
  products,
  page,
  pageCount,
  total,
  query,
  isLoading = false,
}: Props) {
  return (
    <section
      aria-busy={isLoading || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4',
        isLoading && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:min-h-0 tw:flex-1 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border">
        <Table className="tw:h-full">
          <TableHeader>
            <TableRow>
              <TableHead>
                <div>عنوان</div>
              </TableHead>
              <TableHead>
                <div>دسته‌بندی</div>
              </TableHead>
              <TableHead>
                <div>زیر دسته‌بندی</div>
              </TableHead>
              <TableHead>
                <div>موجودی</div>
              </TableHead>
              <TableHead>
                <div>وضعیت</div>
              </TableHead>
              <TableHead className="tw:w-16">
                <div>
                  <span className="tw:sr-only">عملیات</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="tw:max-w-64 tw:font-medium tw:whitespace-normal">
                  <div className="tw:line-clamp-2">{product.title}</div>
                </TableCell>
                <TableCell className="tw:max-w-56 tw:whitespace-normal">
                  <div className="tw:line-clamp-2">{product.category}</div>
                </TableCell>
                <TableCell className="tw:max-w-56 tw:whitespace-normal">
                  <div className="tw:line-clamp-2">{product.subCategory}</div>
                </TableCell>
                <TableCell>
                  <bdi dir="ltr">{product.quantity}</bdi>
                </TableCell>
                <TableCell>
                  <ProductEnabledSwitch
                    productId={product.id}
                    productTitle={product.title}
                    isEnable={product.isEnable}
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell>
                  <ProductRowActions
                    productId={product.id}
                    productTitle={product.title}
                    disabled={isLoading}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        basePath={routePaths.adminProducts}
        query={query}
        page={page}
        pageCount={pageCount}
        total={total}
        itemCount={products.length}
        itemLabel="محصول"
        limitOptions={[10, 20, 50, 100]}
        disabled={isLoading}
      />
    </section>
  );
}
