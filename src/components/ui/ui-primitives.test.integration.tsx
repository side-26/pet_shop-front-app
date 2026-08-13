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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

afterEach(cleanup);

describe('Pet Shop UI primitives', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'لغو' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
