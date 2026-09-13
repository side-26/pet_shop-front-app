'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import type { RangeQueryKeys } from '@/components/common/pagination-layout/pagination-filters/default';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { FilterDTO, SortDTO } from '@/entities/pagination/pagination.types';

import type { ProductListMobileDialogHandle } from './product-list-mobile-dialog.types';

function ProductListFilterDialogSkeleton() {
  return (
    <Dialog open>
      <FilterFormDialogContent
        formId="product-list-mobile-filter-loading"
        isLoading
        onClose={() => undefined}
        size="lg"
        title="فیلتر محصولات"
      >
        <form id="product-list-mobile-filter-loading">
          <fieldset disabled className="skeleton tw:flex tw:flex-col tw:gap-4" aria-busy="true">
            <div className="tw:h-10 tw:rounded-xl tw:bg-muted" />
            <div className="tw:h-10 tw:rounded-xl tw:bg-muted" />
            <div className="tw:h-10 tw:rounded-xl tw:bg-muted" />
          </fieldset>
        </form>
      </FilterFormDialogContent>
    </Dialog>
  );
}

function ProductListSortDialogSkeleton() {
  return (
    <Dialog open>
      <DialogContent size="sm">
        <DialogTitle>مرتب‌سازی</DialogTitle>
        <DialogDescription>ترتیب نمایش نتیجه‌ها را انتخاب کنید.</DialogDescription>
        <div
          aria-busy="true"
          aria-label="در حال بارگذاری مرتب‌سازی"
          className="skeleton tw:flex tw:flex-col tw:gap-2"
        >
          <div className="tw:h-10 tw:rounded-xl tw:bg-muted" />
          <div className="tw:h-10 tw:rounded-xl tw:bg-muted" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

const LazyProductListFilterDialog = dynamic(
  () => import('./product-list-filter-dialog').then((module) => module.ProductListFilterDialog),
  { loading: ProductListFilterDialogSkeleton },
);
const LazyProductListSortDialog = dynamic(
  () => import('./product-list-sort-dialog').then((module) => module.ProductListSortDialog),
  { loading: ProductListSortDialogSkeleton },
);

type Props = Readonly<{
  basePath: string;
  disabled?: boolean;
  filters: readonly FilterDTO[];
  query: Readonly<Record<string, string>>;
  rangeQueryKeys?: Readonly<Record<string, RangeQueryKeys>>;
  resetPageOnChange?: boolean;
  sort?: SortDTO;
}>;

export function ProductListMobileTools({
  basePath,
  disabled = false,
  filters,
  query,
  rangeQueryKeys,
  resetPageOnChange = true,
  sort,
}: Props) {
  const filterDialogRef = useRef<ProductListMobileDialogHandle>(null);
  const sortDialogRef = useRef<ProductListMobileDialogHandle>(null);
  const [filterDialogMounted, setFilterDialogMounted] = useState(false);
  const [sortDialogMounted, setSortDialogMounted] = useState(false);

  const openFilterDialog = useCallback(() => {
    if (filterDialogRef.current) filterDialogRef.current.open();
    else setFilterDialogMounted(true);
  }, []);
  const openSortDialog = useCallback(() => {
    if (sortDialogRef.current) sortDialogRef.current.open();
    else setSortDialogMounted(true);
  }, []);

  return (
    <>
      <div className="tw:sticky tw:top-20 tw:z-20 tw:grid tw:grid-cols-2 tw:gap-2 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-background/90 tw:p-2 tw:shadow-lg tw:shadow-foreground/5 tw:supports-backdrop-filter:backdrop-blur-xl tw:lg:hidden">
        <Button
          disabled={disabled}
          variant="tonal"
          color="secondary"
          block
          onClick={openFilterDialog}
        >
          <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
          فیلترها
        </Button>
        <Button disabled={disabled} variant="outlined" block onClick={openSortDialog}>
          <ArrowDownUp data-icon="inline-start" aria-hidden="true" />
          مرتب‌سازی
        </Button>
      </div>

      {filterDialogMounted ? (
        <LazyProductListFilterDialog
          ref={filterDialogRef}
          basePath={basePath}
          filters={filters}
          openOnMount
          onClosed={() => setFilterDialogMounted(false)}
          query={query}
          rangeQueryKeys={rangeQueryKeys}
          resetPageOnChange={resetPageOnChange}
        />
      ) : null}
      {sortDialogMounted ? (
        <LazyProductListSortDialog
          ref={sortDialogRef}
          basePath={basePath}
          openOnMount
          onClosed={() => setSortDialogMounted(false)}
          query={query}
          resetPageOnChange={resetPageOnChange}
          sort={sort}
        />
      ) : null}
    </>
  );
}
