import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UserOrderSummarySectionContainer } from './user-order-summary-section-container';

const { retryProfileOrderSummaryActionMock } = vi.hoisted(() => ({
  retryProfileOrderSummaryActionMock: vi.fn(),
}));

vi.mock('@/entities/profile/profile.actions', () => ({
  retryProfileOrderSummaryAction: retryProfileOrderSummaryActionMock,
}));

describe('UserOrderSummarySectionContainer', () => {
  it('renders the API response through the section renderer', async () => {
    const content = await UserOrderSummarySectionContainer({
      summaryPromise: Promise.resolve({
        isSuccess: true,
        message: null,
        data: { orders: 4, delivered: 3, lastPurchase: '2026-08-18T09:00:00.000Z' },
      }),
    });

    render(content);

    expect(screen.getByText('۴')).toBeTruthy();
    expect(screen.getByText('۳')).toBeTruthy();
  });

  it('renders a targeted retry boundary for expected summary failures', async () => {
    const content = await UserOrderSummarySectionContainer({
      summaryPromise: Promise.resolve({
        isSuccess: false,
        message: 'ارتباط با سرور برقرار نشد.',
        data: { details: {}, messages: {} },
      }),
    });

    render(content);

    expect(screen.getByRole('alert').textContent).toContain('ارتباط با سرور برقرار نشد.');
    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(retryProfileOrderSummaryActionMock).toHaveBeenCalledOnce();
  });
});
