'use client';

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import type { DialogHandle } from '@/_types';
import { PaginationSort } from '@/components/common/pagination-layout/pagination-sort';
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
import type { SortDTO } from '@/entities/pagination/pagination.types';

type MobileCatalogSortNavigationDrawerProps = Readonly<{
  basePath: string;
  description: string;
  query: Readonly<Record<string, string>>;
  resetPageOnChange?: boolean;
  sort?: SortDTO;
  title: string;
}>;

export const MobileCatalogSortNavigationDrawer = forwardRef<
  DialogHandle<void>,
  MobileCatalogSortNavigationDrawerProps
>(function MobileCatalogSortNavigationDrawer(
  { basePath, description, query, resetPageOnChange = true, sort, title },
  ref,
) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useImperativeHandle(ref, () => ({ close, open: () => setOpen(true) }), [close]);

  return (
    <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
      <DrawerContent color="primary" className="tw:max-h-[calc(100dvh-2rem)] tw:gap-0 tw:p-0">
        <DrawerHeader className="tw:border-b tw:border-border tw:px-6 tw:py-4">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:p-4">
          <PaginationSort
            basePath={basePath}
            compact
            query={query}
            resetPageOnChange={resetPageOnChange}
            sort={sort}
          />
        </div>
        <DrawerFooter className="tw:border-t tw:border-border">
          <DrawerClose render={<Button block type="button" color="error" variant="outlined" />}>
            بستن
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
