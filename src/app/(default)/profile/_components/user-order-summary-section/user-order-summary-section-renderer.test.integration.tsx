import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { UserOrderSummarySectionRenderer } from './user-order-summary-section-renderer';
import { userOrderSummarySectionSkeletonData } from './user-order-summary-section-skeleton-data';

afterEach(cleanup);

describe('UserOrderSummarySectionRenderer', () => {
  it('renders API-backed order metrics', () => {
    render(
      <UserOrderSummarySectionRenderer
        summary={{ orders: 4, delivered: 3, lastPurchase: '2026-08-18T09:00:00.000Z' }}
      />,
    );

    expect(screen.getByText('۴')).toBeTruthy();
    expect(screen.getByText('۳')).toBeTruthy();
    expect(screen.getByText('۲۷ مرداد')).toBeTruthy();
  });

  it('keeps the same metrics layout inaccessible while the summary streams', () => {
    render(
      <UserOrderSummarySectionRenderer summary={userOrderSummarySectionSkeletonData} isSkeleton />,
    );

    const summary = screen.getByRole('region', { name: 'خلاصه سفارش‌های من' });
    expect(summary.getAttribute('aria-busy')).toBe('true');
    expect(summary.className).toContain('skeleton');
    expect(summary.className).toContain('tw:pointer-events-none');
    expect(screen.getAllByText('—')).toHaveLength(3);
  });
});
