'use client';

import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { FilterDTO, SortDTO } from '@/entities/pagination/pagination.types';

import { PaginationFilters } from './pagination-filters';
import { PaginationSort } from './pagination-sort';

type PaginationMobileToolsProps = Readonly<{
  basePath: string;
  disabled?: boolean;
  filterLabel: string;
  filters: readonly FilterDTO[];
  query: Readonly<Record<string, string>>;
  sort?: SortDTO;
}>;

export function PaginationMobileTools({
  basePath,
  disabled = false,
  filterLabel,
  filters,
  query,
  sort,
}: PaginationMobileToolsProps) {
  return (
    <div className="tw:sticky tw:top-20 tw:z-20 tw:grid tw:grid-cols-2 tw:gap-2 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-background/90 tw:p-2 tw:shadow-lg tw:shadow-foreground/5 tw:supports-backdrop-filter:backdrop-blur-xl tw:lg:hidden">
      <Dialog>
        <DialogTrigger
          disabled={disabled}
          render={<Button variant="tonal" color="secondary" block />}
        >
          <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
          فیلترها
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogTitle>{filterLabel}</DialogTitle>
          <DialogDescription>گزینه‌های فیلتر این فهرست را انتخاب کنید.</DialogDescription>
          <PaginationFilters
            basePath={basePath}
            filters={filters}
            idPrefix="mobile"
            label={filterLabel}
            query={query}
            variant="filled"
          />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger disabled={disabled} render={<Button variant="outlined" block />}>
          <ArrowDownUp data-icon="inline-start" aria-hidden="true" />
          مرتب‌سازی
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogTitle>مرتب‌سازی</DialogTitle>
          <DialogDescription>ترتیب نمایش نتیجه‌ها را انتخاب کنید.</DialogDescription>
          <PaginationSort basePath={basePath} compact query={query} sort={sort} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
