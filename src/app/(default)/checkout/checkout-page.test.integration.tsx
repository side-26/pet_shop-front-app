import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import CheckoutPage, { metadata } from './page';

afterEach(cleanup);

describe(routePaths.checkout, () => {
  it('renders the shipment step, addresses, delivery methods, and order summary', () => {
    const { container } = render(<CheckoutPage />);

    expect(container.querySelector('main')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'ارسال و تحویل سفارش' })).toBeTruthy();
    expect(screen.getByRole('list', { name: 'مراحل ثبت سفارش' })).toBeTruthy();
    expect(screen.getByRole('radiogroup', { name: 'انتخاب روز تحویل' })).toBeTruthy();
    expect(screen.getByRole('radiogroup', { name: 'انتخاب بازه زمانی تحویل' })).toBeTruthy();
    expect(screen.getByText('نشانی پیش‌فرض')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'خلاصه سفارش' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'بازگشت به سبد خرید' }).getAttribute('href')).toBe(
      routePaths.cart,
    );
  });

  it('updates the selected delivery method', () => {
    render(<CheckoutPage />);

    const expressDelivery = screen.getByRole('radio', { name: /ارسال سریع/ });
    fireEvent.click(expressDelivery);

    expect(expressDelivery.getAttribute('aria-checked')).toBe('true');
    expect(screen.getAllByText('۱۲۰٬۰۰۰').length).toBeGreaterThan(0);
    const deliveryDates = screen.getByRole('radiogroup', { name: 'انتخاب روز تحویل' });
    expect(
      within(deliveryDates)
        .getByRole('radio', { name: /پنجشنبه.*۶ شهریور/ })
        .getAttribute('aria-checked'),
    ).toBe('true');
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
  });

  it('defines checkout metadata', () => {
    expect(metadata.title).toBe('ارسال و تحویل سفارش | پناهگاه پرشین');
  });
});
