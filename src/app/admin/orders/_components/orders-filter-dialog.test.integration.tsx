import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { OrdersFilterDialogHandle } from './orders-filter-dialog';
import { OrdersFilterDialog } from './orders-filter-dialog';

vi.mock('@/hooks/use-router', () => ({ useRouter: () => ({ push: vi.fn() }) }));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function renderDialog(ref: RefObject<OrdersFilterDialogHandle | null>) {
  return render(
    <DirectionProvider direction="rtl">
      <OrdersFilterDialog ref={ref} />
    </DirectionProvider>,
  );
}

describe('OrdersFilterDialog', () => {
  it('opens through its typed imperative handle and closes from cancel', async () => {
    const ref = createRef<OrdersFilterDialogHandle>();

    renderDialog(ref);
    act(() => ref.current?.open({ query: { deliveryState: '2' } }));

    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'وضعیت ارسال' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps a reopened dialog mounted when its prior close fallback completes', async () => {
    const ref = createRef<OrdersFilterDialogHandle>();

    renderDialog(ref);
    act(() => ref.current?.open({ query: {} }));
    expect(await screen.findByRole('dialog')).toBeTruthy();

    vi.useFakeTimers();
    act(() => {
      ref.current?.close();
      ref.current?.open({ query: { sort: 'totalPrice' } });
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
