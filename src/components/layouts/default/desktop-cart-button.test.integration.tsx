import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useCartStore } from '@/stores/cart.store';

import { DesktopCartButton } from './desktop-cart-button';

function resetCart() {
  useCartStore.setState({
    items: [],
    serverCart: null,
    needsServerSync: false,
    isSyncing: false,
    lastError: null,
  });
}

afterEach(() => {
  cleanup();
  resetCart();
});

describe('DesktopCartButton', () => {
  it('shows a shining, increasing cart count badge when the cart gains items', async () => {
    render(<DesktopCartButton />);

    expect(screen.getByLabelText('سبد خرید')).toBeTruthy();

    act(() => {
      useCartStore.setState({
        items: [{ type: 'pet', petId: 'pet-1', quantity: 2 }],
      });
    });

    const count = await screen.findByText('۲');
    expect(screen.getByLabelText('سبد خرید')).toBeTruthy();
    expect(count.className).toContain('tw:animate-[cart-count-increase_260ms_ease-out]');
    expect(count.parentElement?.className).toContain(
      'tw:before:animate-[cart-badge-shine_600ms_ease-out]',
    );
  });

  it('uses the decrease animation when the cart count falls', async () => {
    useCartStore.setState({
      items: [{ type: 'pet', petId: 'pet-1', quantity: 2 }],
    });
    render(<DesktopCartButton />);

    act(() => {
      useCartStore.setState({
        items: [{ type: 'pet', petId: 'pet-1', quantity: 1 }],
      });
    });

    await waitFor(() => {
      expect(screen.getByText('۱').className).toContain(
        'tw:animate-[cart-count-decrease_260ms_ease-out]',
      );
    });
  });
});
