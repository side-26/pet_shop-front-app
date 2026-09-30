import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

    expect(container.querySelector('main')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'ارسال و تحویل سفارش' })).toBeTruthy();
    expect(screen.queryByRole('list', { name: 'مراحل ثبت سفارش' })).toBeNull();
    expect(screen.getByRole('radiogroup', { name: 'انتخاب روز تحویل' })).toBeTruthy();
    expect(screen.getByRole('radiogroup', { name: 'انتخاب بازه زمانی تحویل' })).toBeTruthy();
    expect(screen.getByLabelText('انتخاب نشانی تحویل')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'سرویس ارسال' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'روش ارسال' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'خلاصه سفارش' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'سبد خرید' }).getAttribute('href')).toBe(
      routePaths.cart,
    );
  });

  it('removes the legacy mock delivery-method choices', async () => {
    render(<CheckoutPage />);

    expect(screen.queryByRole('radio', { name: /ارسال سریع/ })).toBeNull();
    const deliveryDates = screen.getByRole('radiogroup', { name: 'انتخاب روز تحویل' });
    await waitFor(() =>
      expect(
        within(deliveryDates)
          .getByRole('radio', { name: /پنجشنبه.*۶ شهریور/ })
          .getAttribute('aria-checked'),
      ).toBe('true'),
    );
  });

  it('lets the customer choose a delivery day and time window', () => {
    render(<CheckoutPage />);

    const deliveryDate = screen.getByRole('radio', { name: /یکشنبه.*۹ شهریور/ });
    const deliveryTime = screen.getByRole('radio', { name: /۱۵ تا ۱۸.*عصر/ });

    fireEvent.click(deliveryDate);
    fireEvent.click(deliveryTime);

    expect(deliveryDate.getAttribute('aria-checked')).toBe('true');
    expect(deliveryTime.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText(/تحویل یکشنبه ۹ شهریور، ساعت/)).toBeTruthy();
    expect(useCheckoutStore.getState().checkoutInformation).toMatchObject({
      deliveryDate: { id: 'sun-9-shahrivar', weekday: 'یکشنبه', date: '۹ شهریور' },
      deliveryTimeSlot: { id: 'evening', label: '۱۵ تا ۱۸', description: 'عصر' },
    });
  });

  it('defines checkout metadata', () => {
    expect(metadata.title).toBe('ارسال و تحویل سفارش | پت شاپ پرشین');
  });
});
