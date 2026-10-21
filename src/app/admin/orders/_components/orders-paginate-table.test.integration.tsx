import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { OrdersPaginateTable } from './orders-paginate-table';

vi.mock('@/components/common/table-pagination', () => ({
  TablePagination: () => <div data-testid="pagination" />,
}));

afterEach(cleanup);

const order = {
  id: 'order-1',
  orderNumber: 'ORD-1',
  trackingCode: 'TRACK-1',
  userFullName: 'علی رضایی',
  totalPrice: 250000,
  paymentStatus: 'paid' as const,
  deliveryState: 3,
};

describe('OrdersPaginateTable', () => {
  it('renders the requested order columns, status badges, and detail action', () => {
    render(<OrdersPaginateTable orders={[order]} page={1} pageCount={1} total={1} />);

    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'شماره سفارش',
      'کد رهگیری',
      'مشتری',
      'مبلغ کل',
      'وضعیت پرداخت',
      'وضعیت ارسال',
      'عملیات',
    ]);
    expect(screen.getByText('پرداخت شده')).toBeTruthy();
    expect(screen.getByText('تحویل شده')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'مشاهده جزئیات سفارش ORD-1' }).hasAttribute('disabled'),
    ).toBe(false);
  });

  it('marks skeleton data busy and disables its interactions', () => {
    const { container } = render(
      <OrdersPaginateTable orders={[order]} page={1} pageCount={1} total={1} isLoading />,
    );

    expect(container.querySelector('section')?.getAttribute('aria-busy')).toBe('true');
    expect(
      screen.getByRole('button', { name: 'مشاهده جزئیات سفارش ORD-1' }).hasAttribute('disabled'),
    ).toBe(true);
  });
});
