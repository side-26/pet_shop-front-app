'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import type { DialogHandle } from '@/_types';
import {
  PaginationFilters,
  type PaginationFiltersHandle,
  type RangeQueryKeys,
} from '@/components/common/pagination-layout/pagination-filters/default';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { FilterDTO } from '@/entities/pagination/pagination.types';

type MobileCatalogFilterNavigationDrawerProps = Readonly<{
  basePath: string;
  description: string;
  filters: readonly FilterDTO[];
  formId: string;
  label: string;
  query: Readonly<Record<string, string>>;
  rangeQueryKeys?: Readonly<Record<string, RangeQueryKeys>>;
  resetPageOnChange?: boolean;
  title: string;
}>;

export const MobileCatalogFilterNavigationDrawer = forwardRef<
  DialogHandle<void>,
  MobileCatalogFilterNavigationDrawerProps
>(function MobileCatalogFilterNavigationDrawer(
  {
    basePath,
    description,
    filters,
    formId,
    label,
    query,
    rangeQueryKeys,
    resetPageOnChange = true,
    title,
  },
  ref,
) {
  const [open, setOpen] = useState(false);
  const filtersRef = useRef<PaginationFiltersHandle>(null);
  const close = useCallback(() => setOpen(false), []);

  useImperativeHandle(ref, () => ({ close, open: () => setOpen(true) }), [close]);

  return (
    <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
      <DrawerContent color="primary" className="tw:max-h-[calc(100dvh-2rem)] tw:gap-0 tw:p-0">
        <DrawerHeader className="tw:border-b tw:border-border tw:px-6 tw:py-4">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            filtersRef.current?.apply();
          }}
        />
        <div className="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:p-4">
          <PaginationFilters
            ref={filtersRef}
            key={new URLSearchParams(query).toString()}
            basePath={basePath}
            filters={filters}
            idPrefix="mobile"
            label={label}
            onApplied={close}
            query={query}
            rangeQueryKeys={rangeQueryKeys}
            resetPageOnChange={resetPageOnChange}
            showActions={false}
            surface="plain"
          />
        </div>
        <DrawerFooter className="tw:grid tw:grid-cols-2 tw:gap-2 tw:border-t tw:border-border">
          <Button block type="submit" form={formId}>
            اعمال فیلتر
          </Button>
          <DrawerClose render={<Button block type="button" color="error" variant="outlined" />}>
            انصراف
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
