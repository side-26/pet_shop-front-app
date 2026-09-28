import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { useCommonStore } from '@/stores/common.store';

import CartPage, { metadata } from './page';
import { CartPageContent } from './_components/cart-page-content';
import { CartRouteLayout } from './_components/cart-route-layout';
import type { CartItem } from './_components/cart-data';

vi.mock('nextjs-toploader/app', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
}));

afterEach(() => {
  cleanup();
  act(() => useCommonStore.getState().hideConfirmDialog());
});

const cartItems: readonly CartItem[] = [
  {
    id: 'cart-item-1',
    title: 'غذای خشک سگ مدل رویال کنین Maxi Adult',
    image: '/images/product-placeholder.webp',
    detail: '۲ کیلوگرم',
    price: 800_000,
    quantity: 1,
    stock: 5,
    cartItem: {
      type: 'product',
      productId: 'product-1',
      cartEntryId: 'cart-item-1',
      quantity: 1,
      weight: {
        id: 'weight-1',
        value: 2,
        metric: 'کیلوگرم',
        quantity: 5,
        price: 800_000,
        discountPercentage: 0,
      },
    },
  },
  {
    id: 'cart-pet-1',
    title: 'گربه پرشین سفید',
    image: '/images/product-placeholder.webp',
    detail: 'پیش‌سفارش',
    price: 12_000_000,
    quantity: 1,
    stock: 1,
    cartItem: {
      type: 'pet',
      petId: 'pet-1',
      cartEntryId: 'cart-pet-1',
      quantity: 1,
    },
  },
];

describe(routePaths.cart, () => {
  it('renders the responsive cart content and order summary for a populated cart', () => {
    const { container } = render(
      <CartRouteLayout>
        <CartPageContent initialItems={cartItems} />
      </CartRouteLayout>,
    );

    expect(container.querySelector('main')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'سبد خرید' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'خلاصه سفارش' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'محصولات' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'حیوانات' })).toBeTruthy();
    expect(screen.getAllByRole('group', { name: /تعداد/ })).toHaveLength(1);
    expect(
      screen
        .getByRole('group', { name: 'تعداد غذای خشک سگ مدل رویال کنین Maxi Adult' })
        .querySelector('output')?.textContent,
    ).toBe('۱');
    expect(screen.queryByRole('group', { name: 'تعداد گربه پرشین سفید' })).toBeNull();
    expect(screen.queryByText('کد تخفیف دارید؟')).toBeNull();
    expect(screen.queryByText('۴ کالا برای ادامه خرید آماده است.')).toBeNull();
    expect(screen.queryByText('تخفیف دارد')).toBeNull();
    expect(screen.queryByText('موجود در انبار')).toBeNull();
    expect(screen.getAllByRole('button', { name: 'ادامه خرید' })).toHaveLength(2);
  });

  it('renders cart-specific route chrome and the order summary footer', () => {
    render(
      <CartRouteLayout>
        <CartPageContent initialItems={cartItems} />
      </CartRouteLayout>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'سبد خرید' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'خالی کردن سبد خرید' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'ادامه خرید' })).toHaveLength(2);
    expect(screen.getByRole('contentinfo')).toBeTruthy();
  });

  it('opens the shared confirmation dialog before removing a cart item', async () => {
    render(
      <CartRouteLayout>
        <CartPageContent initialItems={cartItems} />
      </CartRouteLayout>,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'حذف کالا از سبد خرید: غذای خشک سگ مدل رویال کنین Maxi Adult',
      }),
    );

    expect(await screen.findByRole('heading', { name: 'حذف کالا از سبد خرید' })).toBeTruthy();
    expect(
      screen.getByText(
        'آیا از حذف «غذای خشک سگ مدل رویال کنین Maxi Adult» از سبد خرید مطمئن هستید؟',
      ),
    ).toBeTruthy();
  });

  it('hides the order-summary sidebar for an empty cart', () => {
    render(<CartPageContent initialItems={[]} />);

    expect(screen.getByRole('heading', { name: 'سبد خرید شما خالی است' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'خلاصه سفارش' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'ادامه فرایند خرید' })).toBeNull();
  });

  it('renders a disabled skeleton instead of the empty state while cart data is loading', () => {
    const { container } = render(<CartPageContent isSkeleton />);

    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'سبد خرید شما خالی است' })).toBeNull();
    expect(container.querySelector('[data-cart-page] [aria-busy="true"]')).toBeTruthy();
  });

  it('adopts refreshed cart data supplied after navigation', async () => {
    const { rerender } = render(<CartPageContent initialItems={[cartItems[0]]} />);

    rerender(<CartPageContent initialItems={[cartItems[1]]} />);

    await waitFor(() => {
      expect(screen.queryByText('غذای خشک سگ مدل رویال کنین Maxi Adult')).toBeNull();
      expect(screen.getByText('گربه پرشین سفید')).toBeTruthy();
    });
  });

  it('removes a cart product through its counter', async () => {
    render(<CartPageContent initialItems={cartItems} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'حذف غذای خشک سگ مدل رویال کنین Maxi Adult' }),
    );

    return waitFor(() => {
      expect(screen.queryByText('غذای خشک سگ مدل رویال کنین Maxi Adult')).toBeNull();
    });
  });

  it('defines cart metadata', () => {
    expect(metadata.title).toBe('سبد خرید | پت شاپ پرشین');
  });
});
