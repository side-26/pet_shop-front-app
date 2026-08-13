import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { buttonVariants, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="صفحه‌بندی"
      data-slot="pagination"
      className={cn('tw:mx-auto tw:flex tw:w-full tw:justify-center', className)}
      {...props}
    />
  );
}
function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('tw:flex tw:items-center tw:gap-1', className)}
      {...props}
    />
  );
}
function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = React.ComponentProps<'a'> &
  Pick<ButtonProps, 'size' | 'color' | 'variant'> & { isActive?: boolean; iconOnly?: boolean };
function PaginationLink({
  className,
  isActive = false,
  size = 'md',
  color = 'primary',
  variant,
  iconOnly = true,
  ...props
}: PaginationLinkProps) {
  const resolvedVariant = variant ?? (isActive ? 'outlined' : 'flat');
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      data-variant={resolvedVariant}
      data-color={color}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      className={cn(buttonVariants({ variant: resolvedVariant, color, size }), className)}
      {...props}
    />
  );
}
function PaginationPrevious({
  className,
  text = 'قبلی',
  ...props
}: PaginationLinkProps & { text?: string }) {
  return (
    <PaginationLink
      aria-label="رفتن به صفحه قبلی"
      iconOnly={false}
      className={cn('tw:ps-2!', className)}
      {...props}
    >
      <ChevronRightIcon data-icon="inline-start" />
      <span className="tw:hidden tw:sm:block">{text}</span>
    </PaginationLink>
  );
}
function PaginationNext({
  className,
  text = 'بعدی',
  ...props
}: PaginationLinkProps & { text?: string }) {
  return (
    <PaginationLink
      aria-label="رفتن به صفحه بعدی"
      iconOnly={false}
      className={cn('tw:pe-2!', className)}
      {...props}
    >
      <span className="tw:hidden tw:sm:block">{text}</span>
      <ChevronLeftIcon data-icon="inline-end" />
    </PaginationLink>
  );
}
function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        'tw:flex tw:size-10 tw:items-center tw:justify-center tw:text-muted-foreground',
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="tw:sr-only">صفحه‌های بیشتر</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  type PaginationLinkProps,
};
