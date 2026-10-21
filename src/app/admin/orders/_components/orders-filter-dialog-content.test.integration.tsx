import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import OrdersFilterDialogContent from './orders-filter-dialog-content';

const push = vi.fn();

vi.mock('@/hooks/use-router', () => ({ useRouter: () => ({ push }) }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('OrdersFilterDialogContent', () => {
  it('replaces the active query and resets pagination after applying filters', async () => {
    const onOpenChange = vi.fn();

    render(
      <DirectionProvider direction="rtl">
        <OrdersFilterDialogContent
          open
          initialQuery={{ deliveryState: '3', sort: 'totalPrice', limit: '20', page: '4' }}
          onOpenChange={onOpenChange}
          onExitComplete={vi.fn()}
        />
      </DirectionProvider>,
    );

    fireEvent.submit(screen.getByRole('form', { name: 'فیلتر سفارش‌ها' }));

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        '/admin/orders?deliveryState=3&sort=totalPrice&limit=20&page=1',
        { scroll: false },
      ),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
