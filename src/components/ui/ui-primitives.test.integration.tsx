import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { popoverVariants } from '@/components/ui/popover';
import { spinnerVariants } from '@/components/ui/spinner';
import { tooltipVariants } from '@/components/ui/tooltip';
import { dialogContentVariants } from '@/components/ui/dialog';
import { toastVariants } from '@/components/ui/toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

afterEach(cleanup);

describe('Pet Shop UI primitives', () => {
  it('renders Data Table rows, empty state, and pagination controls', () => {
    const columns: ColumnDef<{ name: string }>[] = [{ accessorKey: 'name', header: 'نام' }];
    const { rerender } = render(<DataTable columns={columns} data={[{ name: 'میشا' }]} />);
    expect(screen.getByText('میشا')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'قبلی' }).hasAttribute('disabled')).toBe(true);
    rerender(<DataTable columns={columns} data={[]} emptyLabel="بدون داده" />);
    expect(screen.getByText('بدون داده')).toBeTruthy();
  });

  it('exposes Button Group orientation and accessible grouping', () => {
    render(
      <ButtonGroup aria-label="ابزارها" orientation="vertical">
        <Button>یک</Button>
        <Button>دو</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'ابزارها' }).getAttribute('data-orientation')).toBe(
      'vertical',
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
  it('resolves floating surface and spinner colors explicitly', () => {
    expect(popoverVariants({ color: 'error', variant: 'fill' })).toContain(
      'tw:text-error-foreground',
    );
    expect(popoverVariants({ color: 'error', variant: 'outlined' })).toContain('tw:text-error');
    expect(tooltipVariants({ color: 'warning', variant: 'fill' }).content()).toContain(
      'tw:text-warning-foreground',
    );
    expect(tooltipVariants({ color: 'success', variant: 'tonal' }).content()).toContain(
      'tw:text-success-muted-foreground',
    );
    expect(spinnerVariants({ color: 'error', size: 'xl' })).toContain('tw:text-error');
  });

  it('resolves Dialog sizes and Toast foregrounds from their final surfaces', () => {
    expect(dialogContentVariants({ size: 'xl' })).toContain('tw:max-w-2xl');
    expect(toastVariants({ color: 'error', variant: 'fill' })).toContain(
      'tw:text-error-foreground',
    );
    expect(toastVariants({ color: 'warning', variant: 'tonal' })).toContain(
      'tw:text-warning-muted-foreground',
    );
    expect(toastVariants({ color: 'success', variant: 'outlined' })).toContain('tw:text-success');
  });

  it('renders accessible Pagination state with the project Button contract', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="?page=2" isActive size="lg" aria-label="صفحه ۲">
              ۲
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    const link = screen.getByRole('link', { name: 'صفحه ۲' });
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.getAttribute('data-size')).toBe('lg');
    expect(link.getAttribute('data-variant')).toBe('outlined');
  });

  it('applies explicit Pagination color and variant modes', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="?page=3" variant="tonal" color="error" aria-label="صفحه ۳">
              ۳
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    const link = screen.getByRole('link', { name: 'صفحه ۳' });
    expect(link.getAttribute('data-color')).toBe('error');
    expect(link.getAttribute('data-variant')).toBe('tonal');
    expect(link.className).toContain('tw:text-error-muted-foreground');
  });

  it('uses RTL-first physical directions for previous and next Pagination controls', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="?page=1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="?page=3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(
      screen
        .getByRole('link', { name: 'رفتن به صفحه قبلی' })
        .querySelector('svg')
        ?.getAttribute('class'),
    ).toContain('lucide-chevron-right');
    expect(
      screen
        .getByRole('link', { name: 'رفتن به صفحه بعدی' })
        .querySelector('svg')
        ?.getAttribute('class'),
    ).toContain('lucide-chevron-left');
  });
  it('selects Button foregrounds after resolving color and variant together', () => {
    expect(buttonVariants({ color: 'error', variant: 'fill' })).toContain(
      'tw:text-error-foreground',
    );
    expect(buttonVariants({ color: 'error', variant: 'outlined' })).toContain('tw:text-error');
    expect(buttonVariants({ color: 'warning', variant: 'fill' })).toContain(
      'tw:text-warning-foreground',
    );
    expect(buttonVariants({ color: 'warning', variant: 'tonal' })).toContain(
      'tw:text-warning-muted-foreground',
    );
    expect(buttonVariants({ color: 'secondary', variant: 'transparent' })).toContain(
      'tw:text-secondary-active',
    );
  });

  it('selects Badge foregrounds after resolving color and variant together', () => {
    expect(badgeVariants({ color: 'error', variant: 'fill' })).toContain(
      'tw:text-error-foreground',
    );
    expect(badgeVariants({ color: 'error', variant: 'outlined' })).toContain('tw:text-error');
    expect(badgeVariants({ color: 'success', variant: 'tonal' })).toContain(
      'tw:text-success-muted-foreground',
    );
    expect(badgeVariants({ color: 'primary', variant: 'transparent' })).toContain(
      'tw:text-primary',
    );
  });

  it('keeps Button semantic, configurable, and inert when disabled', () => {
    const onClick = vi.fn();

    render(
      <Button color="success" variant="tonal" size="lg" disabled onClick={onClick}>
        ثبت سفارش
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'ثبت سفارش' });
    expect(button.getAttribute('data-color')).toBe('success');
    expect(button.getAttribute('data-variant')).toBe('tonal');
    expect(button.getAttribute('data-size')).toBe('lg');

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders Badge as a link without losing its semantic style state', () => {
    render(
      <Badge render={<a href="/orders" />} color="info" variant="outlined" size="sm">
        پیگیری سفارش
      </Badge>,
    );

    const badge = screen.getByRole('link', { name: 'پیگیری سفارش' });
    expect(badge.getAttribute('href')).toBe('/orders');
    expect(badge.getAttribute('data-color')).toBe('info');
    expect(badge.getAttribute('data-variant')).toBe('outlined');
  });

  it('preserves the complete Card composition and semantic heading', () => {
    render(
      <Card variant="glass" size="lg">
        <CardHeader>
          <CardTitle>سفارش اخیر</CardTitle>
          <CardDescription>به‌روزرسانی امروز</CardDescription>
          <CardAction>جدید</CardAction>
        </CardHeader>
        <CardContent>جزئیات سفارش</CardContent>
        <CardFooter>مشاهده</CardFooter>
      </Card>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'سفارش اخیر' })).toBeTruthy();
    const card = screen.getByText('جزئیات سفارش').closest('[data-slot="card"]');
    expect(card?.getAttribute('data-variant')).toBe('glass');
    expect(card?.getAttribute('data-size')).toBe('lg');
  });

  it('labels Alert Dialog, closes with Cancel, and restores trigger focus', async () => {
    render(
      <DirectionProvider direction="rtl">
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outlined" />}>حذف آدرس</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>آدرس حذف شود؟</AlertDialogTitle>
              <AlertDialogDescription>این تغییر قابل بازگشت نیست.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>لغو</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DirectionProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'حذف آدرس' });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('alertdialog', { name: 'آدرس حذف شود؟' });
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();

    const cancel = screen.getByRole('button', { name: 'لغو' });
    expect(cancel.getAttribute('data-variant')).toBe('outlined');
    expect(cancel.getAttribute('data-color')).toBe('error');

    fireEvent.click(cancel);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
