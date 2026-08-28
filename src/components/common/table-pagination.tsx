'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';
import { cn } from '@/lib/utils';

type TablePaginationProps = {
  basePath: string;
  query: Record<string, string>;
  page: number;
  pageCount: number;
  total: number;
  itemCount: number;
  itemLabel: string;
  limitOptions: readonly number[];
  disabled?: boolean;
};

export function TablePagination({
  basePath,
  query,
  page,
  pageCount,
  total,
  itemCount,
  itemLabel,
  limitOptions,
  disabled = false,
}: TablePaginationProps) {
  const router = useRouter();
  const initialLimit = limitOptions.includes(Number(query.limit))
    ? String(query.limit)
    : String(limitOptions[0]);
  const selectedLimitRef = useRef(initialLimit);
  const limitItems = limitOptions.map((value) => ({ label: value, value: String(value) }));

  useEffect(() => {
    selectedLimitRef.current = initialLimit;
  }, [initialLimit]);

  function createPageHref(targetPage: number, limit = query.limit) {
    const searchParams = new URLSearchParams(query);
    searchParams.set('page', String(targetPage));
    if (limit) searchParams.set('limit', limit);
    return `${basePath}?${searchParams.toString()}`;
  }

  function handleLimitChange(value: string | null) {
    if (!value || value === selectedLimitRef.current) return;

    selectedLimitRef.current = value;
    router.push(createPageHref(1, value), { scroll: false });
  }

  return (
    <footer className="tw:flex tw:flex-none tw:flex-col tw:items-center tw:justify-between tw:gap-3 tw:px-1 tw:sm:flex-row">
      <p className="tw:flex-none tw:text-label-s tw:text-muted-foreground">
        نمایش {itemCount} {itemLabel} از {total}
      </p>
      <Select
        key={initialLimit}
        items={limitItems}
        defaultValue={initialLimit}
        onValueChange={handleLimitChange}
        disabled={disabled}
      >
        <SelectTrigger
          aria-label="تعداد در هر صفحه"
          className="tw:h-8 tw:w-20 tw:rounded-lg tw:px-2 tw:text-label-s"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {limitOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                <bdi dir="ltr">{option}</bdi>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Pagination className="tw:mx-0 tw:w-auto tw:ms-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageHref(Math.max(1, page - 1))}
              size="sm"
              aria-disabled={page <= 1 || disabled}
              className={cn((page <= 1 || disabled) && 'tw:pointer-events-none tw:opacity-50')}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={createPageHref(page)} size="sm" isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={createPageHref(Math.min(pageCount, page + 1))}
              size="sm"
              aria-disabled={page >= pageCount || disabled}
              className={cn(
                (page >= pageCount || disabled) && 'tw:pointer-events-none tw:opacity-50',
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </footer>
  );
}
