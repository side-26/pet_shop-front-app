import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { useCheckoutStore } from '@/stores/checkout.store';

import CheckoutPage, { metadata } from './page';

vi.mock('./_components/address-selection/address-selection', () => ({
  CheckoutAddressSelection: () => (
    <section aria-label="انتخاب نشانی تحویل">نشانی‌های تحویل</section>
  ),
}));

afterEach(() => {
  useCheckoutStore.getState().clearCheckout();
  cleanup();
});

describe(routePaths.checkout, () => {
  it('renders addresses, API-backed delivery selection, and the order summary without checkout steps', () => {
    const { container } = render(<CheckoutPage />);
    const pageTitle = screen.getByRole('heading', { level: 1, name: 'ارسال و تحویل سفارش' });
    const pageSubtitle = screen.getByText('نشانی و روش تحویل سفارش را انتخاب کنید.');

    expect(container.querySelector('main')).toBeNull();
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.className).toContain('tw:text-title-l');
    expect(pageSubtitle.className).toContain('tw:text-caption');
    expect(screen.queryByRole('list', { name: 'مراحل ثبت سفارش' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'زمان تحویل' })).toBeTruthy();
    expect(screen.getByLabelText('انتخاب نشانی تحویل')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'سرویس ارسال' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'روش ارسال' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'خلاصه سفارش' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'سبد خرید' }).getAttribute('href')).toBe(
      routePaths.cart,
    );
  });

  it('does not show appointment choices before a delivery service is selected', () => {
    render(<CheckoutPage />);

    expect(screen.queryByRole('radio', { name: /ارسال سریع/ })).toBeNull();
    expect(screen.queryByRole('radiogroup', { name: 'انتخاب روز تحویل' })).toBeNull();
    expect(screen.getByText('زمان تحویل را انتخاب کنید')).toBeTruthy();
  });

  it('defines checkout metadata', () => {
    expect(metadata.title).toBe('ارسال و تحویل سفارش | پت شاپ پرشین');
  });
});
