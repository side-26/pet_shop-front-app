import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OrdersDialogProvider, useOrdersDialogs } from './orders-dialog-provider';

function DialogConsumer() {
  useOrdersDialogs();
  return <span>orders dialogs available</span>;
}

describe('OrdersDialogProvider', () => {
  it('makes the filter action available to its descendants', () => {
    render(
      <OrdersDialogProvider>
        <DialogConsumer />
      </OrdersDialogProvider>,
    );

    expect(screen.getByText('orders dialogs available')).toBeTruthy();
  });
});
