import { describe, expect, it } from 'vitest';

import { toPaymentResultViewModel } from './payment-result-section';

describe('toPaymentResultViewModel', () => {
  it('maps a paid gateway response to the success destination content', () => {
    const viewModel = toPaymentResultViewModel({
      isSuccess: true,
      message: null,
      data: {
        status: 'paid',
        finalPrice: 250_000,
        companyName: 'زرین‌پال',
        appUrl: 'https://petshop.example.test',
      },
    });

    expect(viewModel).toMatchObject({
      isSuccess: true,
      amount: 250_000,
      companyName: 'زرین‌پال',
      title: 'پرداخت شما با موفقیت انجام شد',
    });
    expect(String(viewModel.illustrations.light)).toContain('Payment%20success%20illustration');
    expect(String(viewModel.illustrations.dark)).toContain('payment-success-image-dark');
  });

  it('maps gateway failures and non-paid statuses to retry-payment content', () => {
    const failedPayment = toPaymentResultViewModel({
      isSuccess: true,
      message: null,
      data: {
        status: 'failed',
        finalPrice: 250_000,
        companyName: 'زرین‌پال',
        appUrl: 'https://petshop.example.test',
      },
    });
    const failedRequest = toPaymentResultViewModel({
      isSuccess: false,
      message: 'پرداخت یافت نشد.',
      data: { messages: {}, details: {} },
    });

    expect(failedPayment.isSuccess).toBe(false);
    expect(failedRequest).toMatchObject({ isSuccess: false, subtitle: 'پرداخت یافت نشد.' });
    expect(String(failedPayment.illustrations.light)).toContain('payment-failed-image-light');
    expect(String(failedPayment.illustrations.dark)).toContain('pament-failed-image-dark');
  });
});
