import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { SubCategoryOption } from './sub-categories-form.types';
import { SubCategoryRowActions } from './sub-category-row-actions';
import type { SubCategoryTableRow } from './sub-categories-table.types';

type Props = {
  rows: SubCategoryTableRow[];
  categories?: readonly SubCategoryOption[];
  isSkeleton?: boolean;
};

function displayValue(value: string) {
  return value.trim() || '_';
}

export function SubCategoriesTable({ rows, categories = [], isSkeleton = false }: Props) {
  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:min-h-0 tw:flex-1 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>نوع حیوان</TableHead>
              <TableHead className="tw:w-16">
                <span className="tw:sr-only">عملیات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="tw:font-medium">{displayValue(row.title)}</TableCell>
                  <TableCell>{displayValue(row.categoryTitle)}</TableCell>
                  <TableCell>{displayValue(row.petTypeTitle)}</TableCell>
                  <TableCell>
                    <SubCategoryRowActions
                      subCategoryId={row.id}
                      subCategoryTitle={displayValue(row.title)}
                      categories={categories}
                      disabled={isSkeleton}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="tw:h-24 tw:text-center tw:text-muted-foreground">
                  زیر دسته‌بندی‌ای برای نمایش وجود ندارد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
