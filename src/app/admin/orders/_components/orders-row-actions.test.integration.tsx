import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OrdersRowActions } from './orders-row-actions';

const openDetail = vi.fn();
vi.mock('./orders-dialog-provider', () => ({
  useOrdersDialogs: () => ({ openDetail }),
}));

describe('OrdersRowActions', () => {
  it('opens the typed detail dialog for its own order', () => {
    render(<OrdersRowActions orderId="order-1" orderNumber="ORD-1" />);
    fireEvent.click(screen.getByRole('button', { name: 'مشاهده جزئیات سفارش ORD-1' }));
    expect(openDetail).toHaveBeenCalledWith('order-1');
  });
});
