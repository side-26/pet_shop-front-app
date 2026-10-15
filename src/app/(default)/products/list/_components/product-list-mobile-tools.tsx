'use client';

import { useMemo, useRef } from 'react';
import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';

import type { DialogHandle } from '@/_types';
import { MobileCatalogFilterNavigationDrawer } from '@/components/common/pagination-layout/mobile-catalog-filter-navigation-drawer';
import type { RangeQueryKeys } from '@/components/common/pagination-layout/pagination-filters/default';
import { MobileCatalogSortNavigationDrawer } from '@/components/common/pagination-layout/mobile-catalog-sort-navigation-drawer';
import { Button } from '@/components/ui/button';
import type { FilterDTO, SortDTO } from '@/entities/pagination/pagination.types';
import { useDialogController } from '@/hooks/use-dialog-controller';

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
  const filterDrawerRef = useRef<DialogHandle<void>>(null);
  const sortDrawerRef = useRef<DialogHandle<void>>(null);
  const { open } = useDialogController(
    useMemo(
      () => ({ filterDrawer: { ref: filterDrawerRef }, sortDrawer: { ref: sortDrawerRef } }),
      [],
    ),
  );

  return (
    <>
      <div className="tw:sticky tw:top-20 tw:z-20 tw:grid tw:grid-cols-2 tw:gap-2 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-background/90 tw:p-2 tw:shadow-lg tw:shadow-foreground/5 tw:supports-backdrop-filter:backdrop-blur-xl tw:lg:hidden">
        <Button
          disabled={disabled}
          variant="tonal"
          color="secondary"
          block
          type="button"
          onClick={() => open('filterDrawer')}
        >
          <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
          فیلترها
        </Button>
        <Button
          disabled={disabled}
          variant="outlined"
          block
          type="button"
          onClick={() => open('sortDrawer')}
        >
          <ArrowDownUp data-icon="inline-start" aria-hidden="true" />
          مرتب‌سازی
        </Button>
      </div>

      <MobileCatalogFilterNavigationDrawer
        ref={filterDrawerRef}
        basePath={basePath}
        description="فیلترهای دلخواهتان را برای یافتن محصول مناسب انتخاب کنید."
        filters={filters}
        formId="product-list-mobile-filter-form"
        label="فیلتر محصولات"
        query={query}
        rangeQueryKeys={rangeQueryKeys}
        resetPageOnChange={resetPageOnChange}
        title="فیلتر محصولات"
      />
      <MobileCatalogSortNavigationDrawer
        ref={sortDrawerRef}
        basePath={basePath}
        description="ترتیب نمایش نتیجه‌ها را انتخاب کنید."
        query={query}
        resetPageOnChange={resetPageOnChange}
        sort={sort}
        title="مرتب‌سازی"
      />
    </>
  );
}
