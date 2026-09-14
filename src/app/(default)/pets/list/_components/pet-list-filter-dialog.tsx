'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import {
  PaginationFilters,
  type PaginationFiltersHandle,
  type RangeQueryKeys,
} from '@/components/common/pagination-layout/pagination-filters/default';
import { Dialog } from '@/components/ui/dialog';
import type { FilterDTO } from '@/entities/pagination/pagination.types';

import type { PetListMobileDialogHandle } from './pet-list-mobile-dialog.types';

const FORM_ID = 'pet-list-mobile-filter-form';

type Props = Readonly<{
  basePath: string;
  filters: readonly FilterDTO[];
  onClosed: () => void;
  openOnMount?: boolean;
  query: Readonly<Record<string, string>>;
  rangeQueryKeys?: Readonly<Record<string, RangeQueryKeys>>;
  resetPageOnChange?: boolean;
}>;

export const PetListFilterDialog = forwardRef<PetListMobileDialogHandle, Props>(
  function PetListFilterDialog(
    {
      basePath,
      filters,
      onClosed,
      openOnMount = false,
      query,
      rangeQueryKeys,
      resetPageOnChange = true,
    },
    ref,
  ) {
    const [open, setOpen] = useState(openOnMount);
    const filtersRef = useRef<PaginationFiltersHandle>(null);
    const close = useCallback(() => {
      setOpen(false);
      onClosed();
    }, [onClosed]);

    useImperativeHandle(
      ref,
      () => ({ close, open: () => setOpen(true), toggle: () => (open ? close() : setOpen(true)) }),
      [close, open],
    );

    return (
      <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : close())}>
        <FilterFormDialogContent
          formId={FORM_ID}
          onClose={close}
          size="lg"
          title="فیلتر حیوانات"
          contentClassName="tw:max-h-[60dvh] tw:overflow-y-auto"
        >
          <form
            id={FORM_ID}
            onSubmit={(event) => {
              event.preventDefault();
              filtersRef.current?.apply();
            }}
          />
          <PaginationFilters
            ref={filtersRef}
            key={new URLSearchParams(query).toString()}
            basePath={basePath}
            filters={filters}
            idPrefix="mobile"
            label="فیلتر حیوانات"
            onApplied={close}
            query={query}
            rangeQueryKeys={rangeQueryKeys}
            resetPageOnChange={resetPageOnChange}
            showActions={false}
            surface="plain"
          />
        </FilterFormDialogContent>
      </Dialog>
    );
  },
);
