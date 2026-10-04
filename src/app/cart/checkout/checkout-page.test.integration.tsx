import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { usePrepareOrderMutation } from '@/entities/orders/orders.client';
import { useRequestPaymentMutation } from '@/entities/payments/payments.client';
import { useCartCheckout } from '@/entities/users/cart.client';
import { usePreventPageLeave } from '@/hooks/use-prevent-page-leave';
import { useCheckoutStore } from '@/stores/checkout.store';

import CheckoutPage, { metadata } from './page';

vi.mock('./_components/address-selection/address-selection', () => ({
  CheckoutAddressSelection: () => (
    <section aria-label="انتخاب نشانی تحویل">نشانی‌های تحویل</section>
  ),
}));
vi.mock('@/entities/payments/payments.client', () => ({ useRequestPaymentMutation: vi.fn() }));
vi.mock('@/entities/orders/orders.client', () => ({ usePrepareOrderMutation: vi.fn() }));
vi.mock('@/hooks/use-prevent-page-leave', () => ({ usePreventPageLeave: vi.fn() }));
vi.mock('@/entities/users/cart.client', () => ({ useCartCheckout: vi.fn() }));

const requestPayment = vi.fn();
const prepareOrder = vi.fn();
const allowNextUnload = vi.fn();

afterEach(() => {
  useCheckoutStore.getState().clearCheckout();
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useRequestPaymentMutation).mockReturnValue({
    isPending: false,
    mutateAsync: requestPayment,
  } as never);
  vi.mocked(usePrepareOrderMutation).mockReturnValue({
    isPending: false,
    mutateAsync: prepareOrder,
  } as never);
  vi.mocked(usePreventPageLeave).mockReturnValue({ allowNextUnload } as never);
  vi.mocked(useCartCheckout).mockReturnValue({ data: null, isFetching: false } as never);
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

  it('keeps the mobile payment action disabled until a delivery time is selected', async () => {
    render(<CheckoutPage />);

    expect(
      screen
        .getAllByRole('button', { name: 'زمان ارسال را انتخاب کنید' })
        .every((button) => button.getAttribute('disabled') !== null),
    ).toBe(true);
    expect(screen.getByLabelText('پرداخت سفارش')).toBeTruthy();

    act(() =>
      useCheckoutStore.getState().saveCheckoutInformation({
        addressId: '507f1f77bcf86cd799439011',
        deliveryServiceId: '507f1f77bcf86cd799439012',
        deliveryDate: { id: 'delivery-date-1', weekday: 'شنبه' },
        deliveryTimeSlot: { id: 'delivery-time-1', label: '۹ تا ۱۲', description: '' },
      }),
    );

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'پرداخت' }).getAttribute('disabled')).toBeNull(),
    );
  });

  it('requests payment locally and protects the page while the gateway request is pending', () => {
    vi.mocked(useRequestPaymentMutation).mockReturnValue({
      isPending: true,
      mutate: requestPayment,
    } as never);
    useCheckoutStore.getState().saveCheckoutInformation({
      addressId: '507f1f77bcf86cd799439011',
      deliveryServiceId: '507f1f77bcf86cd799439012',
      deliveryDate: { id: 'delivery-date-1', weekday: 'شنبه' },
      deliveryTimeSlot: { id: 'delivery-time-1', label: '۹ تا ۱۲', description: '' },
    });

    render(<CheckoutPage />);

    expect(screen.getAllByRole('button', { name: 'انتقال به درگاه بانکی...' })).toHaveLength(2);
    expect(usePreventPageLeave).toHaveBeenCalledWith({
      force: true,
      message: 'درخواست پرداخت در حال انجام است. لطفاً تا انتقال به درگاه بانکی صبر کنید.',
    });
  });

  it('prepares the order, requests its payment, and navigates the current tab to the gateway', async () => {
    prepareOrder.mockResolvedValue({ orderId: 'order-1' });
    requestPayment.mockResolvedValue({ gatewayUrl: 'https://gateway.example.test/pay' });
    render(<CheckoutPage />);
    act(() =>
      useCheckoutStore.getState().saveCheckoutInformation({
        addressId: '507f1f77bcf86cd799439011',
        deliveryServiceId: '507f1f77bcf86cd799439012',
        deliveryDate: { id: 'delivery-date-1', weekday: 'شنبه' },
        deliveryTimeSlot: { id: 'delivery-time-1', label: '۹ تا ۱۲', description: '' },
      }),
    );

    await waitFor(() => screen.getByRole('button', { name: 'پرداخت' }));
    fireEvent.click(screen.getByRole('button', { name: 'پرداخت' }));
    fireEvent.click(screen.getByRole('button', { name: 'ادامه و پرداخت' }));

    await waitFor(() => expect(prepareOrder).toHaveBeenCalledOnce());
    expect(prepareOrder).toHaveBeenCalledWith({
      addressId: '507f1f77bcf86cd799439011',
      deliveryServiceId: '507f1f77bcf86cd799439012',
      deliveryDateId: 'delivery-date-1',
      deliveryTimeSlotId: 'delivery-time-1',
    });
    await waitFor(() => expect(requestPayment).toHaveBeenCalledWith({ orderId: 'order-1' }));
    expect(allowNextUnload).toHaveBeenCalledOnce();
  });

  it('defines checkout metadata', () => {
    expect(metadata.title).toBe('ارسال و تحویل سفارش | پت شاپ پرشین');
  });
});
