import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OrdersDetailDialogMainContent } from './orders-detail-dialog-content';
import { orderDetailDialogSkeletonData } from './orders-detail-dialog-skeleton-data';

describe('OrdersDetailDialogMainContent', () => {
  it('uses the resolved layout as an accessible, non-interactive skeleton fallback', () => {
    const { container } = render(
      <OrdersDetailDialogMainContent order={orderDetailDialogSkeletonData} isSkeleton />,
    );

    const content = container.firstElementChild;
    expect(content?.getAttribute('aria-busy')).toBe('true');
    expect(content?.className).toContain('skeleton');
    expect(content?.className).toContain('tw:pointer-events-none');
    expect(screen.getByRole('heading', { name: 'اقلام سفارش' })).toBeTruthy();
    expect(screen.getByRole('listitem').textContent).toContain('محصول نمونه');
  });
});
