'use client';

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { PaginationSort } from '@/components/common/pagination-layout/pagination-sort';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { SortDTO } from '@/entities/pagination/pagination.types';

import type { ProductListMobileDialogHandle } from './product-list-mobile-dialog.types';

type Props = Readonly<{
  basePath: string;
  onClosed: () => void;
  openOnMount?: boolean;
  query: Readonly<Record<string, string>>;
  resetPageOnChange?: boolean;
  sort?: SortDTO;
}>;

export const ProductListSortDialog = forwardRef<ProductListMobileDialogHandle, Props>(
  function ProductListSortDialog(
    { basePath, onClosed, openOnMount = false, query, resetPageOnChange = true, sort },
    ref,
  ) {
    const [open, setOpen] = useState(openOnMount);
    const close = useCallback(() => {
      setOpen(false);
      onClosed();
    }, [onClosed]);

    useImperativeHandle(
      ref,
      () => ({
        close,
        open: () => setOpen(true),
        toggle: () => (open ? close() : setOpen(true)),
      }),
      [close, open],
    );

    return (
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setOpen(true);
          else close();
        }}
      >
        <DialogContent size="sm">
          <DialogTitle>مرتب‌سازی</DialogTitle>
          <DialogDescription>ترتیب نمایش نتیجه‌ها را انتخاب کنید.</DialogDescription>
          <PaginationSort
            basePath={basePath}
            compact
            query={query}
            resetPageOnChange={resetPageOnChange}
            sort={sort}
          />
        </DialogContent>
      </Dialog>
    );
  },
);
