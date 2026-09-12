'use client';

import { ArrowDownUp } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { createPaginationHref } from '@/entities/pagination/pagination.helpers';
import type { SortDTO } from '@/entities/pagination/pagination.types';

type PaginationSortProps = Readonly<{
  basePath: string;
  compact?: boolean;
  disabled?: boolean;
  query: Readonly<Record<string, string>>;
  sort?: SortDTO;
}>;

export function PaginationSort({
  basePath,
  compact = false,
  disabled = false,
  query,
  sort,
}: PaginationSortProps) {
  const router = useRouter();

  if (!sort?.options.length) {
    if (compact)
      return <p className="tw:text-body-s tw:text-muted-foreground">مرتب‌سازی در دسترس نیست.</p>;
    return (
      <div className="tw:hidden tw:items-center tw:gap-2 tw:rounded-2xl tw:border tw:border-border/70 tw:bg-card tw:p-3 tw:text-body-s tw:text-muted-foreground tw:lg:flex">
        <ArrowDownUp aria-hidden="true" />
        مرتب‌سازی برای این فهرست در دسترس نیست.
      </div>
    );
  }

  const current = query.sort ?? sort.current;
  return (
    <div
      className={
        compact
          ? 'tw:flex tw:flex-col tw:gap-2'
          : 'tw:hidden tw:items-center tw:justify-between tw:gap-4 tw:rounded-2xl tw:border tw:border-border/70 tw:bg-card tw:p-3 tw:lg:flex'
      }
    >
      <div className="tw:flex tw:items-center tw:gap-2 tw:text-label-m tw:text-muted-foreground">
        <ArrowDownUp aria-hidden="true" />
        <span>مرتب‌سازی:</span>
      </div>
      <div
        className={
          compact ? 'tw:flex tw:flex-col tw:gap-2' : 'tw:flex tw:flex-wrap tw:justify-end tw:gap-1'
        }
      >
        {sort.options.map((option) => {
          const isActive = option.value === current;
          return (
            <Button
              key={option.value}
              size="sm"
              block={compact}
              variant={isActive ? 'tonal' : 'flat'}
              color={isActive ? 'primary' : 'secondary'}
              disabled={disabled}
              onClick={() =>
                router.push(
                  createPaginationHref(basePath, query, { page: 1, sort: option.value }),
                  { scroll: false },
                )
              }
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
