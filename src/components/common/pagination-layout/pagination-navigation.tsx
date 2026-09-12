import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { createPaginationHref } from '@/entities/pagination/pagination.helpers';
import type { PaginationDTO } from '@/entities/pagination/pagination.dto';

type PaginationNavigationProps = Readonly<{
  basePath: string;
  disabled?: boolean;
  itemCount: number;
  itemLabel: string;
  pagination: PaginationDTO;
  query: Readonly<Record<string, string>>;
}>;

export function PaginationNavigation({
  basePath,
  disabled = false,
  itemCount,
  itemLabel,
  pagination,
  query,
}: PaginationNavigationProps) {
  const { currentPage, totalItems, totalPages } = pagination;
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <footer className="tw:flex tw:flex-col tw:items-center tw:justify-between tw:gap-3 tw:sm:flex-row">
      <p className="tw:text-label-s tw:text-muted-foreground">
        نمایش {itemCount.toLocaleString('fa-IR')} {itemLabel} از{' '}
        {totalItems.toLocaleString('fa-IR')}
      </p>
      <Pagination className="tw:mx-0 tw:w-auto tw:sm:ms-auto">
        <PaginationContent>
          {pages.map((page) => (
            <PaginationItem key={page}>
              <Link
                href={createPaginationHref(basePath, query, { page })}
                scroll={false}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
                aria-label={`صفحه ${page.toLocaleString('fa-IR')}`}
                className={buttonVariants({
                  color: 'primary',
                  size: 'sm',
                  variant: page === currentPage ? 'outlined' : 'flat',
                })}
              >
                {page.toLocaleString('fa-IR')}
              </Link>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </footer>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 1) return [1];
  const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  return Array.from({ length: Math.min(3, totalPages) }, (_, index) => start + index);
}
